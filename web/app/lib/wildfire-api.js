// API service for wildfire predictions from Neon database

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005';

// Date offset: Database dates are 7 days behind actual dates
const DATE_OFFSET_DAYS = 7;

export class WildfireAPI {
  /**
   * Check if backend API is available
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/predictions/neon/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend API is not available:', error.message);
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
    return adjusted.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Get actual date from database date (add 7 days)
   */
  static getActualDate(dbDateString) {
    const dbDate = new Date(dbDateString);
    dbDate.setDate(dbDate.getDate() + DATE_OFFSET_DAYS);
    return dbDate.toISOString().split('T')[0];
  }

  /**
   * Get wildfire predictions with filters
   */
  static async getPredictions(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.province) params.append('province', filters.province);
    if (filters.district) params.append('district', filters.district);
    if (filters.minFireProb !== undefined) params.append('min_fire_prob', filters.minFireProb);
    if (filters.fireCategory) params.append('fire_category', filters.fireCategory);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.limit) params.append('limit', filters.limit);
    
    const url = `${API_BASE_URL}/predictions/neon/wildfire?${params}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch wildfire predictions:', error);
      throw new Error('Backend API is not accessible. Make sure the backend server is running on ' + API_BASE_URL);
    }
  }

  /**
   * Get high-risk wildfire areas only
   */
  static async getHighRiskAreas(province = null, limit = 100) {
    const params = new URLSearchParams({ limit });
    if (province) params.append('province', province);
    
    const url = `${API_BASE_URL}/predictions/neon/wildfire/high-risk?${params}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch high-risk areas:', error);
      throw error;
    }
  }

  /**
   * Get predictions grouped by district
   */
  static async getByDistrict(province = null) {
    const params = new URLSearchParams();
    if (province) params.append('province', province);
    
    const url = `${API_BASE_URL}/predictions/neon/wildfire/by-district?${params}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch district data:', error);
      throw error;
    }
  }

  /**
   * Get predictions grouped by province
   */
  static async getByProvince() {
    const url = `${API_BASE_URL}/predictions/neon/wildfire/by-province`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch province data:', error);
      throw error;
    }
  }

  /**
   * Get map visualization data
   */
  static async getMapData(filters = {}) {
    const params = new URLSearchParams({
      min_fire_prob: filters.minFireProb || 0.5,
      latest_only: filters.latestOnly !== false ? 'true' : 'false'
    });
    
    if (filters.province) params.append('province', filters.province);
    
    const url = `${API_BASE_URL}/predictions/neon/wildfire/map-data?${params}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      throw error;
    }
  }

  /**
   * Get overall statistics
   */
  static async getStats() {
    const url = `${API_BASE_URL}/predictions/neon/wildfire/stats`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  }

  /**
   * Get latest prediction date
   */
  static async getLatestDate() {
    const url = `${API_BASE_URL}/predictions/neon/wildfire/latest-date`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch latest date:', error);
      throw error;
    }
  }

  /**
   * Transform Neon data to match frontend format
   */
  static transformToFrontendFormat(neonData) {
    return neonData.map((item, index) => {
      // Adjust date: Database date + 7 days = actual date
      const actualDate = item.valid_time ? this.getActualDate(item.valid_time) : null;
      
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
        dbDate: item.valid_time ? new Date(item.valid_time).toISOString().split('T')[0] : null, // Store original DB date
        elevation: item.elevation,
        fire_category: item.fire_category,
        prediction_class: item.prediction_class
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
      7: "Sudurpashchim"
    };
    return provinceMap[provinceNum] || `Province ${provinceNum}`;
  }

  /**
   * Convert fire probability to risk severity
   */
  static getRiskSeverity(fireProb) {
    if (fireProb >= 0.9) return "critical";
    if (fireProb >= 0.7) return "high";
    if (fireProb >= 0.4) return "moderate";
    return "low";
  }
}

export default WildfireAPI;
