from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import io
from ..database import get_db
from .. import models, schemas

router = APIRouter()

@router.post("/upload", response_model=dict)
async def upload_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
            
        # Basic normalization: find 'email' and 'name' columns
        email_col = next((c for c in df.columns if 'email' in c.lower()), None)
        name_col = next((c for c in df.columns if 'name' in c.lower()), None)
        
        if not email_col:
            raise HTTPException(status_code=400, detail="Could not find an email column")
            
        count = 0
        for _, row in df.iterrows():
            email = str(row[email_col]).strip()
            if not email or '@' not in email:
                continue
                
            name = str(row[name_col]).strip() if name_col else ""
            
            # Check if exists
            existing = db.query(models.Recipient).filter(models.Recipient.email == email).first()
            if not existing:
                new_recipient = models.Recipient(email=email, name=name)
                db.add(new_recipient)
                count += 1
                
        db.commit()
        return {"filename": file.filename, "status": "success", "rows_added": count}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/recipients", response_model=list[schemas.Recipient])
async def list_recipients(db: Session = Depends(get_db)):
    return db.query(models.Recipient).order_by(models.Recipient.created_at.desc()).all()
