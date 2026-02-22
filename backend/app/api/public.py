from fastapi import APIRouter
from app.db.supabase import get_supabase_admin

router = APIRouter(prefix="/public", tags=["public"])

@router.get("/summary")
async def get_public_summary():
    supabase = get_supabase_admin()
    
    # Official NDRRMA allocation from budget_master
    res_master = supabase.table("budget_master").select("ndrrma_allocation").execute()
    allocated = sum(float(item['ndrrma_allocation']) for item in (res_master.data or []))
    
    # Total distributed from relief_records (direct entry)
    res_records = supabase.table("relief_records").select("relief_amount").execute()
    distributed = sum(float(r['relief_amount']) for r in (res_records.data or []))

    # Province utilization view
    res_util = supabase.table("province_utilization").select("used").execute()
    used_legacy = sum(float(item['used']) for item in (res_util.data or []))

    total_used = max(distributed, used_legacy)

    return {
        "total_allocated": allocated,
        "total_used": total_used,
        "total_distributed_records": distributed,
        "remaining": max(allocated - total_used, 0),
        "utilization_percent": round((total_used / allocated * 100) if allocated else 0, 2),
        "total_beneficiaries": supabase.table("beneficiary").select("id", count="exact").execute().count or 0,
        "total_relief_records": supabase.table("relief_records").select("id", count="exact").execute().count or 0,
    }

@router.get("/province-utilization")
async def get_public_province_utilization():
    supabase = get_supabase_admin()
    res = supabase.table("province_utilization").select("province_id, allocated, used").execute()
    return res.data

@router.get("/province-distribution")
async def get_public_province_distribution():
    """Province-wise totals from direct-entry relief_records (public, no auth)."""
    supabase = get_supabase_admin()
    res = supabase.table("relief_records").select("province, relief_amount").execute()
    rows = res.data or []

    summary: dict[str, dict] = {}
    for r in rows:
        p = r["province"]
        if p not in summary:
            summary[p] = {"province": p, "total_distributed": 0.0, "record_count": 0}
        summary[p]["total_distributed"] += float(r["relief_amount"])
        summary[p]["record_count"] += 1

    return sorted(summary.values(), key=lambda x: x["total_distributed"], reverse=True)
