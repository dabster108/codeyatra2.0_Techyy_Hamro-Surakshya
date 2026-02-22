from fastapi import HTTPException
from app.db.supabase import get_supabase_admin

class BudgetService:
    @staticmethod
    async def check_province_budget(budget_master_id: str, amount_to_allocate: float):
        supabase = get_supabase_admin()
        # Get total ndrrma allocation
        res = supabase.table("budget_master").select("ndrrma_allocation").eq("id", budget_master_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Budget Master not found")
        
        total_limit = res.data['ndrrma_allocation']
        
        # Get already allocated to provinces
        res_alloc = supabase.table("province_allocation").select("allocated_amount").eq("budget_master_id", budget_master_id).execute()
        already_allocated = sum(item['allocated_amount'] for item in res_alloc.data)
        
        if (already_allocated + amount_to_allocate) > total_limit:
            raise HTTPException(status_code=400, detail=f"Insufficient National Budget. Available: {total_limit - already_allocated}")

    @staticmethod
    async def check_district_budget(province_allocation_id: str, amount_to_allocate: float):
        supabase = get_supabase_admin()
        res = supabase.table("province_allocation").select("allocated_amount").eq("id", province_allocation_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Province Allocation not found")
            
        province_limit = res.data['allocated_amount']
        
        res_dist = supabase.table("district_allocation").select("allocated_amount").eq("province_allocation_id", province_allocation_id).execute()
        already_allocated = sum(item['allocated_amount'] for item in res_dist.data)
        
        if (already_allocated + amount_to_allocate) > province_limit:
            raise HTTPException(status_code=400, detail=f"Insufficient Province Budget. Available: {province_limit - already_allocated}")

    @staticmethod
    async def check_relief_budget(district_allocation_id: str, relief_amount: float):
        supabase = get_supabase_admin()
        # Use the view district_utilization for easy check
        res = supabase.table("district_utilization").select("*").eq("district_allocation_id", district_allocation_id).single().execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="District Allocation not found")
            
        remaining = res.data['remaining']
        if relief_amount > remaining:
            raise HTTPException(status_code=400, detail=f"Insufficient District Budget. Remaining: {remaining}")
