from fastapi import APIRouter, HTTPException
from typing import List
from .. import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.EmailConfig])
async def get_email_configs():
    return await models.EmailConfig.find_all().to_list()

@router.post("/", response_model=schemas.EmailConfig)
async def create_email_config(config: schemas.EmailConfigCreate):
    # Simple implementation: deactivate old ones if new one is active
    if config.is_active:
        await models.EmailConfig.find(models.EmailConfig.is_active == True).update({"$set": {"is_active": False}})
    
    db_config = models.EmailConfig(**config.dict())
    await db_config.insert()
    return db_config

@router.delete("/{config_id}")
async def delete_config(config_id: str):
    config = await models.EmailConfig.get(config_id)
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    await config.delete()
    return {"message": "Config deleted"}

@router.post("/smtp")
async def set_smtp_config():
    return {"message": "SMTP configuration updated"}

@router.post("/template")
async def create_template():
    return {"message": "Template saved"}
