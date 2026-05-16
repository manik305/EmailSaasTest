from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
from .. import models, schemas
from typing import List

router = APIRouter()

@router.post("/upload", response_model=dict)
async def upload_data(file: UploadFile = File(...)):
    content = await file.read()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
            
        # Normalization
        email_col = next((c for c in df.columns if 'email' in c.lower()), None)
        name_col = next((c for c in df.columns if 'name' in c.lower()), None)
        des_col = next((c for c in df.columns if 'designation' in c.lower()), None)
        dep_col = next((c for c in df.columns if 'department' in c.lower()), None)
        ind_col = next((c for c in df.columns if 'industry' in c.lower()), None)
        reg_col = next((c for c in df.columns if 'region' in c.lower() or 'state' in c.lower()), None)
        
        if not email_col:
            raise HTTPException(status_code=400, detail="Could not find an email column")
            
        count = 0
        for _, row in df.iterrows():
            email = str(row[email_col]).strip()
            if not email or '@' not in email:
                continue
                
            # Check if exists
            existing = await models.Recipient.find_one(models.Recipient.email == email)
            if not existing:
                new_recipient = models.Recipient(
                    email=email,
                    name=str(row[name_col]).strip() if name_col else None,
                    designation=str(row[des_col]).strip() if des_col else None,
                    department=str(row[dep_col]).strip() if dep_col else None,
                    industry=str(row[ind_col]).strip() if ind_col else None,
                    region=str(row[reg_col]).strip() if reg_col else None
                )
                await new_recipient.insert()
                count += 1
                
        return {"filename": file.filename, "status": "success", "rows_added": count}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/recipients", response_model=List[schemas.Recipient])
async def list_recipients():
    return await models.Recipient.find_all().sort("-created_at").to_list()
