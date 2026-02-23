import logging
from fastapi import APIRouter
from app.db.supabase import get_supabase_admin

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/public", tags=["public"])


def _safe_query(fn):
    """Run a Supabase query; return None on any connection / table error."""
    try:
        return fn()
    except Exception as e:
        logger.warning("Supabase query failed: %s", e)
        return None


@router.get("/summary")
async def get_public_summary():
    try:
        supabase = get_supabase_admin()

        # Official NDRRMA allocation from budget_master
        res_master = _safe_query(
            lambda: supabase.table("budget_master").select("ndrrma_allocation").execute()
        )
        allocated = sum(float(item['ndrrma_allocation']) for item in (res_master.data if res_master else []))

        # Total distributed from relief_records (direct entry)
        res_records = _safe_query(
            lambda: supabase.table("relief_records").select("relief_amount").execute()
        )
        distributed = sum(float(r['relief_amount']) for r in (res_records.data if res_records else []))

        # Province utilization view
        res_util = _safe_query(
            lambda: supabase.table("province_utilization").select("used").execute()
        )
        used_legacy = sum(float(item['used']) for item in (res_util.data if res_util else []))

        total_used = max(distributed, used_legacy)

        # Beneficiary count
        ben_res = _safe_query(
            lambda: supabase.table("beneficiary").select("id", count="exact").execute()
        )
        total_beneficiaries = (ben_res.count if ben_res else 0) or 0

        # Relief record count
        rec_res = _safe_query(
            lambda: supabase.table("relief_records").select("id", count="exact").execute()
        )
        total_relief_records = (rec_res.count if rec_res else 0) or 0

        return {
            "total_allocated": allocated,
            "total_used": total_used,
            "total_distributed_records": distributed,
            "remaining": max(allocated - total_used, 0),
            "utilization_percent": round((total_used / allocated * 100) if allocated else 0, 2),
            "total_beneficiaries": total_beneficiaries,
            "total_relief_records": total_relief_records,
        }
    except Exception as e:
        logger.error("public/summary failed: %s", e)
        return {
            "total_allocated": 0,
            "total_used": 0,
            "total_distributed_records": 0,
            "remaining": 0,
            "utilization_percent": 0,
            "total_beneficiaries": 0,
            "total_relief_records": 0,
            "error": "Unable to reach database. Please try again.",
        }


@router.get("/province-utilization")
async def get_public_province_utilization():
    try:
        supabase = get_supabase_admin()
        res = supabase.table("province_utilization").select("province_id, allocated, used").execute()
        return res.data or []
    except Exception as e:
        logger.error("province-utilization failed: %s", e)
        return []


@router.get("/province-distribution")
async def get_public_province_distribution():
    """Province-wise totals from direct-entry relief_records (public, no auth)."""
    try:
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
    except Exception as e:
        logger.error("province-distribution failed: %s", e)
        return []
