from fastapi import APIRouter, Depends
from app.core.security import RoleChecker, TokenData
from app.db.supabase import get_supabase_admin
from app.models.schemas import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

admin_roles = ["SUPER_ADMIN"]
province_roles = ["SUPER_ADMIN", "PROVINCE_ADMIN"]
district_roles = ["SUPER_ADMIN", "PROVINCE_ADMIN", "DISTRICT_OFFICER"]

@router.get("/national", response_model=DashboardSummary, dependencies=[Depends(RoleChecker(admin_roles))])
async def get_national_dashboard():
    supabase = get_supabase_admin()
    
    # Simple aggregation for national
    res = supabase.table("budget_master").select("ndrrma_allocation").execute()
    total_allocated = sum(item['ndrrma_allocation'] for item in res.data)
    
    res_util = supabase.table("province_utilization").select("used").execute()
    total_used = sum(item['used'] for item in res_util.data)
    
    remaining = total_allocated - total_used
    percent = (total_used / total_allocated * 100) if total_allocated > 0 else 0
    
    return {
        "allocated": total_allocated,
        "used": total_used,
        "remaining": remaining,
        "utilization_percent": percent
    }

@router.get("/province/{id}", response_model=DashboardSummary)
async def get_province_dashboard(id: int, user: TokenData = Depends(RoleChecker(province_roles))):
    supabase = get_supabase_admin()
    
    # RBAC: Province admin can only see their own province
    if user.role == "PROVINCE_ADMIN" and user.province_id != id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Access denied to this province")
        
    res = supabase.table("province_utilization").select("*").eq("province_id", id).execute()
    if not res.data:
        return {"allocated": 0, "used": 0, "remaining": 0, "utilization_percent": 0}
        
    data = res.data[0]
    total_allocated = data['allocated']
    total_used = data['used']
    remaining = data['remaining']
    percent = (total_used / total_allocated * 100) if total_allocated > 0 else 0
    
    return {
        "allocated": total_allocated,
        "used": total_used,
        "remaining": remaining,
        "utilization_percent": percent
    }

@router.get("/district/{id}", response_model=DashboardSummary)
async def get_district_dashboard(id: int, user: TokenData = Depends(RoleChecker(district_roles))):
    supabase = get_supabase_admin()
    
    # RBAC check
    if user.role == "DISTRICT_OFFICER" and user.district_id != id:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Access denied to this district")
        
    # Also check province admin access
    if user.role == "PROVINCE_ADMIN":
        # Verify district belongs to province
        dist_res = supabase.table("district_allocation").select("province_allocation_id").eq("district_id", id).limit(1).execute()
        if dist_res.data:
            pa_id = dist_res.data[0]['province_allocation_id']
            pa_res = supabase.table("province_allocation").select("province_id").eq("id", pa_id).single().execute()
            if pa_res.data and pa_res.data['province_id'] != user.province_id:
                 from fastapi import HTTPException
                 raise HTTPException(status_code=403, detail="Access denied to this district")

    res = supabase.table("district_utilization").select("*").eq("district_id", id).execute()
    if not res.data:
        return {"allocated": 0, "used": 0, "remaining": 0, "utilization_percent": 0}
        
    data = res.data[0]
    total_allocated = data['allocated']
    total_used = data['used']
    remaining = data['remaining']
    percent = (total_used / total_allocated * 100) if total_allocated > 0 else 0
    
    return {
        "allocated": total_allocated,
        "used": total_used,
        "remaining": remaining,
        "utilization_percent": percent
    }
