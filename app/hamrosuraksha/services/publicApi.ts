// ─── API base ─────────────────────────────────────────────────────────────────
// Use your local machine IP when testing on a physical device.
// iOS Simulator & web: 127.0.0.1   |   Android Emulator: 10.0.2.2
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
