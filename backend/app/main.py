from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.scheduler import start_scheduler, stop_scheduler
from app.api import auth, campaign, data, config, chat, meetings, voice, social


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── startup ──
    await init_db()
    start_scheduler()
    yield
    # ── shutdown ──
    stop_scheduler()


app = FastAPI(title="SaaS Email Campaign API", lifespan=lifespan)

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/api/v1/auth",      tags=["Authentication"])
app.include_router(campaign.router, prefix="/api/v1/campaigns",  tags=["Campaigns"])
app.include_router(data.router,     prefix="/api/v1/data",       tags=["Data"])
app.include_router(config.router,   prefix="/api/v1/config",     tags=["Email Configuration"])
app.include_router(chat.router,     prefix="/api/v1/chat",       tags=["Chat / AI Copilot"])
app.include_router(meetings.router, prefix="/api/v1/meetings",   tags=["Meeting Scheduler"])
app.include_router(voice.router,    prefix="/api/v1/voice",      tags=["Voice Calling Agents"])
app.include_router(social.router,   prefix="/api/v1/social",     tags=["Social Media Hub"])


@app.get("/")
async def root():
    return {"message": "Welcome to the SaaS Email Campaign API"}
