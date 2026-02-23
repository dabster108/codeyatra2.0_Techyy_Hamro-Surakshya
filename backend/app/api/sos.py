"""
SOS Emergency Request API
=========================
Minimal SOS: citizen taps button → sends name + GPS → shows up on gov/province dashboards.

Public:
  POST /sos/request        — Submit emergency (just name + location)

Government/Province:
  GET  /sos/requests       — List all SOS alerts (filterable)
  PUT  /sos/request/:id    — Update status (acknowledge, dispatch, resolve)
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.db.supabase import get_supabase_admin
import traceback

router = APIRouter(prefix="/sos", tags=["sos"])


def _supabase():
    return get_supabase_admin()


# ── Models ──────────────────────────────────────────────────────────────────

class SOSRequestCreate(BaseModel):
    full_name: str = Field(default="Unknown Citizen")
    contact_number: Optional[str] = Field(default="N/A")
    gps_lat: Optional[float] = None
    gps_long: Optional[float] = None


class SOSStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|acknowledged|dispatched|resolved|cancelled)$")
    response_team: Optional[str] = None
    notes: Optional[str] = None


# ── Public: send SOS ────────────────────────────────────────────────────────

@router.post("/request")
async def create_sos_request(request: SOSRequestCreate):
    supabase = _supabase()

    try:
        result = supabase.table("sos_requests").insert({
            "full_name": request.full_name,
            "contact_number": request.contact_number or "N/A",
            "gps_lat": request.gps_lat,
            "gps_long": request.gps_long,
            "status": "pending",
        }).execute()

        if not result.data:
            raise HTTPException(status_code=400, detail="Failed to create SOS request")

        return {
            "success": True,
            "message": "Emergency alert sent. Help is on the way!",
            "request_id": result.data[0]["id"],
        }

    except Exception as e:
        print(f"SOS create error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ── Government / Province: list SOS alerts ──────────────────────────────────

@router.get("/requests")
async def get_sos_requests(
    status: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
):
    supabase = _supabase()

    try:
        query = supabase.table("sos_requests").select("*")

        if status:
            query = query.eq("status", status)

        query = query.order("created_at", desc=True).limit(limit)
        result = query.execute()

        return {
            "success": True,
            "count": len(result.data or []),
            "requests": result.data or [],
        }

    except Exception as e:
        print(f"SOS list error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ── Government / Province: update SOS status ────────────────────────────────

@router.put("/request/{request_id}")
async def update_sos_request(request_id: str, update: SOSStatusUpdate):
    supabase = _supabase()

    try:
        update_data = {"status": update.status}

        if update.response_team:
            update_data["response_team"] = update.response_team
        if update.notes:
            update_data["notes"] = update.notes

        # auto-set timestamps
        now = datetime.utcnow().isoformat()
        if update.status == "acknowledged":
            update_data["acknowledged_at"] = now
        elif update.status == "dispatched":
            update_data["dispatched_at"] = now
        elif update.status == "resolved":
            update_data["resolved_at"] = now

        result = supabase.table("sos_requests") \
            .update(update_data) \
            .eq("id", request_id) \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="SOS request not found")

        return {
            "success": True,
            "request": result.data[0],
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"SOS update error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
