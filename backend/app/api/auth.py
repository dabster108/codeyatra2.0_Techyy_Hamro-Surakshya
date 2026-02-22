from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token, verify_password, get_password_hash
from app.db.supabase import get_supabase_admin
from app.models.schemas import UserCreate, UserOut, Token
from datetime import timedelta
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register(user_data: UserCreate):
    supabase = get_supabase_admin()
    
    # Check if user exists
    existing = supabase.table("users").select("id").eq("email", user_data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user_data.password)
    
    user_dict = {
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "role": user_data.role,
        "province_id": user_data.province_id,
        "district_id": user_data.district_id
    }
    
    res = supabase.table("users").insert(user_dict).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Error creating user")
        
    return res.data[0]

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    supabase = get_supabase_admin()
    res = supabase.table("users").select("*").eq("email", form_data.username).execute()
    
    if not res.data:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    user = res.data[0]
    if not verify_password(form_data.password, user['hashed_password']):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user['email'], 
            "role": user['role'], 
            "id": user['id'],
            "province_id": user.get('province_id'),
            "district_id": user.get('district_id')
        },
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
