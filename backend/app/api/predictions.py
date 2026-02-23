from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, date
from app.db.supabase import get_supabase_admin
from app.models.schemas import WildfirePrediction, WildfireDistrictSummary

router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.get("/wildfire", response_model=List[WildfirePrediction])
async def get_wildfire_predictions(
    province: Optional[int] = Query(None, ge=1, le=7, description="Filter by province (1-7)"),
    district: Optional[str] = Query(None, description="Filter by district name"),
    fire_category: Optional[str] = Query(None, description="Filter by fire category (minimal, low, medium, high, extreme)"),
    min_fire_prob: Optional[float] = Query(None, ge=0.0, le=1.0, description="Minimum fire probability"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(100, le=1000, description="Maximum number of results"),
):
    """
    Get wildfire predictions with optional filters.
    Public endpoint - no authentication required.
    """
    supabase = get_supabase_admin()
    
    # Start building query
    query = supabase.table("wildfire_predictions").select("*")
    
    # Apply filters
    if province:
        query = query.eq("province", province)
    
    if district:
        query = query.ilike("district", f"%{district}%")
    
    if fire_category:
        query = query.eq("fire_category", fire_category.lower())
    
    if min_fire_prob is not None:
        query = query.gte("fire_prob", min_fire_prob)
    
    if start_date:
        query = query.gte("prediction_date", start_date)
    
    if end_date:
        query = query.lte("prediction_date", end_date)
    
    # Order by fire probability (highest risk first) and limit
    query = query.order("fire_prob", desc=True).limit(limit)
    
    try:
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching predictions: {str(e)}")


@router.get("/wildfire/high-risk", response_model=List[WildfirePrediction])
async def get_high_risk_areas(
    province: Optional[int] = Query(None, ge=1, le=7),
    limit: int = Query(100, le=500)
):
    """
    Get high-risk wildfire areas (medium, high, and extreme categories).
    Public endpoint - no authentication required.
    """
    supabase = get_supabase_admin()
    
    query = supabase.table("wildfire_high_risk_areas").select("*")
    
    if province:
        query = query.eq("province", province)
    
    query = query.order("fire_prob", desc=True).limit(limit)
    
    try:
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching high-risk areas: {str(e)}")


@router.get("/wildfire/by-district", response_model=List[WildfireDistrictSummary])
async def get_predictions_by_district(
    province: Optional[int] = Query(None, ge=1, le=7, description="Filter by province")
):
    """
    Get wildfire prediction summary grouped by district.
    Shows latest prediction date and statistics per district.
    """
    supabase = get_supabase_admin()
    
    query = supabase.table("wildfire_latest_by_district").select("*")
    
    if province:
        query = query.eq("province", province)
    
    query = query.order("max_fire_prob", desc=True)
    
    try:
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching district summary: {str(e)}")


@router.get("/wildfire/by-province")
async def get_predictions_by_province():
    """
    Get wildfire prediction statistics grouped by province.
    Returns count, average probability, and max probability per province.
    """
    supabase = get_supabase_admin()
    
    try:
        response = supabase.table("wildfire_predictions").select("province, fire_prob, fire_category").execute()
        data = response.data
        
        # Group by province
        province_stats = {}
        for row in data:
            prov = row["province"]
            if prov not in province_stats:
                province_stats[prov] = {
                    "province": prov,
                    "total_predictions": 0,
                    "avg_fire_prob": 0,
                    "max_fire_prob": 0,
                    "fire_probs": [],
                    "high_risk_count": 0
                }
            
            province_stats[prov]["total_predictions"] += 1
            province_stats[prov]["fire_probs"].append(row["fire_prob"])
            
            if row["fire_category"] in ["medium", "high", "extreme"]:
                province_stats[prov]["high_risk_count"] += 1
        
        # Calculate statistics
        result = []
        for prov_id, stats in province_stats.items():
            fire_probs = stats["fire_probs"]
            result.append({
                "province": prov_id,
                "total_predictions": stats["total_predictions"],
                "avg_fire_prob": round(sum(fire_probs) / len(fire_probs), 4),
                "max_fire_prob": round(max(fire_probs), 4),
                "high_risk_count": stats["high_risk_count"]
            })
        
        # Sort by average fire probability
        result.sort(key=lambda x: x["avg_fire_prob"], reverse=True)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching province summary: {str(e)}")


@router.get("/wildfire/map-data")
async def get_map_data(
    province: Optional[int] = Query(None, ge=1, le=7),
    min_fire_prob: float = Query(0.5, ge=0.0, le=1.0, description="Minimum fire probability for map display"),
    latest_only: bool = Query(True, description="Show only latest prediction date")
):
    """
    Get wildfire prediction data optimized for map visualization.
    Returns location coordinates with fire risk information.
    """
    supabase = get_supabase_admin()
    
    query = supabase.table("wildfire_predictions").select(
        "id, latitude, longitude, fire_prob, fire_category, district, province, gapa_napa, prediction_date"
    )
    
    if province:
        query = query.eq("province", province)
    
    query = query.gte("fire_prob", min_fire_prob)
    
    try:
        response = query.execute()
        data = response.data
        
        # If latest_only, filter to most recent prediction_date
        if latest_only and data:
            max_date = max(row["prediction_date"] for row in data)
            data = [row for row in data if row["prediction_date"] == max_date]
        
        # Format for map
        map_points = []
        for row in data:
            map_points.append({
                "id": row["id"],
                "lat": row["latitude"],
                "lng": row["longitude"],
                "fire_prob": row["fire_prob"],
                "fire_category": row["fire_category"],
                "district": row["district"],
                "province": row["province"],
                "location": row.get("gapa_napa", "Unknown"),
                "prediction_date": row["prediction_date"]
            })
        
        return {
            "total_points": len(map_points),
            "points": map_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching map data: {str(e)}")


@router.get("/wildfire/latest-date")
async def get_latest_prediction_date():
    """
    Get the most recent prediction date available in the database.
    Useful for displaying freshness of data.
    """
    supabase = get_supabase_admin()
    
    try:
        response = supabase.table("wildfire_predictions").select("prediction_date").order("prediction_date", desc=True).limit(1).execute()
        
        if response.data and len(response.data) > 0:
            return {
                "latest_prediction_date": response.data[0]["prediction_date"],
                "status": "available"
            }
        else:
            return {
                "latest_prediction_date": None,
                "status": "no_data"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching latest date: {str(e)}")


@router.get("/wildfire/stats")
async def get_wildfire_stats():
    """
    Get overall statistics for wildfire predictions.
    Public dashboard summary endpoint.
    """
    supabase = get_supabase_admin()
    
    try:
        # Get all predictions
        response = supabase.table("wildfire_predictions").select("fire_prob, fire_category, province").execute()
        data = response.data
        
        if not data:
            return {
                "total_predictions": 0,
                "avg_fire_prob": 0,
                "max_fire_prob": 0,
                "category_counts": {},
                "provinces_affected": 0
            }
        
        # Calculate statistics
        fire_probs = [row["fire_prob"] for row in data]
        category_counts = {}
        provinces = set()
        
        for row in data:
            cat = row["fire_category"]
            category_counts[cat] = category_counts.get(cat, 0) + 1
            provinces.add(row["province"])
        
        return {
            "total_predictions": len(data),
            "avg_fire_prob": round(sum(fire_probs) / len(fire_probs), 4),
            "max_fire_prob": round(max(fire_probs), 4),
            "min_fire_prob": round(min(fire_probs), 4),
            "category_counts": category_counts,
            "provinces_affected": len(provinces)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")
