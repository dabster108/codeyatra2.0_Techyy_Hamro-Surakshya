// ─── API base ─────────────────────────────────────────────────────────────────
export const API_BASE = "http://127.0.0.1:8005";

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
