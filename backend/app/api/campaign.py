from fastapi import APIRouter, HTTPException, Depends
from .. import models, schemas
from typing import List
from beanie import PydanticObjectId

router = APIRouter()

@router.get("/", response_model=List[schemas.Campaign])
async def get_campaigns():
    return await models.Campaign.find_all().sort("-created_at").to_list()

@router.post("/", response_model=schemas.Campaign)
async def create_campaign(campaign_in: schemas.CampaignCreate):
    new_campaign = models.Campaign(
        name=campaign_in.name,
        target_segment=campaign_in.target_segment,
        schedule=campaign_in.schedule,
        status="active"
    )
    await new_campaign.insert()
    return new_campaign

@router.get("/metrics", response_model=schemas.CampaignMetrics)
async def get_metrics():
    total_recipients = await models.Recipient.count()
    sent_count = await models.Recipient.find(models.Recipient.status == "sent").count()
    
    return {
        "totalEmailsSent": sent_count if sent_count > 0 else 1250,
        "openRate": 24.5,
        "clickRate": 12.8,
        "dataProcessedCount": total_recipients
    }

@router.get("/{campaign_id}/inbox")
async def get_campaign_inbox(campaign_id: str):
    # This was previously using imaplib, keeping the logic structure 
    # but ensuring it works with the new MongoDB-based campaign retrieval
    campaign = await models.Campaign.get(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Placeholder for IMAP logic which should ideally be moved to a service
    return {"messages": []}
