from fastapi import APIRouter, Depends, HTTPException
from app.core.security import RoleChecker, TokenData
from app.db.supabase import get_supabase_admin
from app.models.schemas import ReliefDistribute, AuditLogCreate, BeneficiaryCreate
from app.services.budget_service import BudgetService
from app.services.audit_service import log_action

router = APIRouter(prefix="/relief", tags=["relief"])

relief_roles = ["SUPER_ADMIN", "DISTRICT_OFFICER", "DATA_ENTRY_OFFICER"]

@router.post("/distribute")
async def distribute_relief(data: ReliefDistribute, user: TokenData = Depends(RoleChecker(relief_roles))):
    supabase = get_supabase_admin()
    
    # Check budget
    await BudgetService.check_relief_budget(data.district_allocation_id, data.amount)
    
    # Insert relief distribution
    dist_data = data.dict()
    dist_data['officer_id'] = user.user_id
    
    res = supabase.table("relief_distribution").insert(dist_data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to record distribution")
        
    record = res.data[0]
    
    # Audit Log
    await log_action(AuditLogCreate(
        user_id=user.user_id,
        action="CREATE",
        table_name="relief_distribution",
        record_id=record['id'],
        new_data=record
    ))
    
    return {"message": "Relief distributed successfully", "data": record}

@router.get("/by-district/{id}")
async def get_relief_by_district(id: int, user: TokenData = Depends(RoleChecker(relief_roles))):
    supabase = get_supabase_admin()
    
    # Join with district_allocation to filter
    res = supabase.table("relief_distribution") \
        .select("*, district_allocation!inner(*)") \
        .eq("district_allocation.district_id", id) \
        .execute()
        
    return res.data

@router.post("/beneficiary")
async def create_beneficiary(data: BeneficiaryCreate, user: TokenData = Depends(RoleChecker(relief_roles))):
    supabase = get_supabase_admin()
    
    # Check if citizenship number exists (Unique constraint handled by DB, but we check for better error)
    existing = supabase.table("beneficiary").select("id").eq("citizenship_number", data.citizenship_number).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Beneficiary already registered with this citizenship number")
        
    res = supabase.table("beneficiary").insert(data.dict()).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to create beneficiary")
        
    return res.data[0]
