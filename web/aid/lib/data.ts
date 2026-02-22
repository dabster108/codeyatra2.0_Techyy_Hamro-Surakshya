import { NEPAL_DISTRICT_MAP } from './nepal-districts';

/**
 * Centralized Data Store for Hamro Surakshya
 * Optimized and organized for relational tracking.
 */

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  officer: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface Ward {
  id: string;
  number: number;
  allocated: number;
  used: number;
  remaining: number;
}

export interface District {
  id: string;
  name: string;
  allocated: number;
  used: number;
  remaining: number;
  utilization: number;
  beneficiaries: number;
  wards: Ward[];
}

export interface Province {
  id: string;
  name: string;
  chiefMinister: string;
  governor: string;
  receivedFromNDRRMA: number;
  allocatedToDistricts: number;
  used: number;
  remaining: number;
  utilization: number;
  totalDistricts: number;
  totalEvents: number;
  peopleAffected: number;
  districts: District[];
}

export interface NationalStats {
  totalBudget: number;
  allocatedProvinces: number;
  usedExpenditure: number;
  remainingFund: number;
  totalEvents: number;
  peopleAffected: number;
}

/**
 * Helper to generate district objects from names
 */
const generateDistricts = (provinceId: string, allocatedPerDistrict: number): District[] => {
  const names = NEPAL_DISTRICT_MAP[provinceId] || [];
  return names.map(name => ({
    id: name.toLowerCase().replace(/ /g, "-").replace(/[()]/g, ""),
    name: name,
    allocated: allocatedPerDistrict,
    used: 0,
    remaining: allocatedPerDistrict,
    utilization: 0,
    beneficiaries: 0,
    wards: []
  }));
};

