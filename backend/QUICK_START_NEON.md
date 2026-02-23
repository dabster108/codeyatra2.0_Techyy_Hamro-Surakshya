# 🔥 Wildfire Prediction - Quick Start (Neon Database)

## ⚡ Ultra-Fast Setup (5 minutes)

### 1️⃣ Get Connection String
1. Go to https://console.neon.tech
2. Copy your connection string from Dashboard

### 2️⃣ Configure
```bash
# Edit backend/.env
NEON_DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 3️⃣ Install & Test
```bash
cd backend
pip install -r requirements.txt
python scripts/upload_wildfire_neon.py --test
```

### 4️⃣ Create Table
Copy SQL from `migrations/neon_wildfire_predictions.sql` → Paste in Neon SQL Editor → Run

### 5️⃣ Upload CSV
```bash
python scripts/upload_wildfire_neon.py --file your_data.csv
```

### 6️⃣ Start API
```bash
python app/main.py
```

Visit: http://localhost:8005/docs

---

## 📡 API Endpoints (Quick Reference)

**Base URL:** `http://localhost:8005/predictions/neon`

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/wildfire` | Get predictions with filters | `?province=4&min_fire_prob=0.7` |
| `/wildfire/high-risk` | High-risk areas only | `?province=1&limit=100` |
| `/wildfire/by-district` | District summaries | `?province=4` |
| `/wildfire/by-province` | Province summaries | - |
| `/wildfire/map-data` | Map visualization data | `?min_fire_prob=0.6` |
| `/wildfire/latest-date` | Latest prediction date | - |
| `/wildfire/stats` | Overall statistics | - |
| `/health` | Database health check | - |

---

## 📤 CSV Upload Commands

```bash
# Single file
python scripts/upload_wildfire_neon.py --file data.csv

# All files in directory
python scripts/upload_wildfire_neon.py --directory data/

# Clear all data (⚠️ DANGEROUS)
python scripts/upload_wildfire_neon.py --clear

# Test connection
python scripts/upload_wildfire_neon.py --test
```

---

## 📊 CSV Format

```csv
latitude,longitude,Elevation,valid_time,fire_prob,prediction_class,fire_category,gapa_napa,district,pr_name,province
28.677,83.676,3153,2026-02-16,0.999,1,high,Gharapjhong,Mustang,Gandaki Pradesh,4.0
```

---

## 🌐 Frontend Integration Example

```javascript
// Fetch map data
const res = await fetch('http://localhost:8005/predictions/neon/wildfire/map-data?province=4');
const data = await res.json();

// data.points = [{ lat, lng, fire_prob, fire_category, ... }]
data.points.forEach(point => {
  addMarker(point.lat, point.lng, point.fire_category);
});
```

---

## ✅ Verify Everything Works

```bash
curl http://localhost:8005/predictions/neon/wildfire/stats
```

Should return:
```json
{
  "total_predictions": 12543,
  "avg_fire_prob": 0.6234,
  ...
}
```

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Connection error | Check `.env` has correct `NEON_DATABASE_URL` |
| Empty results | Verify CSV uploaded: `SELECT COUNT(*) FROM wildfire_predictions;` |
| Date format error | Script auto-converts dates. Check CSV format. |
| Import error | Run `pip install -r requirements.txt` |

---

## 📚 Full Documentation

See [NEON_SETUP_GUIDE.md](NEON_SETUP_GUIDE.md) for complete details.

---

**That's it! You're ready to predict wildfires! 🔥🚀**
