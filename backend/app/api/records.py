"""
relief_records API
==================
POST /records           — Submit a new relief record (no auth)
GET  /records           — List all records (no auth)
GET  /records/analytics — National summary totals (no auth)
GET  /records/by-province — Province-wise totals (no auth)
GET  /records/by-district — District-wise totals (no auth)
GET  /records/by-officer  — Officer-wise records (no auth)
"""

import threading
from fastapi import APIRouter, HTTPException
from app.db.supabase import get_supabase_admin
from app.models.schemas import ReliefRecordCreate, ReliefRecordOut

router = APIRouter(prefix="/records", tags=["records"])


def _supabase():
    return get_supabase_admin()


# ── write ────────────────────────────────────────────────────────────────────

@router.post("", response_model=ReliefRecordOut, status_code=201)
async def create_record(data: ReliefRecordCreate):
    """Insert a new relief record. No auth required."""
    supabase = _supabase()
    payload = data.dict()
    payload["officer_id"]   = payload.get("officer_id") or "OFF-DIRECT"
    payload["officer_name"] = payload.get("officer_name") or "Duty Officer"
    try:
        res = supabase.table("relief_records").insert(payload).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Insert returned no data")
        row = res.data[0]
        # Ensure optional fields have defaults so Pydantic doesn't fail
        row.setdefault("updated_at", row.get("created_at"))
        row.setdefault("solana_tx_signature", None)
        row.setdefault("record_hash", None)

        # Anchor to Solana blockchain in background (non-blocking)
        def _anchor_async(record_row):
            try:
                from app.services.blockchain_service import hash_record, anchor_to_solana
                record_hash = hash_record(record_row)
                tx_sig = anchor_to_solana(str(record_row["id"]), record_hash)
                if tx_sig:
                    _supabase().table("relief_records").update({
                        "solana_tx_signature": tx_sig,
                        "record_hash": record_hash,
                    }).eq("id", record_row["id"]).execute()
                    print(f"[Blockchain] Record {record_row['id']} anchored: {tx_sig}")
            except Exception as ex:
                print(f"[Blockchain] Background anchor failed: {ex}")

        threading.Thread(target=_anchor_async, args=(dict(row),), daemon=True).start()

        return row
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ── read ─────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[ReliefRecordOut])
async def list_records(
    province: str | None = None,
    district: str | None = None,
    disaster_type: str | None = None,
):
    """List all records, with optional filters."""
    supabase = _supabase()
    try:
        q = supabase.table("relief_records").select("*").order("created_at", desc=True)
        if province:
            q = q.eq("province", province)
        if district:
            q = q.eq("district", district)
        if disaster_type:
            q = q.eq("disaster_type", disaster_type)
        res = q.execute()
        return res.data or []
    except Exception:
        return []


@router.get("/analytics")
async def get_analytics():
    """National summary — total allocated, total distributed, remaining, count."""
    supabase = _supabase()
    try:
        res = supabase.table("relief_records").select("relief_amount").execute()
        rows = res.data or []
    except Exception:
        rows = []

    total = sum(float(r["relief_amount"]) for r in rows)
    count = len(rows)

    try:
        bm = supabase.table("budget_master").select("ndrrma_allocation").execute()
        allocated = sum(float(r["ndrrma_allocation"]) for r in (bm.data or []))
    except Exception:
        allocated = 0.0

    return {
        "total_allocated": allocated,
        "total_distributed": total,
        "remaining": max(allocated - total, 0),
        "utilization_percent": round((total / allocated * 100) if allocated else 0, 2),
        "total_records": count,
    }


@router.get("/by-province")
async def by_province():
    """Province-wise totals."""
    supabase = _supabase()
    try:
        res = supabase.table("relief_records").select("province, relief_amount").execute()
        rows = res.data or []
    except Exception:
        return []

    summary: dict[str, dict] = {}
    for r in rows:
        prov = r["province"]
        if prov not in summary:
            summary[prov] = {"province": prov, "total_distributed": 0.0, "record_count": 0}
        summary[prov]["total_distributed"] += float(r["relief_amount"])
        summary[prov]["record_count"] += 1

    return sorted(summary.values(), key=lambda x: x["total_distributed"], reverse=True)


