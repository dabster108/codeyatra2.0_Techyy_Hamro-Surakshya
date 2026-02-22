from fastapi import APIRouter
from app.db.supabase import get_supabase_admin

router = APIRouter(prefix="/public", tags=["public"])

@router.get("/summary")
async def get_public_summary():
    supabase = get_supabase_admin()
    
    # Public view only sees aggregated data
    # Sum of all national budget
    res_master = supabase.table("budget_master").select("ndrrma_allocation").execute()
    allocated = sum(item['ndrrma_allocation'] for item in res_master.data)
    
    # Sum of all spent from view
    res_util = supabase.table("province_utilization").select("used").execute()
    used = sum(item['used'] for item in res_util.data)
    
    return {
        "total_allocated": allocated,
        "total_used": used,
        "total_beneficiaries": supabase.table("beneficiary").select("id", count="exact").execute().count
    }

@router.get("/province-utilization")
async def get_public_province_utilization():
    supabase = get_supabase_admin()
    res = supabase.table("province_utilization").select("province_id, allocated, used").execute()
    return res.data
