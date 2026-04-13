from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from .. import models, schemas
from typing import List

router = APIRouter()

@router.get("/", response_model=List[schemas.Campaign])
async def get_campaigns(db: Session = Depends(get_db)):
    return db.query(models.Campaign).order_by(models.Campaign.created_at.desc()).all()

@router.post("/", response_model=schemas.Campaign)
async def create_campaign(campaign_in: schemas.CampaignCreate, db: Session = Depends(get_db)):
    new_campaign = models.Campaign(
        name=campaign_in.name,
        target_segment=campaign_in.target_segment,
        schedule=campaign_in.schedule,
        status="active"
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    return new_campaign

@router.get("/metrics", response_model=schemas.CampaignMetrics)
async def get_metrics(db: Session = Depends(get_db)):
    # In a real app, these would come from tracking tables
    total_recipients = db.query(models.Recipient).count()
    sent_count = db.query(models.Recipient).filter(models.Recipient.status == "sent").count()
    
    # Mocking some rates for now but based on real totals
    return {
        "totalEmailsSent": sent_count if sent_count > 0 else 1250, # Falling back to mock if empty
        "openRate": 24.5,
        "clickRate": 12.8,
        "dataProcessedCount": total_recipients
    }
