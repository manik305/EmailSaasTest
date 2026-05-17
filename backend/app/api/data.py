"""
data.py  –  /api/v1/data
~~~~~~~~~~~~~~~~~~~~~~~~~
Routes
  POST  /upload                         – upload CSV/Excel of leads
  GET   /recipients                     – list all recipients
  GET   /recipients/by-campaign/{id}    – recipients for a specific campaign
  POST  /recipients/assign              – bulk-assign recipients to a campaign
  PATCH /recipients/{id}/campaign       – assign single recipient to campaign
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Body
import pandas as pd
import io
from .. import models, schemas
from typing import List, Optional
from beanie import PydanticObjectId
from pydantic import BaseModel

router = APIRouter()


# ─── Upload ───────────────────────────────────────────────────────────────────

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

        email_col = next((c for c in df.columns if 'email' in c.lower()), None)
        name_col  = next((c for c in df.columns if 'name'  in c.lower()), None)
        des_col   = next((c for c in df.columns if 'designation' in c.lower()), None)
        dep_col   = next((c for c in df.columns if 'department'  in c.lower()), None)
        ind_col   = next((c for c in df.columns if 'industry'    in c.lower()), None)
        reg_col   = next((c for c in df.columns if 'region' in c.lower() or 'state' in c.lower()), None)

        if not email_col:
            raise HTTPException(status_code=400, detail="Could not find an email column")

        count = 0
        for _, row in df.iterrows():
            email = str(row[email_col]).strip()
            if not email or '@' not in email:
                continue
            existing = await models.Recipient.find_one(models.Recipient.email == email)
            if not existing:
                await models.Recipient(
                    email=email,
                    name=str(row[name_col]).strip() if name_col else None,
                    designation=str(row[des_col]).strip() if des_col else None,
                    department=str(row[dep_col]).strip() if dep_col else None,
                    industry=str(row[ind_col]).strip() if ind_col else None,
                    region=str(row[reg_col]).strip() if reg_col else None,
                ).insert()
                count += 1

        return {"filename": file.filename, "status": "success", "rows_added": count}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


# ─── List recipients ──────────────────────────────────────────────────────────

@router.get("/recipients", response_model=List[schemas.Recipient])
async def list_recipients():
    return await models.Recipient.find_all().sort("-created_at").to_list()


@router.get("/recipients/by-campaign/{campaign_id}", response_model=List[schemas.Recipient])
async def recipients_by_campaign(campaign_id: str):
    """Return all recipients that belong to a specific campaign."""
    return (
        await models.Recipient.find(models.Recipient.campaign_id == campaign_id)
        .sort("-created_at")
        .to_list()
    )


# ─── Assign recipients to a campaign ─────────────────────────────────────────

class BulkAssignRequest(BaseModel):
    campaign_id: str
    recipient_ids: List[str]          # list of Recipient ObjectId strings


@router.post("/recipients/assign", response_model=dict)
async def bulk_assign_recipients(req: BulkAssignRequest):
    """
    Assign a list of recipients to a campaign.
    Sets status=pending so the campaign send job will pick them up.
    """
    # Validate campaign exists
    try:
        c_oid = PydanticObjectId(req.campaign_id)
    except Exception:
        raise HTTPException(status_code=422, detail="Invalid campaign_id")
    if not await models.Campaign.get(c_oid):
        raise HTTPException(status_code=404, detail="Campaign not found")

    updated = 0
    for rid in req.recipient_ids:
        try:
            r_oid = PydanticObjectId(rid)
        except Exception:
            continue
        recipient = await models.Recipient.get(r_oid)
        if recipient:
            await recipient.update({"$set": {
                "campaign_id": req.campaign_id,
                "status": "pending",
            }})
            updated += 1

    return {"assigned": updated, "campaign_id": req.campaign_id}


@router.patch("/recipients/{recipient_id}/campaign", response_model=schemas.Recipient)
async def assign_single_recipient(recipient_id: str, campaign_id: str = Body(..., embed=True)):
    """Assign (or re-assign) a single recipient to a campaign."""
    try:
        r_oid = PydanticObjectId(recipient_id)
    except Exception:
        raise HTTPException(status_code=422, detail="Invalid recipient_id")
    recipient = await models.Recipient.get(r_oid)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    if campaign_id:
        try:
            c_oid = PydanticObjectId(campaign_id)
        except Exception:
            raise HTTPException(status_code=422, detail="Invalid campaign_id")
        if not await models.Campaign.get(c_oid):
            raise HTTPException(status_code=404, detail="Campaign not found")

    await recipient.update({"$set": {"campaign_id": campaign_id, "status": "pending"}})
    await recipient.sync()
    return recipient
