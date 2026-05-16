from fastapi import APIRouter, HTTPException
from typing import List
from app.models import SocialPost
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class SocialPostCreate(BaseModel):
    platform: str
    content: str
    media_urls: List[str] = []
    scheduled_for: datetime = None

@router.get("/", response_model=List[SocialPost])
async def get_social_posts():
    return await SocialPost.find_all().to_list()

@router.post("/", response_model=SocialPost)
async def create_social_post(post: SocialPostCreate):
    new_post = SocialPost(**post.dict())
    await new_post.insert()
    return new_post

@router.post("/{post_id}/publish")
async def publish_social_post(post_id: str):
    post = await SocialPost.get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Logic to call LinkedIn/Twitter/Facebook APIs would go here
    post.status = "published"
    await post.save()
    return {"message": f"Successfully published to {post.platform}"}
