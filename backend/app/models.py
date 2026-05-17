from typing import List, Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import BaseModel, Field, EmailStr


# ─── Recipient ────────────────────────────────────────────────────────────────

class Recipient(Document):
    email: Indexed(str)
    name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    alternative_email: Optional[str] = None
    designation: Optional[str] = None  # corresponds to 'title'
    department: Optional[str] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    linkedin_id: Optional[str] = None
    industry: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    country: Optional[str] = None
    region: Optional[str] = None
    status: str = "pending"  # pending, sent, bounced, replied
    campaign_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recipients"


# ─── EmailConfig (per-campaign SMTP + IMAP) ───────────────────────────────────

class SmtpSettings(BaseModel):
    """SMTP delivery settings stored inside EmailConfig.settings_json."""
    host: str = "smtp.gmail.com"
    port: int = 587
    username: str
    password: str          # stored encrypted in production; plaintext here for MVP
    use_tls: bool = True   # True → STARTTLS on port 587


class ImapSettings(BaseModel):
    """IMAP inbox-read settings stored inside EmailConfig.imap_json."""
    host: str = "imap.gmail.com"
    port: int = 993
    username: str
    password: str
    use_ssl: bool = True   # True → SSL on port 993


class EmailConfig(Document):
    """
    Holds outbound (SMTP) and inbound (IMAP) credentials for a single
    email account / G Suite account that a campaign sends from.
    """
    name: str = "Default"           # human-readable label, e.g. "Sales Gmail"
    provider: str = "smtp"          # google | microsoft | smtp | other
    sender_address: str             # the From: address
    sender_name: Optional[str] = None

    # SMTP – stored as a nested dict so we can swap SmtpSettings in/out
    smtp: SmtpSettings

    # IMAP – optional; required to read campaign inbox
    imap: Optional[ImapSettings] = None

    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "email_configs"


# ─── Campaign ─────────────────────────────────────────────────────────────────

class Campaign(Document):
    name: str
    target_segment: Optional[str] = None
    schedule: Optional[str] = "Once"  # Daily, Weekly, Once
    status: str = "draft"             # draft, active, completed, paused

    # FK → EmailConfig._id  (set when campaign is created or updated)
    email_config_id: Optional[str] = None

    # Email content / template
    subject: Optional[str] = None
    body_template: Optional[str] = None  # plain text; {name}, {company} etc.

    # Scheduled send time as ISO-8601 string e.g. "2026-05-20T09:00:00"
    send_at: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "campaigns"


# ─── Meeting ──────────────────────────────────────────────────────────────────

class Meeting(Document):
    title: str
    date: str
    time: str
    attendee_email: str
    meet_link: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "meetings"


# ─── VoiceAgent ───────────────────────────────────────────────────────────────

class VoiceAgent(Document):
    name: str
    provider: str = "vapi"  # vapi, twilio
    agent_id: str
    phone_number: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "voice_agents"


# ─── SocialPost ───────────────────────────────────────────────────────────────

class SocialPost(Document):
    platform: str  # linkedin, twitter, facebook
    content: str
    media_urls: List[str] = []
    scheduled_for: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, published, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "social_posts"