export const fiscalYearData: Record<string, { provinces: Record<string, Province>, national: NationalStats }> = {
  "2081/82": {
    national: {
      totalBudget: 1860300000000,
      allocatedProvinces: 567820000000,
      usedExpenditure: 142000000000,
      remainingFund: 46500000,
      totalEvents: 425,
      peopleAffected: 125400,
    },
    provinces: {
      "koshi": {
        id: "koshi",
        name: "Koshi Province",
        chiefMinister: "Hikmat Kumar Karki",
        governor: "Parshuram Khapung",
        receivedFromNDRRMA: 60900000,
        allocatedToDistricts: 45000000,
        used: 12000000,
        remaining: 48900000,
        utilization: 19.7,
        totalDistricts: 14,
        totalEvents: 82,
        peopleAffected: 24500,
        districts: generateDistricts("koshi", 3214285)
      },
      "madhesh": {
        id: "madhesh",
        name: "Madhesh Province",
        chiefMinister: "Satish Kumar Singh",
        governor: "Sumitra Bhandari",
        receivedFromNDRRMA: 117800000,
        allocatedToDistricts: 80000000,
        used: 25000000,
        remaining: 92800000,
        utilization: 21,
        totalDistricts: 8,
        totalEvents: 65,
        peopleAffected: 45000,
        districts: generateDistricts("madhesh", 10000000)
      },
      "bagmati": { 
        id: "bagmati", 
        name: "Bagmati Province", 
        chiefMinister: "Bahadur Singh Lama", 
        governor: "Deepak Prasad Devkota", 
        receivedFromNDRRMA: 75800000, 
        allocatedToDistricts: 50000000, 
        used: 15000000, 
        remaining: 60800000, 
        utilization: 19.8, 
        totalDistricts: 13, 
        totalEvents: 110, 
        peopleAffected: 28000, 
        districts: generateDistricts("bagmati", 3846153)
      },
      "gandaki": { 
        id: "gandaki", 
        name: "Gandaki Province", 
        chiefMinister: "Surendra Raj Pandey", 
        governor: "Dilli Raj Bhatta", 
        receivedFromNDRRMA: 250000000, 
        allocatedToDistricts: 180000000, 
        used: 45000000, 
        remaining: 205000000, 
        utilization: 18, 
        totalDistricts: 11, 
        totalEvents: 55, 
        peopleAffected: 12000, 
        districts: generateDistricts("gandaki", 16363636)
      },
      "lumbini": { 
        id: "lumbini", 
        name: "Lumbini Province", 
        chiefMinister: "Chet Narayan Acharya", 
        governor: "Krishna Bahadur Ghartimagar", 
        receivedFromNDRRMA: 65000000, 
        allocatedToDistricts: 45000000, 
        used: 12000000, 
        remaining: 53000000, 
        utilization: 18.5, 
        totalDistricts: 12, 
        totalEvents: 42, 
        peopleAffected: 8500, 
        districts: generateDistricts("lumbini", 3750000)
      },
      "karnali": { 
        id: "karnali", 
        name: "Karnali Province", 
        chiefMinister: "Yam Lal Kandel", 
        governor: "Yagya Raj Joshi", 
        receivedFromNDRRMA: 95200000, 
        allocatedToDistricts: 75000000, 
        used: 25000000, 
        remaining: 70200000, 
        utilization: 26.3, 
        totalDistricts: 10, 
        totalEvents: 38, 
        peopleAffected: 15000, 
        districts: generateDistricts("karnali", 7500000)
      },
      "sudurpashchim": { 
        id: "sudurpashchim", 
        name: "Sudurpaschim Province", 
        chiefMinister: "Kamal Bahadur Shah", 
        governor: "Nazir Miya", 
        receivedFromNDRRMA: 118900000, 
        allocatedToDistricts: 90000000, 
        used: 35000000, 
        remaining: 83900000, 
        utilization: 29.4, 
        totalDistricts: 9, 
        totalEvents: 33, 
        peopleAffected: 7400, 
        districts: generateDistricts("sudurpashchim", 10000000)
      }
    }
  },
  "2080/81": {
    national: {
      totalBudget: 1751310000000,
      allocatedProvinces: 408000000000,
      usedExpenditure: 312000000000,
      remainingFund: 96000000000,
      totalEvents: 380,
      peopleAffected: 98000,
    },
    provinces: {
      "koshi": {
        id: "koshi",
        name: "Koshi Province",
        chiefMinister: "Hikmat Kumar Karki",
        governor: "Parshuram Khapung",
        receivedFromNDRRMA: 10680000000,
        allocatedToDistricts: 8500000000,
        used: 6125000000,
        remaining: 4555000000,
        utilization: 57,
        totalDistricts: 14,
        totalEvents: 75,
        peopleAffected: 18000,
        districts: generateDistricts("koshi", 607142857)
      },
      "madhesh": {
        id: "madhesh",
        name: "Madhesh Province",
        chiefMinister: "Satish Kumar Singh",
        governor: "Sumitra Bhandari",
        receivedFromNDRRMA: 44110000000,
        allocatedToDistricts: 35000000000,
        used: 14115200000,
        remaining: 29994800000,
        utilization: 32,
        totalDistricts: 8,
        totalEvents: 60,
        peopleAffected: 32000,
        districts: generateDistricts("madhesh", 4375000000)
      },
      "bagmati": { 
        id: "bagmati", 
        name: "Bagmati Province", 
        chiefMinister: "Bahadur Singh Lama", 
        governor: "Deepak Prasad Devkota", 
        receivedFromNDRRMA: 20000000000, 
        allocatedToDistricts: 18000000000, 
        used: 16000000000, 
        remaining: 4000000000, 
        utilization: 80, 
        totalDistricts: 13, 
        totalEvents: 95, 
        peopleAffected: 21000, 
        districts: generateDistricts("bagmati", 1384615384)
      },
      "gandaki": { id: "gandaki", name: "Gandaki Province", chiefMinister: "Surendra Raj Pandey", governor: "Dilli Raj Bhatta", receivedFromNDRRMA: 10000000000, allocatedToDistricts: 8000000000, used: 7500000000, remaining: 2500000000, utilization: 75, totalDistricts: 11, totalEvents: 45, peopleAffected: 9500, districts: generateDistricts("gandaki", 727272727) },
      "lumbini": { id: "lumbini", name: "Lumbini Province", chiefMinister: "Chet Narayan Acharya", governor: "Krishna Bahadur Ghartimagar", receivedFromNDRRMA: 12000000000, allocatedToDistricts: 10000000000, used: 9000000000, remaining: 3000000000, utilization: 75, totalDistricts: 12, totalEvents: 50, peopleAffected: 11000, districts: generateDistricts("lumbini", 833333333) },
      "karnali": { id: "karnali", name: "Karnali Province", chiefMinister: "Yam Lal Kandel", governor: "Yagya Raj Joshi", receivedFromNDRRMA: 7000000000, allocatedToDistricts: 5000000000, used: 4800000000, remaining: 2200000000, utilization: 68, totalDistricts: 10, totalEvents: 30, peopleAffected: 14000, districts: generateDistricts("karnali", 500000000) },
      "sudurpashchim": { id: "sudurpashchim", name: "Sudurpaschim Province", chiefMinister: "Kamal Bahadur Shah", governor: "Nazir Miya", receivedFromNDRRMA: 6000000000, allocatedToDistricts: 4500000000, used: 4200000000, remaining: 1800000000, utilization: 70, totalDistricts: 9, totalEvents: 25, peopleAffected: 5000, districts: generateDistricts("sudurpashchim", 500000000) }
    }
  }
};
