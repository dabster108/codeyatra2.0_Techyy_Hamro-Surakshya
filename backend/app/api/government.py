"""
Government & Province Dashboard API
====================================
Public endpoints for government and province dashboard data
GET  /government/national     — National budget summary
GET  /government/provinces    — All provinces budget data
GET  /government/province/:id — Single province with districts
"""

from fastapi import APIRouter, HTTPException
from app.db.supabase import get_supabase_admin

router = APIRouter(prefix="/government", tags=["government"])


def _supabase():
    return get_supabase_admin()


# Province ID mapping
PROVINCE_MAP = {
    "Koshi": 1,
    "Madhesh": 2,
    "Bagmati": 3,
    "Gandaki": 4,
    "Lumbini": 5,
    "Karnali": 6,
    "Sudurpashchim": 7,
}

PROVINCE_NAMES = {
    1: "Koshi",
    2: "Madhesh",
    3: "Bagmati",
    4: "Gandaki",
    5: "Lumbini",
    6: "Karnali",
    7: "Sudurpashchim",
}


@router.get("/national")
async def get_national_dashboard():
    """
    Get national-level budget summary.
    Returns: total allocated, disbursed, remaining, utilization %
    """
    supabase = _supabase()
    
    try:
        # Get total allocated from budget_master
        bm_res = supabase.table("budget_master").select("ndrrma_allocation").execute()
        total_allocated = sum(float(r.get("ndrrma_allocation", 0)) for r in (bm_res.data or []))
        
        # Get total distributed from relief_records
        rr_res = supabase.table("relief_records").select("relief_amount").execute()
        total_distributed = sum(float(r.get("relief_amount", 0)) for r in (rr_res.data or []))
        
        # Count disasters - distinct disaster types
        disasters_res = supabase.table("relief_records").select("disaster_type").execute()
        disasters_count = len(set(r.get("disaster_type") for r in (disasters_res.data or [])))
        
        # Count affected people (assuming each record represents individuals)
        total_affected = len(rr_res.data or [])
        
        remaining = max(total_allocated - total_distributed, 0)
        utilization = round((total_distributed / total_allocated * 100) if total_allocated > 0 else 0, 2)
        
        return {
            "fiscal_year": "2082/83",
            "total": total_allocated,
            "allocated": total_allocated,
            "disbursed": total_distributed,
            "remaining": remaining,
            "utilization_percent": utilization,
            "total_disasters": disasters_count,
            "total_affected": total_affected,
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch national data: {str(e)}")


@router.get("/provinces")
async def get_all_provinces():
    """
    Get budget summary for all provinces.
    Returns array of province data with allocation, disbursed, disasters, affected
    """
    supabase = _supabase()
    
    try:
        # Get all relief records grouped by province
        rr_res = supabase.table("relief_records").select("province, relief_amount, disaster_type").execute()
        records = rr_res.data or []
        
        # Get budget allocations by province from province_allocation table
        pa_res = supabase.table("province_allocation").select("province_id, allocated_amount").execute()
        # Aggregate allocations per province (may have multiple rows per province across fiscal years)
        budget_by_province = {}
        for r in (pa_res.data or []):
            pid = r.get("province_id")
            budget_by_province[pid] = budget_by_province.get(pid, 0) + float(r.get("allocated_amount", 0))
        
        # Aggregate by province (normalize to title case)
        province_stats = {}
        for record in records:
            prov_raw = record.get("province", "Unknown")
            prov = prov_raw.strip().title() if prov_raw else "Unknown"
            if prov not in province_stats:
                province_stats[prov] = {
                    "province": prov,
                    "allocated": 0,
                    "disbursed": 0,
                    "disasters": set(),
                    "affected": 0,
                }
            province_stats[prov]["disbursed"] += float(record.get("relief_amount", 0))
            province_stats[prov]["disasters"].add(record.get("disaster_type"))
            province_stats[prov]["affected"] += 1
        
        # Add allocated amounts from province_allocation
        for prov_name, prov_id in PROVINCE_MAP.items():
            if prov_name in province_stats:
                province_stats[prov_name]["allocated"] = budget_by_province.get(prov_id, 0)
            elif prov_id in budget_by_province:
                # Province has budget but no records yet
                province_stats[prov_name] = {
                    "province": prov_name,
                    "allocated": budget_by_province.get(prov_id, 0),
                    "disbursed": 0,
                    "disasters": set(),
                    "affected": 0,
                }
        
        # Convert to list and format
        result = []
        for prov_data in province_stats.values():
            allocated = prov_data["allocated"]
            disbursed = prov_data["disbursed"]
            result.append({
                "province": prov_data["province"],
                "allocated": allocated,
                "disbursed": disbursed,
                "remaining": max(allocated - disbursed, 0),
                "utilization": round((disbursed / allocated * 100) if allocated > 0 else 0, 2),
                "disasters": len(prov_data["disasters"]),
                "affected": prov_data["affected"],
            })
        
        # Sort by province name
        result.sort(key=lambda x: list(PROVINCE_MAP.keys()).index(x["province"]) if x["province"] in PROVINCE_MAP else 999)
        
        return result
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch provinces data: {str(e)}")


@router.get("/province/{province_name}")
async def get_province_detail(province_name: str):
    """
    Get detailed data for a specific province including districts.
    Returns: province summary + array of district data
    """
    supabase = _supabase()
    
    try:
        # Normalize province name: DB stores provinces in lowercase
        normalized_name = province_name.strip().title()
        # Use ilike for case-insensitive matching (handles 'bagmati', 'Bagmati', etc.)
        rr_res = supabase.table("relief_records").select("*").eq(
            "province", province_name.strip().lower()
        ).execute()
        records = rr_res.data or []
        
        # Get budget for province from province_allocation table
        # Try both title case and original for PROVINCE_MAP lookup
        province_id = PROVINCE_MAP.get(normalized_name) or PROVINCE_MAP.get(province_name)
        province_budget = 0
        if province_id:
            pa_res = supabase.table("province_allocation").select("allocated_amount").eq("province_id", province_id).execute()
            if pa_res.data:
                province_budget = sum(float(r.get("allocated_amount", 0)) for r in pa_res.data)
        
        # Aggregate province totals
        total_disbursed = sum(float(r.get("relief_amount", 0)) for r in records)
        disasters = len(set(r.get("disaster_type") for r in records))
        affected = len(records)
        
        # Aggregate by district
        district_stats = {}
        for record in records:
            dist = record.get("district", "Unknown")
            if dist not in district_stats:
                district_stats[dist] = {
                    "district": dist,
                    "disbursed": 0,
                    "disasters": set(),
                    "affected": 0,
                    "records": [],
                }
            district_stats[dist]["disbursed"] += float(record.get("relief_amount", 0))
            district_stats[dist]["disasters"].add(record.get("disaster_type"))
            district_stats[dist]["affected"] += 1
            district_stats[dist]["records"].append(record)
        
        # Format districts
        districts = []
        for dist_data in district_stats.values():
            # Estimate allocation based on proportion of disbursed
            est_allocation = (dist_data["disbursed"] / total_disbursed * province_budget) if total_disbursed > 0 else 0
            districts.append({
                "district": dist_data["district"],
                "allocated": est_allocation,
                "disbursed": dist_data["disbursed"],
                "remaining": max(est_allocation - dist_data["disbursed"], 0),
                "utilization": round((dist_data["disbursed"] / est_allocation * 100) if est_allocation > 0 else 0, 2),
                "disasters": len(dist_data["disasters"]),
                "affected": dist_data["affected"],
            })
        
        # Sort districts by disbursed amount
        districts.sort(key=lambda x: x["disbursed"], reverse=True)
        
        return {
            "province": normalized_name or province_name,
            "budget": {
                "allocated": province_budget,
                "disbursed": total_disbursed,
                "remaining": max(province_budget - total_disbursed, 0),
                "utilization": round((total_disbursed / province_budget * 100) if province_budget > 0 else 0, 2),
            },
            "stats": {
                "disasters": disasters,
                "affected": affected,
                "districts_count": len(districts),
            },
            "districts": districts,
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch province detail: {str(e)}")


@router.get("/recent-aid")
async def get_recent_aid(limit: int = 20):
    """
    Get recent aid distribution records.
    Returns: array of recent relief records with recipient, district, province, amount, date
    """
    supabase = _supabase()
    
    try:
        res = supabase.table("relief_records").select("*").order("created_at", desc=True).limit(limit).execute()
        records = res.data or []
        
        return [
            {
                "id": r.get("id"),
                "recipient": r.get("full_name"),
                "district": r.get("district"),
                "province": r.get("province"),
                "amount": float(r.get("relief_amount", 0)),
                "disaster_type": r.get("disaster_type"),
                "date": r.get("created_at", "")[:10] if r.get("created_at") else "",
                "status": "delivered",  # Default for now
            }
            for r in records
        ]
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent aid: {str(e)}")
