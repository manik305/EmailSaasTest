from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.EmailConfig])
def get_email_configs(db: Session = Depends(get_db)):
    return db.query(models.EmailConfig).all()

@router.post("/", response_model=schemas.EmailConfig)
def create_email_config(config: schemas.EmailConfigCreate, db: Session = Depends(get_db)):
    # Simple implementation: deactivate old ones if new one is active
    if config.is_active:
        db.query(models.EmailConfig).update({models.EmailConfig.is_active: False})
    
    db_config = models.EmailConfig(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

@router.delete("/{config_id}")
def delete_config(config_id: int, db: Session = Depends(get_db)):
    config = db.query(models.EmailConfig).filter(models.EmailConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    db.delete(config)
    db.commit()
    return {"message": "Config deleted"}

@router.post("/smtp")
async def set_smtp_config():
    # Keep stub for now or expand if needed
    return {"message": "SMTP configuration updated"}

@router.post("/template")
async def create_template():
    return {"message": "Template saved"}
