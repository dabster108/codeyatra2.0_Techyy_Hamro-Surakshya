// API service for wildfire predictions from Neon database

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

// Date offset: Database dates are 7 days behind actual dates
const DATE_OFFSET_DAYS = 7;

// ─── Client-side cache ────────────────────────────────────────────────────────
// Prediction data is semi-static (updated once per day).  A 5-minute TTL avoids
// redundant requests when the user switches filters back and forth.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const _cache = new Map(); // url → { data, ts }
const _inflight = new Map(); // url → Promise  (request deduplication)

function _getCached(url) {
  const entry = _cache.get(url);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    _cache.delete(url);
    return null;
  }
  return entry.data;
}

/**
 * Fetch JSON from `url` with:
 *  - in-memory TTL caching (avoids re-fetch on repeated identical requests)
 *  - request deduplication    (concurrent identical calls share one fetch)
 *  - configurable timeout
 */
async function _cachedFetch(url, timeoutMs = 10000) {
  // 1. Serve from cache when fresh
  const cached = _getCached(url);
  if (cached !== null) return cached;

  // 2. If the same URL is already in-flight, reuse that promise
  if (_inflight.has(url)) return _inflight.get(url);

  // 3. Start a new request
  const promise = fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      _cache.set(url, { data, ts: Date.now() });
      return data;
    })
    .finally(() => {
      _inflight.delete(url);
    });

  _inflight.set(url, promise);
  return promise;
}

/** Manually invalidate all cached wildfire responses (e.g., after a refresh). */
export function clearWildfireCache() {
  for (const key of _cache.keys()) {
    if (key.includes("/predictions/")) _cache.delete(key);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export class WildfireAPI {
  /**
   * Check if backend API is available
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/neon/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch (error) {
      console.warn("Backend API is not available:", error.message);
      return false;
    }
  }

  /**
   * Get current date adjusted for database offset
   * If today is Feb 23, returns Feb 16 (7 days earlier)
   */
  static getAdjustedDate(date = new Date()) {
    const adjusted = new Date(date);
    adjusted.setDate(adjusted.getDate() - DATE_OFFSET_DAYS);
    return adjusted.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  /**
   * Get actual date from database date (add 7 days)
   */
  static getActualDate(dbDateString) {
    const dbDate = new Date(dbDateString);
    dbDate.setDate(dbDate.getDate() + DATE_OFFSET_DAYS);
    return dbDate.toISOString().split("T")[0];
  }

  /**
   * Get wildfire predictions with filters
   */
  static async getPredictions(filters = {}) {
    const params = new URLSearchParams();

    if (filters.province) params.append("province", filters.province);
    if (filters.district) params.append("district", filters.district);
    if (filters.minFireProb !== undefined)
      params.append("min_fire_prob", filters.minFireProb);
    if (filters.fireCategory)
      params.append("fire_category", filters.fireCategory);
    if (filters.startDate) params.append("start_date", filters.startDate);
    if (filters.endDate) params.append("end_date", filters.endDate);
    if (filters.limit) params.append("limit", filters.limit);

    const url = `${API_BASE_URL}/predictions/neon/wildfire?${params}`;

    try {
      return await _cachedFetch(url, 15000);
    } catch (error) {
      console.error("Failed to fetch wildfire predictions:", error);
      throw new Error(
        "Backend API is not accessible. Make sure the backend server is running on " +
          API_BASE_URL,
      );
    }
  }

  /**
   * Get high-risk wildfire areas only
   */
  static async getHighRiskAreas(province = null, limit = 100) {
    const params = new URLSearchParams({ limit });
    if (province) params.append("province", province);

    const url = `${API_BASE_URL}/predictions/neon/wildfire/high-risk?${params}`;

    try {
      return await _cachedFetch(url);
    } catch (error) {
      console.error("Failed to fetch high-risk areas:", error);
      throw error;
    }
  }

  /**
   * Get predictions grouped by district
   */
  static async getByDistrict(province = null) {
    const params = new URLSearchParams();
    if (province) params.append("province", province);

    const url = `${API_BASE_URL}/predictions/neon/wildfire/by-district?${params}`;

    try {
      return await _cachedFetch(url);
    } catch (error) {
      console.error("Failed to fetch district data:", error);
      throw error;
    }
  }

  /**
   * Get predictions grouped by province
   */
  static async getByProvince() {
    const url = `${API_BASE_URL}/predictions/neon/wildfire/by-province`;

    try {
      return await _cachedFetch(url);
    } catch (error) {
      console.error("Failed to fetch province data:", error);
      throw error;
    }
  }

  /**
   * Get map visualization data
   */
  static async getMapData(filters = {}) {
    const params = new URLSearchParams({
      min_fire_prob: filters.minFireProb || 0.5,
      latest_only: filters.latestOnly !== false ? "true" : "false",
    });

    if (filters.province) params.append("province", filters.province);

    const url = `${API_BASE_URL}/predictions/neon/wildfire/map-data?${params}`;

    try {
      return await _cachedFetch(url);
    } catch (error) {
      console.error("Failed to fetch map data:", error);
      throw error;
    }
  }

  /**
   * Get overall statistics
   */
  static async getStats() {
    const url = `${API_BASE_URL}/predictions/neon/wildfire/stats`;

    try {
      return await _cachedFetch(url);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      throw error;
    }
  }

  /**
   * Get latest prediction date
   */
  static async getLatestDate() {
    const url = `${API_BASE_URL}/predictions/neon/wildfire/latest-date`;

    try {
      return await _cachedFetch(url);
    } catch (error) {
      console.error("Failed to fetch latest date:", error);
      throw error;
    }
  }

  /**
   * Transform Neon data to match frontend format
   */
  static transformToFrontendFormat(neonData) {
    return neonData.map((item, index) => {
      // Adjust date: Database date + 7 days = actual date
      const actualDate = item.valid_time
        ? this.getActualDate(item.valid_time)
        : null;

      return {
        id: `wildfire-${index}`,
        name: item.gapa_napa || item.district,
        district: item.district,
        province: this.getProvinceName(item.province),
        municipality: item.gapa_napa || item.district,
        lat: item.latitude,
        lng: item.longitude,
        type: "Wildfire",
        risk: Math.round(item.fire_prob * 100),
        severity: this.getRiskSeverity(item.fire_prob),
        date: actualDate, // Display actual date (7 days ahead of DB date)
        dbDate: item.valid_time
          ? new Date(item.valid_time).toISOString().split("T")[0]
          : null, // Store original DB date
        elevation: item.elevation,
        fire_category: item.fire_category,
        prediction_class: item.prediction_class,
      };
    });
  }

  /**
   * Get province name from number
   */
  static getProvinceName(provinceNum) {
    const provinceMap = {
      1: "Koshi",
      2: "Madhesh",
      3: "Bagmati",
      4: "Gandaki",
      5: "Lumbini",
      6: "Karnali",
      7: "Sudurpashchim",
    };
    return provinceMap[provinceNum] || `Province ${provinceNum}`;
  }

  /**
   * Convert fire probability to risk severity
   * Thresholds: >0.99=extreme, >0.94=high, >0.8=medium, >0.5=low, else=minimal
   */
  static getRiskSeverity(fireProb) {
    if (fireProb > 0.99) return "extreme";
    if (fireProb > 0.94) return "high";
    if (fireProb > 0.8) return "medium";
    // if (fireProb > 0.5) return "low";
    return "minimal";
  }
}

export default WildfireAPI;
