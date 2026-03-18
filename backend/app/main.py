from fastapi import FastAPI
from app.api import auth, campaign, data, config

app = FastAPI(title="SaaS Email Campaign API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(campaign.router, prefix="/api/v1/campaigns", tags=["Campaigns"])
app.include_router(data.router, prefix="/api/v1/data", tags=["Data"])
app.include_router(config.router, prefix="/api/v1/config", tags=["Email Configuration"])

@app.get("/")
async def root():
    return {"message": "Welcome to the SaaS Email Campaign API"}
