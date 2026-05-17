"""
scheduler.py
~~~~~~~~~~~~
APScheduler-based job that fires campaign sends at their `send_at` time.

The scheduler polls every 60 seconds, finds campaigns with:
  - status = "draft" or "active"
  - send_at <= now (UTC)
  - email_config_id set

…and triggers the SMTP batch send.
"""
import asyncio
import logging
from datetime import datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from beanie.operators import In, NE

logger = logging.getLogger(__name__)

_scheduler: AsyncIOScheduler | None = None


async def _run_scheduled_campaigns() -> None:
    """Check for campaigns that are due and fire SMTP sends."""
    from .models import Campaign, Recipient, EmailConfig
    from .email_service import send_email
    from beanie import PydanticObjectId

    now_iso = datetime.now(timezone.utc).isoformat()

    # Find campaigns that are scheduled and due
    candidates = await Campaign.find(
        In(Campaign.status, ["draft", "active"]),
        NE(Campaign.send_at, None),
        NE(Campaign.email_config_id, None),
    ).to_list()

    for campaign in candidates:
        if not campaign.send_at:
            continue
        try:
            # Parse send_at — accept naive ISO string (treat as UTC)
            send_dt_str = campaign.send_at.replace("Z", "+00:00")
            send_dt = datetime.fromisoformat(send_dt_str)
            if send_dt.tzinfo is None:
                send_dt = send_dt.replace(tzinfo=timezone.utc)
        except ValueError:
            logger.warning("Campaign %s has invalid send_at: %s", campaign.id, campaign.send_at)
            continue

        if send_dt > datetime.now(timezone.utc):
            continue  # not due yet

        # Load email config
        try:
            config = await EmailConfig.get(PydanticObjectId(campaign.email_config_id))
        except Exception:
            config = None
        if not config:
            logger.warning("Campaign %s: EmailConfig %s not found, skipping.", campaign.id, campaign.email_config_id)
            continue

        # Load pending recipients
        recipients = await Recipient.find(
            Recipient.campaign_id == str(campaign.id),
            Recipient.status == "pending",
        ).to_list()

        if not recipients:
            logger.info("Campaign %s: no pending recipients, marking completed.", campaign.id)
            await campaign.update({"$set": {"status": "completed", "send_at": None}})
            continue

        subject = campaign.subject or f"Message from {config.sender_name or config.sender_address}"
        body_tpl = campaign.body_template or "Hi {name},\n\nThis is an outreach from our team.\n\nBest regards"

        sent, failed = 0, 0
        for r in recipients:
            body = (
                body_tpl
                .replace("{name}", r.name or "there")
                .replace("{email}", r.email)
                .replace("{designation}", r.designation or "")
                .replace("{department}", r.department or "")
                .replace("{industry}", r.industry or "")
                .replace("{region}", r.region or "")
            )
            try:
                await send_email(config=config, to_address=r.email, subject=subject, body=body)
                await r.update({"$set": {"status": "sent"}})
                sent += 1
            except Exception as exc:
                logger.error("Failed sending to %s: %s", r.email, exc)
                await r.update({"$set": {"status": "bounced"}})
                failed += 1

        # Clear send_at so it doesn't re-fire; mark active/completed
        new_status = "active" if failed == 0 else "active"
        await campaign.update({"$set": {"status": new_status, "send_at": None}})
        logger.info(
            "✅ Scheduled send for campaign '%s': sent=%d failed=%d",
            campaign.name, sent, failed
        )


def start_scheduler() -> None:
    global _scheduler
    _scheduler = AsyncIOScheduler(timezone="UTC")
    _scheduler.add_job(
        _run_scheduled_campaigns,
        trigger="interval",
        seconds=60,
        id="campaign_scheduler",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("📅 Campaign scheduler started (polls every 60s)")


def stop_scheduler() -> None:
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("Campaign scheduler stopped")
