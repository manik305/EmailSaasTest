from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_campaigns():
    return {"campaigns": []}

@router.post("/")
async def create_campaign():
    return {"message": "Campaign created"}
