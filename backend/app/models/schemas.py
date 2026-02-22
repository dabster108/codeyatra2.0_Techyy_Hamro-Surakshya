from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    PROVINCE_ADMIN = "PROVINCE_ADMIN"
    DISTRICT_OFFICER = "DISTRICT_OFFICER"
    DATA_ENTRY_OFFICER = "DATA_ENTRY_OFFICER"
    PUBLIC_VIEW = "PUBLIC_VIEW"

# Auth Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.PUBLIC_VIEW
    province_id: Optional[int] = None
    district_id: Optional[int] = None

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    province_id: Optional[int]
    district_id: Optional[int]
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# Budget Schemas
class DashboardSummary(BaseModel):
    allocated: float
    used: float
    remaining: float
    utilization_percent: float

class BudgetMasterCreate(BaseModel):
    fiscal_year: str
    total_nepal_budget: float
    ndrrma_allocation: float

class ProvinceAllocationCreate(BaseModel):
    budget_master_id: str
    province_id: int
    allocated_amount: float
    released_amount: float

class DistrictAllocationCreate(BaseModel):
    province_allocation_id: str
    district_id: int
    allocated_amount: float

# Relief Schemas
class ReliefDistribute(BaseModel):
    beneficiary_id: str
    district_allocation_id: str
    disaster_type: str
    relief_type: str
    amount: float
    gps_lat: Optional[float] = None
    gps_long: Optional[float] = None
    photo_url: Optional[str] = None

class BeneficiaryCreate(BaseModel):
    full_name: str
    citizenship_number: str
    province_id: int
    district_id: int
    ward: int

# Audit Schema
class AuditLogCreate(BaseModel):
    user_id: str
    action: str
    table_name: str
    record_id: str
    old_data: Optional[dict] = None
    new_data: Optional[dict] = None
