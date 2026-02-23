from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, date as date_type
from app.db.neon import execute_query_async
from app.models.schemas import WildfirePrediction, WildfireDistrictSummary

router = APIRouter(prefix="/predictions/neon", tags=["predictions-neon"])


@router.get("/wildfire", response_model=List[WildfirePrediction])
async def get_wildfire_predictions(
    province: Optional[float] = Query(None, ge=1, le=7, description="Filter by province (1-7)"),
    district: Optional[str] = Query(None, description="Filter by district name"),
    fire_category: Optional[str] = Query(None, description="Filter by fire category"),
    min_fire_prob: Optional[float] = Query(None, ge=0.0, le=1.0, description="Minimum fire probability"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(100, le=1000, description="Maximum number of results"),
):
    """
    Get wildfire predictions with optional filters from Neon database.
    Public endpoint - no authentication required.
    """
    
    # Build WHERE clause conditions
    conditions = []
    params = []
    param_count = 1
    
    if province is not None:
        conditions.append(f"province = ${param_count}")
        params.append(province)
        param_count += 1
    
    if district:
        conditions.append(f"district ILIKE ${param_count}")
        params.append(f"%{district}%")
        param_count += 1
    
    if fire_category:
        conditions.append(f"fire_category = ${param_count}")
        params.append(fire_category.lower())
        param_count += 1
    
    if min_fire_prob is not None:
        conditions.append(f"fire_prob >= ${param_count}")
        params.append(min_fire_prob)
        param_count += 1
    
    if start_date:
        conditions.append(f"valid_time >= ${param_count}")
        params.append(date_type.fromisoformat(start_date))
        param_count += 1
    
    if end_date:
        conditions.append(f"valid_time <= ${param_count}")
        params.append(date_type.fromisoformat(end_date))
        param_count += 1
    
    where_clause = " AND ".join(conditions) if conditions else "1=1"
    
    query = f"""
        SELECT 
            id::text, latitude, longitude, elevation, valid_time, fire_prob,
            prediction_class, fire_category, gapa_napa, district, pr_name,
            province, created_at, updated_at
        FROM wildfire_predictions
        WHERE {where_clause}
        ORDER BY fire_prob DESC
        LIMIT ${param_count}
    """
    params.append(limit)
    
    try:
        # asyncpg uses $1/$2 notation — no placeholder conversion needed
        results = await execute_query_async(query, tuple(params))
        
        # Convert to response model
        predictions = []
        for row in results:
            predictions.append({
                **row,
                "prediction_date": row.get("valid_time")
            })
        
        return predictions
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/wildfire/high-risk")
async def get_high_risk_areas(
    province: Optional[float] = Query(None, ge=1, le=7),
    limit: int = Query(100, le=500)
):
    """
    Get high-risk wildfire areas (medium, high, and extreme categories).
    """
    
    query = """
        SELECT 
            id::text, latitude, longitude, elevation, fire_prob,
            fire_category, gapa_napa, district, pr_name, province,
            valid_time, created_at
        FROM wildfire_high_risk_areas
    """
    
    params = []
    if province is not None:
        query += " WHERE province = %s"
        params.append(province)
    
    query += " ORDER BY fire_prob DESC LIMIT %s"
    params.append(limit)
    
    try:
        results = await execute_query_async(query, tuple(params))
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/wildfire/by-district")
async def get_predictions_by_district(
    province: Optional[float] = Query(None, ge=1, le=7)
):
    """
    Get wildfire prediction summary grouped by district.
    """
    
    query = """
        SELECT 
            district, province, pr_name, 
            total_predictions, 
            ROUND(CAST(avg_fire_prob AS NUMERIC), 4) as avg_fire_prob,
            ROUND(CAST(max_fire_prob AS NUMERIC), 4) as max_fire_prob,
            valid_time
        FROM wildfire_latest_by_district
    """
    
    params = []
    if province is not None:
        query += " WHERE province = %s"
        params.append(province)
    
    query += " ORDER BY max_fire_prob DESC"
    
    try:
        results = await execute_query_async(query, tuple(params) if params else None)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/wildfire/by-province")
async def get_predictions_by_province():
    """
    Get wildfire prediction statistics grouped by province.
    """
    
    query = """
        SELECT 
            province,
            COUNT(*) as total_predictions,
            ROUND(CAST(AVG(fire_prob) AS NUMERIC), 4) as avg_fire_prob,
            ROUND(CAST(MAX(fire_prob) AS NUMERIC), 4) as max_fire_prob,
            COUNT(*) FILTER (WHERE fire_category IN ('medium', 'high', 'extreme')) as high_risk_count
        FROM wildfire_predictions
        WHERE province IS NOT NULL
        GROUP BY province
        ORDER BY avg_fire_prob DESC
    """
    
    try:
        results = await execute_query_async(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/wildfire/map-data")
async def get_map_data(
    province: Optional[float] = Query(None, ge=1, le=7),
    min_fire_prob: float = Query(0.5, ge=0.0, le=1.0),
    latest_only: bool = Query(True, description="Show only latest prediction date")
):
    """
    Get wildfire prediction data optimized for map visualization.
    """
    
    query = """
        SELECT 
            id::text, latitude, longitude, fire_prob, fire_category,
            district, province, gapa_napa, valid_time
        FROM wildfire_predictions
        WHERE fire_prob >= %s
    """
    
    params = [min_fire_prob]
    
    if province is not None:
        query += " AND province = %s"
        params.append(province)
    
    if latest_only:
        query += """
            AND valid_time = (
                SELECT MAX(valid_time) FROM wildfire_predictions
            )
        """
    
    query += " ORDER BY fire_prob DESC"
    
    try:
        results = await execute_query_async(query, tuple(params))
        
        # Format for map
        map_points = []
        for row in results:
            map_points.append({
                "id": row["id"],
                "lat": row["latitude"],
                "lng": row["longitude"],
                "fire_prob": float(row["fire_prob"]),
                "fire_category": row["fire_category"],
                "district": row["district"],
                "province": float(row["province"]) if row["province"] else None,
                "location": row.get("gapa_napa") or "Unknown",
                "valid_time": row["valid_time"].isoformat() if row["valid_time"] else None
            })
        
        return {
            "total_points": len(map_points),
            "points": map_points
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/wildfire/latest-date")
async def get_latest_prediction_date():
    """
    Get the most recent prediction date in the database.
    """
    
    query = "SELECT MAX(valid_time) as latest_date FROM wildfire_predictions"
    
    try:
        result = await execute_query_async(query, fetch_one=True)
        
        if result and result.get("latest_date"):
            return {
                "latest_prediction_date": result["latest_date"].isoformat(),
                "status": "available"
            }
        else:
            return {
                "latest_prediction_date": None,
                "status": "no_data"
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/wildfire/stats")
async def get_wildfire_stats():
    """
    Get overall statistics for wildfire predictions.
    """
    
    query = "SELECT * FROM get_wildfire_stats()"
    
    try:
        result = await execute_query_async(query, fetch_one=True)
        
        if not result:
            return {
                "total_predictions": 0,
                "avg_fire_prob": 0,
                "max_fire_prob": 0,
                "min_fire_prob": 0,
                "high_risk_count": 0,
                "provinces_affected": 0
            }
        
        # Get category counts
        category_query = """
            SELECT 
                fire_category,
                COUNT(*) as count
            FROM wildfire_predictions
            GROUP BY fire_category
        """
        categories = await execute_query_async(category_query)
        category_counts = {row["fire_category"]: row["count"] for row in categories}
        
        return {
            "total_predictions": result["total_predictions"],
            "avg_fire_prob": round(float(result["avg_fire_prob"]), 4),
            "max_fire_prob": round(float(result["max_fire_prob"]), 4),
            "min_fire_prob": round(float(result["min_fire_prob"]), 4),
            "high_risk_count": result["high_risk_count"],
            "provinces_affected": result["provinces_affected"],
            "category_counts": category_counts
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/health")
async def health_check():
    """
    Check if Neon database connection is healthy.
    """
    try:
        result = await execute_query_async("SELECT 1 as status", fetch_one=True)
        return {
            "status": "healthy",
            "database": "neon",
            "connection": "active"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "neon",
            "error": str(e)
        }
