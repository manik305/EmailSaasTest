from typing import List, Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import BaseModel, Field

class Recipient(Document):
    email: Indexed(str)
    name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    industry: Optional[str] = None
    region: Optional[str] = None
    status: str = "pending"  # pending, sent, bounced, replied
    campaign_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recipients"

class Campaign(Document):
    name: str
    target_segment: Optional[str] = None
    schedule: Optional[str] = "Once"  # Daily, Weekly, Once
    status: str = "draft"  # draft, active, completed, paused
    smtp_config_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "campaigns"

class EmailConfig(Document):
    provider: str  # google, microsoft, smtp
    sender_address: str
    settings_json: dict = {}  # host, port, username, password
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "email_configs"

class Meeting(Document):
    title: str
    date: str
    time: str
    attendee_email: str
    meet_link: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "meetings"

class VoiceAgent(Document):
    name: str
    provider: str = "vapi"  # vapi, twilio
    agent_id: str
    phone_number: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "voice_agents"

class SocialPost(Document):
    platform: str  # linkedin, twitter, facebook
    content: str
    media_urls: List[str] = []
    scheduled_for: Optional[datetime] = None
    status: str = "draft"  # draft, scheduled, published, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "social_posts"
