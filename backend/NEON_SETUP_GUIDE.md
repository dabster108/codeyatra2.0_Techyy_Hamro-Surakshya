# 🔥 Wildfire Prediction System - Neon Database Setup Guide

Complete guide to set up wildfire prediction system using **Neon Database** (Serverless PostgreSQL).

---

## 📋 Table of Contents
1. [Neon Database Setup](#neon-database-setup)
2. [Configure Backend](#configure-backend)
3. [Upload CSV Data](#upload-csv-data)
4. [API Endpoints](#api-endpoints)
5. [Frontend Integration](#frontend-integration)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Step 1: Neon Database Setup

### 1.1 Get Your Neon Connection String

1. Go to your **Neon Console**: https://console.neon.tech
2. Select your project
3. Click on **Dashboard** → **Connection Details**
4. Copy the **connection string** (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 1.2 Update .env File

Open `backend/.env` and replace the `NEON_DATABASE_URL` with your actual connection string:

```env
# Neon Database (PostgreSQL) - For Wildfire Predictions
NEON_DATABASE_URL=postgresql://your_user:your_password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Important:** Keep your connection string secure! Never commit it to Git.

---

## 🔧 Step 2: Configure Backend

### 2.1 Install Required Packages

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `psycopg2-binary` - PostgreSQL adapter
- `sqlalchemy` - Database ORM
- `pandas` - For CSV processing

### 2.2 Test Database Connection

```bash
python scripts/upload_wildfire_neon.py --test
```

**Expected output:**
```
✅ Connected to Neon PostgreSQL
   Version: PostgreSQL 16.x...
```

If you see an error, check your connection string in `.env`.

---

## 📊 Step 3: Create Database Schema

### 3.1 Option A: Using Neon SQL Editor (Recommended)

1. Go to **Neon Console** → **SQL Editor**
2. Open file: `backend/migrations/neon_wildfire_predictions.sql`
3. Copy **all the SQL code**
4. Paste into Neon SQL Editor
5. Click **Run**

### 3.2 Option B: Using psql Command Line

```bash
psql "postgresql://your_connection_string" -f backend/migrations/neon_wildfire_predictions.sql
```

### 3.3 Verify Table Creation

In Neon SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'wildfire_predictions';
```

You should see the `wildfire_predictions` table listed.

---

## 📤 Step 4: Upload CSV Data

### Your CSV Format

Make sure your CSV has these columns:
```csv
latitude,longitude,Elevation,valid_time,fire_prob,prediction_class,fire_category,gapa_napa,district,pr_name,province
28.67680976463324,83.67586709336892,3153,2026-02-16,0.99856985,1,high,Gharapjhong,Mustang,Gandaki Pradesh,4.0
```

### 4.1 Upload Single CSV File

```bash
cd backend
python scripts/upload_wildfire_neon.py --file path/to/your/wildfire_data.csv
```

**Example:**
```bash
python scripts/upload_wildfire_neon.py --file ../data/wildfire_predictions_2026.csv
```

### 4.2 Upload Multiple CSV Files from Directory

If you have multiple CSV files in a folder:

```bash
python scripts/upload_wildfire_neon.py --directory path/to/csv_folder/
```

**Example:**
```bash
python scripts/upload_wildfire_neon.py --directory ../data/wildfire_csvs/
```

### 4.3 Upload Options

**Use COPY command (fastest for large files):**
```bash
python scripts/upload_wildfire_neon.py --file data.csv
```

**Use batch INSERT (if COPY fails):**
```bash
python scripts/upload_wildfire_neon.py --file data.csv --no-copy
```

**Custom batch size:**
```bash
python scripts/upload_wildfire_neon.py --file data.csv --batch-size 10000
```

### 4.4 Verify Upload

After upload, the script will show:
```
📊 Total records in database: 12,543
📅 Latest prediction date: 2026-02-16
🎉 Upload complete!
```

You can also verify in Neon SQL Editor:
```sql
SELECT COUNT(*) FROM wildfire_predictions;
SELECT * FROM wildfire_predictions LIMIT 10;
```

---

## 🌐 Step 5: API Endpoints

### Start Backend Server

```bash
cd backend
python app/main.py
```

Server will start at: **http://localhost:8005**

API Documentation: **http://localhost:8005/docs**

---

### Available Endpoints

Base URL: `http://localhost:8005/predictions/neon`

All endpoints are **public** (no authentication required).

#### 1. Get Wildfire Predictions with Filters

**Endpoint:** `GET /predictions/neon/wildfire`

**Query Parameters:**
- `province` (1-7): Filter by province
- `district`: Filter by district name
- `fire_category`: minimal, low, medium, high, extreme
- `min_fire_prob` (0-1): Minimum fire probability
- `start_date`: YYYY-MM-DD format
- `end_date`: YYYY-MM-DD format
- `limit`: Max results (default: 100)

**Example:**
```bash
# Get high-risk predictions in Province 4
GET http://localhost:8005/predictions/neon/wildfire?province=4&min_fire_prob=0.8

# Get predictions for Mustang district
GET http://localhost:8005/predictions/neon/wildfire?district=Mustang
```

**Response:**
```json
[
  {
    "id": "uuid",
    "latitude": 28.67680976,
    "longitude": 83.67586709,
    "elevation": 3153,
    "valid_time": "2026-02-16T00:00:00",
    "fire_prob": 0.99856985,
    "prediction_class": 1,
    "fire_category": "high",
    "gapa_napa": "Gharapjhong",
    "district": "Mustang",
    "pr_name": "Gandaki Pradesh",
    "province": 4.0
  }
]
```

---

#### 2. Get High-Risk Areas Only

**Endpoint:** `GET /predictions/neon/wildfire/high-risk`

Returns only medium, high, and extreme risk areas.

**Example:**
```bash
GET http://localhost:8005/predictions/neon/wildfire/high-risk?province=1&limit=50
```

---

#### 3. Get Predictions by District

**Endpoint:** `GET /predictions/neon/wildfire/by-district`

Returns summary statistics per district.

**Example:**
```bash
GET http://localhost:8005/predictions/neon/wildfire/by-district?province=4
```

**Response:**
```json
[
  {
    "district": "Mustang",
    "province": 4,
    "pr_name": "Gandaki Pradesh",
    "total_predictions": 250,
    "avg_fire_prob": 0.8234,
    "max_fire_prob": 0.9986,
    "valid_time": "2026-02-16"
  }
]
```

---

#### 4. Get Predictions by Province

**Endpoint:** `GET /predictions/neon/wildfire/by-province`

Returns summary statistics per province.

**Response:**
```json
[
  {
    "province": 4,
    "total_predictions": 1250,
    "avg_fire_prob": 0.7523,
    "max_fire_prob": 0.9986,
    "high_risk_count": 834
  }
]
```

---

#### 5. Get Map Visualization Data

**Endpoint:** `GET /predictions/neon/wildfire/map-data`

Optimized for map display with lat/lng coordinates.

**Query Parameters:**
- `province` (optional): Filter by province
- `min_fire_prob`: Minimum threshold (default: 0.5)
- `latest_only`: Show only latest date (default: true)

**Example:**
```bash
GET http://localhost:8005/predictions/neon/wildfire/map-data?province=4&min_fire_prob=0.7
```

**Response:**
```json
{
  "total_points": 234,
  "points": [
    {
      "id": "uuid",
      "lat": 28.67680976,
      "lng": 83.67586709,
      "fire_prob": 0.99856985,
      "fire_category": "high",
      "district": "Mustang",
      "province": 4.0,
      "location": "Gharapjhong",
      "valid_time": "2026-02-16T00:00:00"
    }
  ]
}
```

---

#### 6. Get Latest Prediction Date

**Endpoint:** `GET /predictions/neon/wildfire/latest-date`

**Response:**
```json
{
  "latest_prediction_date": "2026-02-16T00:00:00",
  "status": "available"
}
```

---

#### 7. Get Overall Statistics

**Endpoint:** `GET /predictions/neon/wildfire/stats`

**Response:**
```json
{
  "total_predictions": 12543,
  "avg_fire_prob": 0.6234,
  "max_fire_prob": 0.9986,
  "min_fire_prob": 0.1023,
  "high_risk_count": 5234,
  "provinces_affected": 7,
  "category_counts": {
    "minimal": 2340,
    "low": 2450,
    "medium": 3123,
    "high": 3450,
    "extreme": 1180
  }
}
```

---

#### 8. Health Check

**Endpoint:** `GET /predictions/neon/health`

Check if Neon database connection is working.

**Response:**
```json
{
  "status": "healthy",
  "database": "neon",
  "connection": "active"
}
```

---

## 🎨 Step 6: Frontend Integration

### Example: Fetch and Display on Map

```javascript
// Fetch wildfire map data
async function loadWildfireMap() {
  const response = await fetch(
    'http://localhost:8005/predictions/neon/wildfire/map-data?province=4&min_fire_prob=0.7'
  );
  const data = await response.json();
  
  console.log(`Loading ${data.total_points} wildfire prediction points`);
  
  // Add markers to map
  data.points.forEach(point => {
    addMapMarker({
      lat: point.lat,
      lng: point.lng,
      color: getRiskColor(point.fire_category),
      size: getRiskSize(point.fire_prob),
      popup: `
        <div class="wildfire-popup">
          <h3>${point.district}</h3>
          <p><strong>Location:</strong> ${point.location}</p>
          <p><strong>Fire Probability:</strong> ${(point.fire_prob * 100).toFixed(1)}%</p>
          <p><strong>Risk Level:</strong> <span class="risk-${point.fire_category}">${point.fire_category.toUpperCase()}</span></p>
          <p><strong>Date:</strong> ${new Date(point.valid_time).toLocaleDateString()}</p>
        </div>
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
    'extreme': '#8b0000'
  };
  return colors[category] || '#888888';
}

function getRiskSize(probability) {
  // Larger markers for higher probability
  return 5 + (probability * 15); // 5px to 20px
}
```

### Example: Display Statistics Dashboard

```javascript
// Fetch overall statistics
async function loadDashboard() {
  const response = await fetch('http://localhost:8005/predictions/neon/wildfire/stats');
  const stats = await response.json();
  
  // Update dashboard
  document.getElementById('total-predictions').textContent = 
    stats.total_predictions.toLocaleString();
  
  document.getElementById('avg-risk').textContent = 
    `${(stats.avg_fire_prob * 100).toFixed(1)}%`;
  
  document.getElementById('high-risk-count').textContent = 
    stats.high_risk_count.toLocaleString();
  
  // Create chart for risk categories
  createRiskCategoryChart(stats.category_counts);
  
  // Show provinces affected
  document.getElementById('provinces-affected').textContent = 
    `${stats.provinces_affected}/7 Provinces`;
}
```

### Example: Province Selector

```javascript
// Get province data for dropdown
async function loadProvinceSelector() {
  const response = await fetch('http://localhost:8005/predictions/neon/wildfire/by-province');
  const provinces = await response.json();
  
  const selector = document.getElementById('province-selector');
  
  provinces.forEach(prov => {
    const option = document.createElement('option');
    option.value = prov.province;
    option.textContent = `Province ${prov.province} - ${prov.total_predictions} predictions`;
    selector.appendChild(option);
  });
  
  // Load data when province is selected
  selector.addEventListener('change', (e) => {
    loadWildfireMap(e.target.value);
  });
}
```

---

## 🔍 Step 7: Testing

### 7.1 Test API with cURL

```bash
# Test health endpoint
curl http://localhost:8005/predictions/neon/health

# Get statistics
curl http://localhost:8005/predictions/neon/wildfire/stats

# Get Province 4 predictions
curl "http://localhost:8005/predictions/neon/wildfire?province=4&limit=10"
```

### 7.2 Test with Browser

1. Start server: `python app/main.py`
2. Open: http://localhost:8005/docs
3. Try out different endpoints in Swagger UI

---

## ⚠️ Troubleshooting

### Problem: Connection Error

**Error:** `could not connect to server`

**Solution:**
1. Check if your Neon project is active (not suspended)
2. Verify connection string in `.env` is correct
3. Ensure you have internet connection (Neon is cloud-based)
4. Check if SSL mode is set: `?sslmode=require`

---

### Problem: CSV Upload Fails

**Error:** `column "xyz" does not exist`

**Solution:**
- Make sure your CSV has **exact column names** (case-sensitive)
- Or rename columns in the CSV to match database schema

Required columns:
```
latitude, longitude, Elevation, valid_time, fire_prob, prediction_class, 
fire_category, gapa_napa, district, pr_name, province
```

---

### Problem: API Returns Empty Array

**Solution:**
1. Verify data was uploaded:
   ```bash
   python scripts/upload_wildfire_neon.py --test
   ```

2. Check data in database:
   ```sql
   SELECT COUNT(*) FROM wildfire_predictions;
   ```

3. Check filter parameters (province, date range, etc.)

---

### Problem: Date Format Error

**Error:** `invalid input syntax for type timestamp`

**Solution:**
The script auto-converts dates. Supported formats:
- `2026-02-16` (ISO format)
- `02/16/2026` (US format)
- `16/02/2026` (European format)

If still failing, check your CSV date format.

---

## 🎯 Quick Start Checklist

- [ ] Create Neon project and get connection string
- [ ] Update `.env` with `NEON_DATABASE_URL`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Test connection: `python scripts/upload_wildfire_neon.py --test`
- [ ] Run SQL schema in Neon SQL Editor
- [ ] Upload CSV data: `python scripts/upload_wildfire_neon.py --file data.csv`
- [ ] Start backend: `python app/main.py`
- [ ] Test API: http://localhost:8005/docs
- [ ] Integrate with frontend

---

## 📚 Additional Resources

- **Neon Documentation:** https://neon.tech/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **FastAPI Docs:** https://fastapi.tiangolo.com/

---

## 🔐 Security Notes

1. **Never commit `.env` file** to Git
2. Use **connection pooling** in production (already configured)
3. Neon automatically handles SSL/TLS encryption
4. Consider adding **API rate limiting** for production
5. Add **authentication** if needed (currently public endpoints)

---

## 🚀 Performance Tips

1. **Use COPY command** for bulk uploads (default)
2. **Create indexes** on frequently queried columns (already done)
3. **Limit results** in queries (use `limit` parameter)
4. **Use views** for complex aggregations (already created)
5. **Enable connection pooling** (already configured in neon.py)

---

## 📞 Need Help?

- Check API docs: http://localhost:8005/docs
- Test connection: `python scripts/upload_wildfire_neon.py --test`
- View logs in terminal when running backend

Happy coding! 🔥🗺️
