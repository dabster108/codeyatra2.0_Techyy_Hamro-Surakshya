// ─── API base ─────────────────────────────────────────────────────────────────
// For Expo Go on mobile device, use your computer's local IP address
// Change this IP if your network changes
export const API_BASE = "http://10.5.5.182:8005";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PublicSummary {
  total_allocated: number;
  total_used: number;
  total_beneficiaries: number;
}

export interface ProvinceUtilization {
  province_id: number;
  allocated: number;
  used: number;
}

export interface ProvinceStat {
  province: string;
  total_amount: number;
  record_count: number;
}

export interface DistrictStat {
  district: string;
  province: string;
  total_amount: number;
  record_count: number;
}

export interface DisasterStat {
  disaster_type: string;
  total_amount: number;
  record_count: number;
}

export interface OfficerStat {
  officer_id: string;
  officer_name: string;
  total_amount: number;
  record_count: number;
}

export interface ReliefRecord {
  id: string;
  full_name: string;
  citizenship_no: string;
  relief_amount: number;
  province: string;
  district: string;
  disaster_type: string;
  officer_name: string;
  officer_id: string;
  created_at: string;
}

export interface AllRecordsData {
  summary: {
    total_distributed: number;
    total_records: number;
    unique_provinces: number;
    unique_districts: number;
  };
  by_province: ProvinceStat[];
  by_district: DistrictStat[];
  by_disaster: DisasterStat[];
  by_officer: OfficerStat[];
  recent_records: ReliefRecord[];
}

export interface WildfirePrediction {
  id?: string;
  latitude: number;
  longitude: number;
  valid_time: string;
  fire_prob: number; // 0-1
  prediction_class: number; // 0 or 1
  fire_category: string; // minimal, low, medium, high, extreme
  gapa_napa?: string;
  district: string;
  pr_name?: string;
  province: number; // 1-7
  prediction_date: string;
  created_at?: string;
  updated_at?: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────
export async function getPublicSummary(): Promise<PublicSummary> {
  const res = await fetch(`${API_BASE}/public/summary`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function getProvinceUtilization(): Promise<ProvinceUtilization[]> {
  const res = await fetch(`${API_BASE}/public/province-utilization`);
  if (!res.ok) throw new Error("Failed to fetch province utilization");
  return res.json();
}

export async function getAllRecords(): Promise<AllRecordsData> {
  const res = await fetch(`${API_BASE}/records/get-all-records`);
  if (!res.ok) throw new Error("Failed to fetch all records");
  return res.json();
}

// Date offset: Database dates are 7 days behind actual dates
const DATE_OFFSET_DAYS = 7;

/**
 * Adjust date for database offset (subtract 7 days)
 * If user selects Feb 23, query for Feb 16 in the database
 */
function getAdjustedDate(date: Date): string {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() - DATE_OFFSET_DAYS);
  return adjusted.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function getWildfirePredictions(params: {
  province?: number;
  district?: string;
  fire_category?: string;
  min_fire_prob?: number;
  date?: string; // Single prediction date (YYYY-MM-DD)
  limit?: number;
}): Promise<WildfirePrediction[]> {
  const queryParams = new URLSearchParams();

  if (params.province)
    queryParams.append("province", params.province.toString());
  if (params.district) queryParams.append("district", params.district);
  if (params.fire_category)
    queryParams.append("fire_category", params.fire_category);
  if (params.min_fire_prob !== undefined)
    queryParams.append("min_fire_prob", params.min_fire_prob.toString());

  // Use single date for both start and end (query predictions for that specific day)
  if (params.date) {
    const predictionDate = new Date(params.date);
    const adjustedDate = getAdjustedDate(predictionDate);
    queryParams.append("start_date", adjustedDate);
    queryParams.append("end_date", adjustedDate);
  }

  if (params.limit) queryParams.append("limit", params.limit.toString());

  // Use NEON endpoint (not Supabase) - this is where the wildfire data actually is
  const url = `${API_BASE}/predictions/neon/wildfire${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch wildfire predictions");
  return res.json();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const PROVINCE_NAMES: Record<number, string> = {
  1: "Koshi",
  2: "Madhesh",
  3: "Bagmati",
  4: "Gandaki",
  5: "Lumbini",
  6: "Karnali",
  7: "Sudurpashchim",
};

export const PROVINCE_NAMES_NE: Record<number, string> = {
  1: "कोशी",
  2: "मधेश",
  3: "बागमती",
  4: "गण्डकी",
  5: "लुम्बिनी",
  6: "कर्णाली",
  7: "सुदूरपश्चिम",
};

export function formatNPR(amount: number): string {
  if (amount >= 10_000_000) return `Rs. ${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `Rs. ${(amount / 100_000).toFixed(2)} L`;
  return `Rs. ${amount.toLocaleString()}`;
}
