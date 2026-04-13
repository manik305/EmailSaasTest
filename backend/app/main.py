from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.api import auth, campaign, data, config, chat, meetings

# Initialize DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SaaS Email Campaign API")

# CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(campaign.router, prefix="/api/v1/campaigns", tags=["Campaigns"])
app.include_router(data.router, prefix="/api/v1/data", tags=["Data"])
app.include_router(config.router, prefix="/api/v1/config", tags=["Email Configuration"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat / AI Copilot"])
app.include_router(meetings.router, prefix="/api/v1/meetings", tags=["Meeting Scheduler"])

@app.get("/")
async def root():
    return {"message": "Welcome to the SaaS Email Campaign API"}
