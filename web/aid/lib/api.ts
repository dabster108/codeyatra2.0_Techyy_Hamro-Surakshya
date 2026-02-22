/**
 * api.ts — FastAPI backend client for web/aid
 * Base URL: http://localhost:8005
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8005";

// ── types ────────────────────────────────────────────────────────────────────

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
  updated_at: string;
}

export interface ReliefRecordInput {
  full_name: string;
  citizenship_no: string;
  relief_amount: number;
  province: string;
  district: string;
  disaster_type: string;
  officer_name: string;
  officer_id: string;
}

export interface Analytics {
  total_allocated: number;
  total_distributed: number;
  remaining: number;
  utilization_percent: number;
  total_records: number;
}

export interface ProvinceSummary {
  province: string;
  total_distributed: number;
  record_count: number;
}

export interface DistrictSummary {
  district: string;
  province: string;
  total_distributed: number;
  record_count: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

async function get<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

// ── public endpoints (no auth) ────────────────────────────────────────────────

export async function getAnalytics(): Promise<Analytics> {
  const res = await fetch(`${BASE}/records/analytics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function getProvinceBreakdown(): Promise<ProvinceSummary[]> {
  const res = await fetch(`${BASE}/records/by-province`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch province breakdown");
  return res.json();
}

export async function getDistrictBreakdown(): Promise<DistrictSummary[]> {
  const res = await fetch(`${BASE}/records/by-district`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch district breakdown");
  return res.json();
}

// ── authenticated endpoints ───────────────────────────────────────────────────

export async function submitReliefRecord(
  data: ReliefRecordInput,
): Promise<ReliefRecord> {
  return post<ReliefRecord>("/records", data);
}

export async function listReliefRecords(filters?: {
  province?: string;
  district?: string;
  disaster_type?: string;
}): Promise<ReliefRecord[]> {
  const params = new URLSearchParams();
  if (filters?.province) params.set("province", filters.province);
  if (filters?.district) params.set("district", filters.district);
  if (filters?.disaster_type)
    params.set("disaster_type", filters.disaster_type);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return get<ReliefRecord[]>(`/records${qs}`);
}

export async function getOfficerRecords(): Promise<ReliefRecord[]> {
  return get<ReliefRecord[]>("/records/by-officer");
}

// ── auth ──────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<string> {
  const form = new URLSearchParams({ username: email, password });
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail);
  }
  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }
  return data.access_token;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem("access_token");
}
