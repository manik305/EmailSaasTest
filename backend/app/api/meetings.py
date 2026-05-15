import os
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GMAIL_USER = os.getenv("GMAIL_USER", "test@gmail.com")

class MeetingRequest(BaseModel):
    title: str
    date: str          # ISO date string like "2026-04-15"
    time_slot: str     # Time like "14:00"
    duration_minutes: int = 30
    attendee_email: Optional[str] = None
    description: Optional[str] = None

class MeetingResponse(BaseModel):
    meeting_id: str
    title: str
    scheduled_date: str
    scheduled_time: str
    duration_minutes: int
    google_meet_link: str
    organizer: str
    attendee_email: Optional[str]
    status: str

# In-memory store for test meetings
meetings_store: list = []

@router.post("/schedule", response_model=MeetingResponse)
async def schedule_meeting(request: MeetingRequest):
    """
    Schedule a meeting and generate a Google Meet link.
    For this test/prototype phase, we generate a deterministic test link.
    In production, this would use the Google Calendar API with OAuth2.
    """
    try:
        # Parse and validate the date/time
        meeting_date = datetime.strptime(request.date, "%Y-%m-%d")
        meeting_time = datetime.strptime(request.time_slot, "%H:%M")
        
        # Combine into a full datetime
        scheduled_dt = meeting_date.replace(
            hour=meeting_time.hour,
            minute=meeting_time.minute
        )
        
        # Ensure the meeting is in the future
        if scheduled_dt < datetime.now():
            raise HTTPException(
                status_code=400,
                detail="Cannot schedule a meeting in the past."
            )
        
        # Generate a deterministic meeting ID
        meeting_id = str(uuid.uuid4())[:12]
        
        # Generate a test Google Meet link
        # In production: use google-api-python-client with Calendar API
        meet_code = uuid.uuid4().hex[:12]
        meet_link = f"https://meet.google.com/{meet_code[:3]}-{meet_code[3:7]}-{meet_code[7:]}"
        
        meeting = MeetingResponse(
            meeting_id=meeting_id,
            title=request.title,
            scheduled_date=request.date,
            scheduled_time=request.time_slot,
            duration_minutes=request.duration_minutes,
            google_meet_link=meet_link,
            organizer=GMAIL_USER,
            attendee_email=request.attendee_email,
            status="confirmed"
        )
        
        meetings_store.append(meeting.dict())
        
        return meeting
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid date/time format. Use YYYY-MM-DD for date and HH:MM for time. Error: {str(e)}"
        )

@router.get("/list")
async def list_meetings():
    """List all scheduled meetings."""
    return {"meetings": meetings_store, "total": len(meetings_store)}

@router.get("/available-slots")
async def get_available_slots(date: str):
    """
    Get available time slots for a given date.
    Returns 30-minute slots from 9:00 AM to 5:00 PM,
    excluding already-booked slots.
    """
    booked_times = {
        m["scheduled_time"] 
        for m in meetings_store 
        if m["scheduled_date"] == date
    }
    
    all_slots = []
    for hour in range(9, 17):
        for minute in [0, 30]:
            slot = f"{hour:02d}:{minute:02d}"
            all_slots.append({
                "time": slot,
                "available": slot not in booked_times
            })
    
    return {"date": date, "slots": all_slots}
