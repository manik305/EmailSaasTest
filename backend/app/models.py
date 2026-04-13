from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Recipient(Base):
    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    name = Column(String)
    status = Column(String, default="pending")  # pending, sent, bounced, replied
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="recipients")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    target_segment = Column(String)
    schedule = Column(String)  # Daily, Weekly, Once
    status = Column(String, default="draft")  # draft, active, completed, paused
    created_at = Column(DateTime, default=datetime.utcnow)

    recipients = relationship("Recipient", back_populates="campaign")

class EmailConfig(Base):
    __tablename__ = "email_configs"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, nullable=False)  # google, microsoft, smtp
    sender_address = Column(String, nullable=False)
    settings_json = Column(JSON)  # Store host, port, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(String)
    time = Column(String)
    attendee_email = Column(String)
    meet_link = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
