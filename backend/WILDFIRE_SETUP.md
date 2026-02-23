# Wildfire Prediction Backend Setup Guide

This guide explains how to set up the wildfire prediction system, upload CSV data to Supabase, and use the API endpoints.

## 📋 Table of Contents
1. [Database Setup](#database-setup)
2. [CSV Upload Methods](#csv-upload-methods)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration](#frontend-integration)

---

## 🗄️ Database Setup

### Step 1: Run SQL Schema in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `backend/migrations/wildfire_predictions.sql`
4. Copy and paste the entire SQL content into the SQL Editor
5. Click **Run** to create the table, indexes, and views

This will create:
- ✅ `wildfire_predictions` table
- ✅ Indexes for fast querying
- ✅ `wildfire_latest_by_district` view
- ✅ `wildfire_high_risk_areas` view

---

## 📤 CSV Upload Methods

You have **3 options** to upload your CSV data to Supabase:

### Option 1: Using Supabase Dashboard (Easiest) ⭐

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select `wildfire_predictions` table
3. Click **Insert** → **Import data from CSV**
4. Upload your CSV file
5. Map the CSV columns to database columns:
   ```
   latitude → latitude
   longitude → longitude
   valid_time → valid_time
   fire_prob → fire_prob
   prediction_class → prediction_class
   fire_category → fire_category
   GaPa_NaPa → gapa_napa
   DISTRICT → district
   PR_NAME → pr_name
   PROVINCE → province
   prediction_date → prediction_date
   ```
6. Click **Import**

### Option 2: Using Python Script (Recommended for large files) 🐍

**Install required packages:**
```bash
cd backend
pip install pandas
```

**Upload a single CSV file:**
```bash
python scripts/upload_wildfire_csv.py --file path/to/your/wildfire_data.csv
```

**Upload all CSV files from a directory:**
```bash
python scripts/upload_wildfire_csv.py --directory path/to/csv_folder/
```

**Clear all existing data:**
```bash
python scripts/upload_wildfire_csv.py --clear
```

**Custom batch size (for very large files):**
```bash
python scripts/upload_wildfire_csv.py --file data.csv --batch-size 500
```

### Option 3: Using Supabase API directly 🔧

If you want to integrate CSV upload into your own code:

```python
from supabase import create_client
import pandas as pd

# Initialize Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Read CSV
df = pd.read_csv('wildfire_data.csv')

# Rename columns to match schema
df = df.rename(columns={
    'GaPa_NaPa': 'gapa_napa',
    'DISTRICT': 'district',
    'PR_NAME': 'pr_name',
    'PROVINCE': 'province'
})

# Convert to dict and upload
records = df.to_dict('records')
supabase.table('wildfire_predictions').insert(records).execute()
```

---

## 🌐 API Endpoints

All endpoints are **public** (no authentication required).

Base URL: `http://localhost:8005/predictions`

### 1. Get Wildfire Predictions with Filters

**Endpoint:** `GET /predictions/wildfire`

**Query Parameters:**
- `province` (1-7): Filter by province
- `district`: Filter by district name
- `fire_category`: minimal, low, medium, high, extreme
- `min_fire_prob` (0-1): Minimum fire probability threshold
- `start_date`: YYYY-MM-DD format
- `end_date`: YYYY-MM-DD format
- `limit`: Max results (default: 100, max: 1000)

**Example:**
```bash
# Get high-probability predictions in Province 7
GET /predictions/wildfire?province=7&min_fire_prob=0.7

# Get all predictions for Kanchanpur district
GET /predictions/wildfire?district=Kanchanpur&limit=500
```

**Response:**
```json
[
  {
    "id": "uuid",
    "latitude": 28.66513095,
    "longitude": 80.33091575,
    "valid_time": "2025-04-17T00:00:00",
    "fire_prob": 0.4632134,
    "prediction_class": 0,
    "fire_category": "minimal",
    "gapa_napa": "Belauri",
    "district": "Kanchanpur",
    "pr_name": "Sudurpashchim Pradesh",
    "province": 7,
    "prediction_date": "2025-04-17"
  }
]
```

---

### 2. Get High-Risk Areas Only

**Endpoint:** `GET /predictions/wildfire/high-risk`

Returns only medium, high, and extreme risk areas.

**Query Parameters:**
- `province` (optional): Filter by province
- `limit`: Max results (default: 100)

**Example:**
```bash
GET /predictions/wildfire/high-risk?province=7&limit=50
```

---

### 3. Get Predictions Grouped by District

**Endpoint:** `GET /predictions/wildfire/by-district`

Returns summary statistics for each district.

**Query Parameters:**
- `province` (optional): Filter by province

**Response:**
```json
[
  {
    "district": "Kanchanpur",
    "province": 7,
    "pr_name": "Sudurpashchim Pradesh",
    "total_predictions": 150,
    "avg_fire_prob": 0.6234,
    "max_fire_prob": 0.9855,
    "prediction_date": "2025-04-17"
  }
]
```

---

### 4. Get Predictions Grouped by Province

**Endpoint:** `GET /predictions/wildfire/by-province`

Returns summary statistics for each province.

**Response:**
```json
[
  {
    "province": 7,
    "total_predictions": 450,
    "avg_fire_prob": 0.5823,
    "max_fire_prob": 0.9855,
    "high_risk_count": 125
  }
]
```

---

### 5. Get Map Visualization Data

**Endpoint:** `GET /predictions/wildfire/map-data`

Optimized for map display with lat/lng coordinates.

**Query Parameters:**
- `province` (optional): Filter by province
- `min_fire_prob`: Minimum threshold (default: 0.5)
- `latest_only`: Show only latest date (default: true)

**Response:**
```json
{
  "total_points": 234,
  "points": [
    {
      "id": "uuid",
      "lat": 28.66513095,
      "lng": 80.33091575,
      "fire_prob": 0.8234,
      "fire_category": "high",
      "district": "Kanchanpur",
      "province": 7,
      "location": "Belauri",
      "prediction_date": "2025-04-17"
    }
  ]
}
```

---

### 6. Get Latest Prediction Date

**Endpoint:** `GET /predictions/wildfire/latest-date`

Returns the most recent prediction date in the database.

**Response:**
```json
{
  "latest_prediction_date": "2025-04-17",
  "status": "available"
}
```

---

### 7. Get Overall Statistics

**Endpoint:** `GET /predictions/wildfire/stats`

Returns overall wildfire prediction statistics.

**Response:**
```json
{
  "total_predictions": 1500,
  "avg_fire_prob": 0.5234,
  "max_fire_prob": 0.9855,
  "min_fire_prob": 0.1234,
  "category_counts": {
    "minimal": 450,
    "low": 320,
    "medium": 280,
    "high": 350,
    "extreme": 100
  },
  "provinces_affected": 7
}
```

---

## 🎨 Frontend Integration

### Example: Fetch and Display on Map

```javascript
// Fetch map data for Province 7
async function loadWildfireMap() {
  const response = await fetch(
    'http://localhost:8005/predictions/wildfire/map-data?province=7&min_fire_prob=0.6'
  );
  const data = await response.json();
  
  // Add markers to map
  data.points.forEach(point => {
    addMapMarker({
      lat: point.lat,
      lng: point.lng,
      color: getRiskColor(point.fire_category),
      popup: `
        <strong>${point.district}</strong><br/>
        Fire Probability: ${(point.fire_prob * 100).toFixed(1)}%<br/>
        Risk Level: ${point.fire_category}
      `
    });
  });
}

function getRiskColor(category) {
  const colors = {
    'minimal': '#00ff00',
    'low': '#ffff00',
    'medium': '#ff9900',
    'high': '#ff0000',
    'extreme': '#cc0000'
  };
  return colors[category] || '#888888';
}
```

### Example: Display Statistics Dashboard

```javascript
// Fetch overall stats
async function loadDashboard() {
  const statsResponse = await fetch('http://localhost:8005/predictions/wildfire/stats');
  const stats = await statsResponse.json();
  
  // Update UI
  document.getElementById('total-predictions').textContent = stats.total_predictions;
  document.getElementById('avg-risk').textContent = 
    `${(stats.avg_fire_prob * 100).toFixed(1)}%`;
  
  // Create chart for category distribution
  createChart(stats.category_counts);
}
```

### Example: Filter by Province

```javascript
// Get predictions for specific province
async function getProvinceData(provinceId) {
  const response = await fetch(
    `http://localhost:8005/predictions/wildfire?province=${provinceId}&limit=1000`
  );
  const predictions = await response.json();
  
  return predictions;
}
```

---

## 🚀 Quick Start Checklist

- [ ] Run SQL schema in Supabase SQL Editor
- [ ] Prepare your CSV files with wildfire data
- [ ] Upload CSV using one of the 3 methods above
- [ ] Test API endpoints using `/docs` (FastAPI Swagger UI)
- [ ] Integrate API calls into your frontend
- [ ] Display predictions on map with color-coded risk levels

---

## 📊 CSV Format Example

Your CSV should have these columns:

```csv
latitude,longitude,valid_time,fire_prob,prediction_class,fire_category,GaPa_NaPa,DISTRICT,PR_NAME,PROVINCE,prediction_date
28.66513095,80.33091575,4/17/2025,0.4632134,0,minimal,Belauri,Kanchanpur,Sudurpashchim Pradesh,7,4/17/2025
28.69510297,80.32263012,4/17/2025,0.6498664,0,minimal,Belauri,Kanchanpur,Sudurpashchim Pradesh,7,4/17/2025
28.82990412,80.0939695,4/17/2025,0.9855182,1,medium,Mahakali,Kanchanpur,Sudurpashchim Pradesh,7,4/17/2025
```

---

## 🔍 Testing the API

1. **Start your backend:**
   ```bash
   cd backend
   python app/main.py
   ```

2. **Open API docs:**
   - Navigate to: http://localhost:8005/docs
   - Try out different endpoints
   - See request/response examples

3. **Test with cURL:**
   ```bash
   curl "http://localhost:8005/predictions/wildfire/stats"
   ```

---

## 🛠️ Troubleshooting

**Problem:** CSV upload fails with date parsing error

**Solution:** Ensure dates are in proper format (YYYY-MM-DD or MM/DD/YYYY). The script will auto-convert.

---

**Problem:** API returns empty array

**Solution:** Check if data was uploaded successfully:
```bash
curl "http://localhost:8005/predictions/wildfire/stats"
```

---

**Problem:** Permission denied error

**Solution:** Ensure your `.env` file has correct Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📞 Need Help?

Check the FastAPI documentation at: http://localhost:8005/docs
