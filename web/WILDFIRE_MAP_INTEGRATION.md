# Wildfire Predictions Map Integration

This document explains how the real-time wildfire prediction data from Neon database is integrated into the predictions map.

## 🎯 How It Works

The predictions page now has a **toggle switch** that allows you to switch between:
1. **Static predictions** - Mock data for demonstrations
2. **Real wildfire data** - Live predictions from your Neon database

## 🚀 Setup

### 1. Backend Setup
Make sure your backend is running:
```bash
cd backend
python app/main.py
```

Backend will run on: `http://localhost:8005`

### 2. Frontend Configuration
The frontend is already configured to use the backend API. Check `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8005
```

### 3. Start Frontend
```bash
cd web
npm install
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 📍 Using the Map

### Step 1: Navigate to Predictions
Go to: `http://localhost:3000/predictions`

### Step 2: Filter by Wildfire
1. In the **Type** dropdown, select **"Wildfire"**
2. You'll see a new panel appear with a toggle button

### Step 3: Enable Real Data
Click the **"USE REAL DATA"** button in the orange panel

This will:
- ✅ Fetch real wildfire predictions from your Neon database
- ✅ Display them on the Nepal map
- ✅ Show real-time statistics (total predictions, high-risk count, avg risk, etc.)
- ✅ Apply province/district filters

### Step 4: Apply Filters
You can filter the data by:
- **Province** - Select specific province (1-7)
- **District** - Select specific district
- **Date** - Filter by prediction date

## 🔥 Features

### Real-Time Statistics
When real data is enabled, you'll see:
- **Total Predictions** - Total wildfire predictions in database
- **High Risk Count** - Number of high/extreme risk areas
- **Average Risk** - Average fire probability across all predictions
- **Provinces Affected** - Number of provinces with wildfire risk

### Map Visualization
- Each prediction point is shown on the map
- Color-coded by risk level:
  - 🔴 **Red** - Critical (90%+ fire probability)
  - 🟠 **Orange** - High (70-89%)
  - 🔵 **Blue** - Moderate (40-69%)
  - ⚪ **Gray** - Low (<40%)

### Data Details
Click on any marker to see:
- Location (Municipality/District)
- Fire Probability
- Risk Category
- Elevation
- Prediction Date

## 🔧 API Endpoints Used

The frontend calls these backend endpoints:

1. **Get Predictions**
   ```
   GET /predictions/neon/wildfire?province=4&district=Mustang&limit=1000
   ```

2. **Get Statistics**
   ```
   GET /predictions/neon/wildfire/stats
   ```

3. **Get Map Data**
   ```
   GET /predictions/neon/wildfire/map-data?province=4&min_fire_prob=0.5
   ```

## 📊 Data Format

The API returns data in this format:
```json
{
  "id": "uuid",
  "latitude": 28.677,
  "longitude": 83.676,
  "elevation": 3153,
  "fire_prob": 0.9986,
  "fire_category": "high",
  "district": "Mustang",
  "province": 4.0,
  "gapa_napa": "Gharapjhong",
  "valid_time": "2026-02-16T00:00:00"
}
```

The frontend automatically transforms this to match the map's format.

## 🎨 UI Components

### Toggle Button
- **Gray Button** - Static data is being used
- **Orange Button** - Real data is being used
- **Green "LIVE" Badge** - Indicates real-time data is active

### Loading State
When fetching data:
- Button shows spinning icon
- Text changes to "LOADING..."
- Button is disabled

### Statistics Panel
Shows 4 key metrics in an orange-bordered panel:
- Total predictions
- High-risk areas
- Average probability
- Provinces affected

## 🔍 Troubleshooting

### Problem: "USE REAL DATA" button does nothing

**Solution:**
1. Check backend is running: `http://localhost:8005/docs`
2. Check console for errors (F12 in browser)
3. Verify Neon database has data:
   ```bash
   curl http://localhost:8005/predictions/neon/wildfire/stats
   ```

### Problem: No predictions showing on map

**Solution:**
1. Make sure you have uploaded CSV data to Neon:
   ```bash
   cd backend
   python scripts/upload_wildfire_neon.py --file your_data.csv
   ```

2. Check if data exists:
   ```bash
   python scripts/upload_wildfire_neon.py --test
   ```

3. Try adjusting the minimum probability threshold in the code (default is 30%)

### Problem: CORS errors

**Solution:**
The backend already has CORS enabled for all origins. If you still see errors:
1. Make sure backend is running
2. Check `.env.local` has correct API URL
3. Restart both backend and frontend

## 📈 Performance

- **First Load**: ~2-3 seconds (fetches all predictions)
- **Filter Changes**: Instant (data is cached)
- **Data Refresh**: Click toggle button to reload

## 🔐 Production Deployment

When deploying to production:

1. Update `web/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-production-api.com
   ```

2. Make sure your backend is deployed and accessible

3. Update CORS settings in backend if needed (in `app/main.py`)

## 💡 Tips

1. **For large datasets**: The API limits results to 1000 by default. Adjust the `limit` parameter if needed.

2. **For better performance**: Use province/district filters to load less data

3. **For specific risk levels**: The API filters by minimum 30% fire probability. Adjust in `wildfire-api.js` if needed.

4. **For different time periods**: Add date filters to show predictions for specific days

## 🎯 Next Steps

Possible enhancements:
- Add date range selector
- Add fire probability slider
- Show prediction confidence intervals
- Display weather data overlays
- Add export functionality (download data as CSV)
- Add heatmap view
- Show historical trends

---

**Questions?** Check the API documentation at `http://localhost:8005/docs`
