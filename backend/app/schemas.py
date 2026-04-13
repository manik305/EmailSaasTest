from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class RecipientBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    status: str = "pending"

class RecipientCreate(RecipientBase):
    pass

class Recipient(RecipientBase):
    id: int
    campaign_id: Optional[int] = None
    created_at: datetime

    class Config:
        orm_mode = True

class CampaignBase(BaseModel):
    name: str
    target_segment: Optional[str] = None
    schedule: Optional[str] = "Once"

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class CampaignMetrics(BaseModel):
    totalEmailsSent: int
    openRate: float
    clickRate: float
    dataProcessedCount: int

class EmailConfigBase(BaseModel):
    provider: str
    sender_address: EmailStr
    settings_json: Optional[dict] = None
    is_active: bool = True

class EmailConfigCreate(EmailConfigBase):
    pass

class EmailConfig(EmailConfigBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
