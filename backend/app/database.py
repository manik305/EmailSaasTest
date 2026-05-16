import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "emailsaas")

async def init_db():
    # Import models here to avoid circular imports
    from .models import Recipient, Campaign, EmailConfig, Meeting, VoiceAgent, SocialPost
    
    client = AsyncIOMotorClient(MONGODB_URL)
    await init_beanie(
        database=client[DATABASE_NAME],
        document_models=[
            Recipient, 
            Campaign, 
            EmailConfig, 
            Meeting,
            VoiceAgent,
            SocialPost
        ]
    )
    print(f"Connected to MongoDB: {DATABASE_NAME}")
