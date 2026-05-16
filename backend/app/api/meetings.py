import os
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv
from .. import models

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

@router.post("/schedule")
async def schedule_meeting(request: MeetingRequest):
    try:
        meeting_date = datetime.strptime(request.date, "%Y-%m-%d")
        meeting_time = datetime.strptime(request.time_slot, "%H:%M")
        
        scheduled_dt = meeting_date.replace(
            hour=meeting_time.hour,
            minute=meeting_time.minute
        )
        
        if scheduled_dt < datetime.now():
            raise HTTPException(status_code=400, detail="Cannot schedule a meeting in the past.")
        
        meet_code = uuid.uuid4().hex[:12]
        meet_link = f"https://meet.google.com/{meet_code[:3]}-{meet_code[3:7]}-{meet_code[7:]}"
        
        meeting = models.Meeting(
            title=request.title,
            scheduled_at=scheduled_dt,
            duration_minutes=request.duration_minutes,
            google_meet_link=meet_link,
            organizer=GMAIL_USER,
            attendee_email=request.attendee_email,
            status="confirmed"
        )
        await meeting.insert()
        return meeting
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid date/time format. Use YYYY-MM-DD for date and HH:MM for time."
        )

@router.get("/list")
async def list_meetings():
    meetings = await models.Meeting.find_all().to_list()
    return {"meetings": meetings, "total": len(meetings)}

@router.get("/available-slots")
async def get_available_slots(date: str):
    # Simplified availability check
    all_slots = []
    for hour in range(9, 17):
        for minute in [0, 30]:
            slot = f"{hour:02d}:{minute:02d}"
            all_slots.append({"time": slot, "available": True})
    return {"date": date, "slots": all_slots}
