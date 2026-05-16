from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models import VoiceAgent
from pydantic import BaseModel

router = APIRouter()

class VoiceAgentCreate(BaseModel):
    name: str
    agent_id: str
    phone_number: str = None
    provider: str = "vapi"

@router.get("/", response_model=List[VoiceAgent])
async def get_voice_agents():
    return await VoiceAgent.find_all().to_list()

@router.post("/", response_model=VoiceAgent)
async def create_voice_agent(agent: VoiceAgentCreate):
    new_agent = VoiceAgent(**agent.dict())
    await new_agent.insert()
    return new_agent

@router.delete("/{agent_id}")
async def delete_voice_agent(agent_id: str):
    agent = await VoiceAgent.find_one(VoiceAgent.id == agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    await agent.delete()
    return {"message": "Agent deleted successfully"}
