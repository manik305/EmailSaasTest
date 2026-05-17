import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "emailsaas")


async def init_db() -> None:
    """Initialise Beanie ODM against MongoDB Atlas (or a local mongod)."""
    # Import models here to avoid circular imports
    from .models import Recipient, Campaign, EmailConfig, Meeting, VoiceAgent, SocialPost

    # Warn clearly if the placeholder URI is still in place
    if "<user>" in MONGODB_URL or "<password>" in MONGODB_URL or "<cluster>" in MONGODB_URL:
        raise RuntimeError(
            "MONGODB_URL in .env still contains placeholder values. "
            "Replace <user>, <password>, and <cluster> with your real MongoDB Atlas credentials."
        )

    # Motor picks up TLS automatically from the srv:// scheme.
    # tlsAllowInvalidCertificates=True is only needed when you hit SSL issues
    # on certain corporate proxies — leave False in production.
    client = AsyncIOMotorClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=10_000,
    )

    try:
        await init_beanie(
            database=client[DATABASE_NAME],
            document_models=[
                Recipient,
                Campaign,
                EmailConfig,
                Meeting,
                VoiceAgent,
                SocialPost,
            ],
        )
        logger.info("✅  Connected to MongoDB database: %s", DATABASE_NAME)
    except Exception as exc:
        logger.error(
            "❌  Could not connect to MongoDB (%s). "
            "Make sure your Atlas URI is correct and your IP is whitelisted. Error: %s",
            MONGODB_URL[:60] + "...",
            exc,
        )
        raise
