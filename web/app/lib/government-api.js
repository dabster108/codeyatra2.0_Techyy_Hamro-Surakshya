/**
 * Government Dashboard API Client
 * Fetches data from FastAPI backend for government and province dashboards
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

/**
 * Fetch with timeout helper
 */
async function fetchWithTimeout(url, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(new DOMException("Request timed out", "TimeoutError")),
    timeout,
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error?.name === "AbortError" || error?.name === "TimeoutError") {
      throw new Error(`Request to ${url} timed out after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Get national-level budget summary
 * @returns {Promise<Object>} National budget data
 */
export async function getNationalDashboard() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/government/national`, {
      cache: "no-store",
    }, 8000);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch national dashboard:", error);
    // Return fallback data
    return {
      fiscal_year: "2082/83",
      total: 12500000000,
      allocated: 9800000000,
      disbursed: 7200000000,
      remaining: 2600000000,
      utilization_percent: 73.47,
      total_disasters: 12,
      total_affected: 169200,
    };
  }
}

/**
 * Get all provinces budget data
 * @returns {Promise<Array>} Array of province budget data
 */
export async function getAllProvinces() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/government/provinces`, {
      cache: "no-store",
    }, 8000);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    // Return fallback data
    return [
      { province: "Koshi", allocated: 2100000000, disbursed: 1650000000, remaining: 450000000, utilization: 78.57, disasters: 14, affected: 45200 },
      { province: "Madhesh", allocated: 1800000000, disbursed: 1320000000, remaining: 480000000, utilization: 73.33, disasters: 11, affected: 38900 },
      { province: "Bagmati", allocated: 1900000000, disbursed: 1480000000, remaining: 420000000, utilization: 77.89, disasters: 9, affected: 28700 },
      { province: "Gandaki", allocated: 1200000000, disbursed: 890000000, remaining: 310000000, utilization: 74.17, disasters: 7, affected: 15400 },
      { province: "Lumbini", allocated: 1100000000, disbursed: 780000000, remaining: 320000000, utilization: 70.91, disasters: 8, affected: 19600 },
      { province: "Karnali", allocated: 900000000, disbursed: 620000000, remaining: 280000000, utilization: 68.89, disasters: 5, affected: 8900 },
      { province: "Sudurpashchim", allocated: 800000000, disbursed: 460000000, remaining: 340000000, utilization: 57.50, disasters: 6, affected: 12500 },
    ];
  }
}

/**
 * Get detailed data for a specific province including districts
 * @param {string} provinceName - Name of the province
 * @returns {Promise<Object>} Province detail with districts
 */
export async function getProvinceDetail(provinceName) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/government/province/${encodeURIComponent(provinceName)}`, {
      cache: "no-store",
    }, 8000);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch province detail for ${provinceName}:`, error);
    // Return fallback data based on province
    return getFallbackProvinceDetail(provinceName);
  }
}

/**
 * Get recent aid distribution records
 * @param {number} limit - Number of records to fetch (default: 20)
 * @returns {Promise<Array>} Array of recent aid records
 */
export async function getRecentAid(limit = 20) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/government/recent-aid?limit=${limit}`, {
      cache: "no-store",
    }, 8000);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch recent aid:", error);
    return [];
  }
}

/**
 * Check if backend is available
 * @returns {Promise<boolean>} True if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/health`, {}, 5000);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Fallback province detail data
function getFallbackProvinceDetail(provinceName) {
  const fallbackData = {
    Koshi: {
      districts: [
        { district: "Sunsari", allocated: 480000000, disbursed: 390000000, remaining: 90000000, utilization: 81.25, disasters: 4, affected: 12400 },
        { district: "Morang", allocated: 420000000, disbursed: 340000000, remaining: 80000000, utilization: 80.95, disasters: 3, affected: 9800 },
        { district: "Jhapa", allocated: 350000000, disbursed: 280000000, remaining: 70000000, utilization: 80.00, disasters: 2, affected: 7200 },
      ],
    },
    Madhesh: {
      districts: [
        { district: "Dhanusha", allocated: 380000000, disbursed: 290000000, remaining: 90000000, utilization: 76.32, disasters: 3, affected: 8700 },
        { district: "Parsa", allocated: 340000000, disbursed: 260000000, remaining: 80000000, utilization: 76.47, disasters: 2, affected: 7500 },
      ],
    },
    // Add more fallback data as needed
  };

  const budget = {
    Koshi: { allocated: 2100000000, disbursed: 1650000000 },
    Madhesh: { allocated: 1800000000, disbursed: 1320000000 },
    Bagmati: { allocated: 1900000000, disbursed: 1480000000 },
    Gandaki: { allocated: 1200000000, disbursed: 890000000 },
    Lumbini: { allocated: 1100000000, disbursed: 780000000 },
    Karnali: { allocated: 900000000, disbursed: 620000000 },
    Sudurpashchim: { allocated: 800000000, disbursed: 460000000 },
  }[provinceName] || { allocated: 1000000000, disbursed: 700000000 };

  return {
    province: provinceName,
    budget: {
      allocated: budget.allocated,
      disbursed: budget.disbursed,
      remaining: budget.allocated - budget.disbursed,
      utilization: ((budget.disbursed / budget.allocated) * 100).toFixed(2),
    },
    stats: {
      disasters: 10,
      affected: 25000,
      districts_count: fallbackData[provinceName]?.districts.length || 5,
    },
    districts: fallbackData[provinceName]?.districts || [],
  };
}
