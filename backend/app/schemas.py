from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime

class RecipientBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    industry: Optional[str] = None
    region: Optional[str] = None
    status: str = "pending"

class RecipientCreate(RecipientBase):
    campaign_id: Optional[str] = None

class Recipient(RecipientBase):
    id: str
    campaign_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CampaignBase(BaseModel):
    name: str
    target_segment: Optional[str] = None
    schedule: Optional[str] = "Once"

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

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
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