@router.get("/by-district")
async def by_district():
    """District-wise totals."""
    supabase = _supabase()
    try:
        res = supabase.table("relief_records").select("province, district, relief_amount").execute()
        rows = res.data or []
    except Exception:
        return []

    summary: dict[str, dict] = {}
    for r in rows:
        key = r["district"]
        if key not in summary:
            summary[key] = {
                "district": r["district"],
                "province": r["province"],
                "total_distributed": 0.0,
                "record_count": 0,
            }
        summary[key]["total_distributed"] += float(r["relief_amount"])
        summary[key]["record_count"] += 1

    return sorted(summary.values(), key=lambda x: x["total_distributed"], reverse=True)


@router.get("/by-officer")
async def by_officer():
    """Officer-wise records."""
    supabase = _supabase()
    try:
        res = supabase.table("relief_records") \
            .select("officer_id, officer_name, relief_amount, full_name, province, district, created_at") \
            .order("created_at", desc=True) \
            .execute()
        return res.data or []
    except Exception:
        return []


@router.get("/get-all-records")
async def get_all_records():
    """
    Full analytics payload for the mobile app dashboard.
    Returns: summary totals + province breakdown + recent records + disaster breakdown.
    """
    supabase = _supabase()

    # Fetch all records
    try:
        res = supabase.table("relief_records") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        rows = res.data or []
    except Exception:
        rows = []

    total_distributed = sum(float(r["relief_amount"]) for r in rows)
    total_records = len(rows)

    # Province breakdown
    province_map: dict[str, dict] = {}
    for r in rows:
        p = r["province"]
        if p not in province_map:
            province_map[p] = {"province": p, "total_amount": 0.0, "record_count": 0}
        province_map[p]["total_amount"] += float(r["relief_amount"])
        province_map[p]["record_count"] += 1

    # District breakdown
    district_map: dict[str, dict] = {}
    for r in rows:
        d = r["district"]
        if d not in district_map:
            district_map[d] = {"district": d, "province": r["province"], "total_amount": 0.0, "record_count": 0}
        district_map[d]["total_amount"] += float(r["relief_amount"])
        district_map[d]["record_count"] += 1

    # Disaster type breakdown
    disaster_map: dict[str, dict] = {}
    for r in rows:
        dt = r["disaster_type"]
        if dt not in disaster_map:
            disaster_map[dt] = {"disaster_type": dt, "total_amount": 0.0, "record_count": 0}
        disaster_map[dt]["total_amount"] += float(r["relief_amount"])
        disaster_map[dt]["record_count"] += 1

    # Officer leaderboard
    officer_map: dict[str, dict] = {}
    for r in rows:
        oid = r["officer_id"]
        if oid not in officer_map:
            officer_map[oid] = {
                "officer_id": oid,
                "officer_name": r["officer_name"],
                "total_amount": 0.0,
                "record_count": 0,
            }
        officer_map[oid]["total_amount"] += float(r["relief_amount"])
        officer_map[oid]["record_count"] += 1

    return {
        "summary": {
            "total_distributed": total_distributed,
            "total_records": total_records,
            "unique_provinces": len(province_map),
            "unique_districts": len(district_map),
        },
        "by_province": sorted(province_map.values(), key=lambda x: x["total_amount"], reverse=True),
        "by_district": sorted(district_map.values(), key=lambda x: x["total_amount"], reverse=True)[:10],
        "by_disaster": sorted(disaster_map.values(), key=lambda x: x["total_amount"], reverse=True),
        "by_officer": sorted(officer_map.values(), key=lambda x: x["total_amount"], reverse=True)[:5],
        "recent_records": rows[:10],
    }

