// Shared budget & aid data used across transparency, government, and province pages

export const PROVINCES = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];

// Total national disaster budget
export const NATIONAL_BUDGET = {
  total: 12_500_000_000, // 12.5 Billion NPR
  allocated: 9_800_000_000,
  disbursed: 7_200_000_000,
  fiscalYear: "2082/83",
};

// Province-level allocations
export const PROVINCE_BUDGETS = {
  Koshi:          { allocated: 2_100_000_000, disbursed: 1_650_000_000, disasters: 14, affected: 45200 },
  Madhesh:        { allocated: 1_800_000_000, disbursed: 1_320_000_000, disasters: 11, affected: 38900 },
  Bagmati:        { allocated: 1_900_000_000, disbursed: 1_480_000_000, disasters: 9,  affected: 28700 },
  Gandaki:        { allocated: 1_200_000_000, disbursed:   890_000_000, disasters: 7,  affected: 15400 },
  Lumbini:        { allocated: 1_100_000_000, disbursed:   780_000_000, disasters: 8,  affected: 19600 },
  Karnali:        { allocated:   900_000_000, disbursed:   620_000_000, disasters: 5,  affected: 8900  },
  Sudurpashchim:  { allocated:   800_000_000, disbursed:   460_000_000, disasters: 6,  affected: 12500 },
};

// District-level data (per province)
export const DISTRICT_DATA = {
  Koshi: [
    { district: "Sunsari",    allocated: 480_000_000, disbursed: 390_000_000, affected: 12400, shelters: 8,  municipality: "Inaruwa" },
    { district: "Morang",     allocated: 420_000_000, disbursed: 340_000_000, affected: 9800,  shelters: 6,  municipality: "Biratnagar" },
    { district: "Jhapa",      allocated: 350_000_000, disbursed: 280_000_000, affected: 7200,  shelters: 5,  municipality: "Damak" },
    { district: "Taplejung",  allocated: 280_000_000, disbursed: 210_000_000, affected: 5100,  shelters: 3,  municipality: "Phungling" },
    { district: "Panchthar",  allocated: 250_000_000, disbursed: 190_000_000, affected: 4800,  shelters: 4,  municipality: "Phidim" },
    { district: "Udayapur",   allocated: 320_000_000, disbursed: 240_000_000, affected: 5900,  shelters: 4,  municipality: "Triyuga" },
  ],
  Madhesh: [
    { district: "Dhanusha",   allocated: 380_000_000, disbursed: 290_000_000, affected: 8700,  shelters: 5,  municipality: "Janakpur" },
    { district: "Parsa",      allocated: 340_000_000, disbursed: 260_000_000, affected: 7500,  shelters: 4,  municipality: "Birgunj" },
    { district: "Siraha",     allocated: 310_000_000, disbursed: 230_000_000, affected: 6800,  shelters: 4,  municipality: "Lahan" },
    { district: "Sarlahi",    allocated: 290_000_000, disbursed: 220_000_000, affected: 6100,  shelters: 3,  municipality: "Malangwa" },
    { district: "Saptari",    allocated: 260_000_000, disbursed: 190_000_000, affected: 5400,  shelters: 3,  municipality: "Rajbiraj" },
    { district: "Rautahat",   allocated: 220_000_000, disbursed: 130_000_000, affected: 4400,  shelters: 3,  municipality: "Gaur" },
  ],
  Bagmati: [
    { district: "Kathmandu",     allocated: 420_000_000, disbursed: 350_000_000, affected: 8900,  shelters: 12, municipality: "Kathmandu Metro" },
    { district: "Sindhupalchok", allocated: 380_000_000, disbursed: 300_000_000, affected: 6800,  shelters: 5,  municipality: "Chautara" },
    { district: "Chitwan",       allocated: 350_000_000, disbursed: 280_000_000, affected: 5500,  shelters: 6,  municipality: "Bharatpur" },
    { district: "Makwanpur",     allocated: 310_000_000, disbursed: 230_000_000, affected: 4200,  shelters: 4,  municipality: "Hetauda" },
    { district: "Nuwakot",       allocated: 220_000_000, disbursed: 160_000_000, affected: 2100,  shelters: 3,  municipality: "Bidur" },
    { district: "Dhading",       allocated: 220_000_000, disbursed: 160_000_000, affected: 1200,  shelters: 2,  municipality: "Nilkantha" },
  ],
  Gandaki: [
    { district: "Kaski",     allocated: 340_000_000, disbursed: 260_000_000, affected: 5200,  shelters: 5,  municipality: "Pokhara" },
    { district: "Gorkha",    allocated: 280_000_000, disbursed: 210_000_000, affected: 3800,  shelters: 3,  municipality: "Gorkha" },
    { district: "Lamjung",   allocated: 240_000_000, disbursed: 180_000_000, affected: 2800,  shelters: 3,  municipality: "Besisahar" },
    { district: "Palpa",     allocated: 180_000_000, disbursed: 120_000_000, affected: 1800,  shelters: 2,  municipality: "Tansen" },
    { district: "Mustang",   allocated: 160_000_000, disbursed: 120_000_000, affected: 1800,  shelters: 1,  municipality: "Gharapjhong" },
  ],
  Lumbini: [
    { district: "Rupandehi",   allocated: 310_000_000, disbursed: 230_000_000, affected: 5800,  shelters: 5,  municipality: "Butwal" },
    { district: "Kapilvastu",  allocated: 240_000_000, disbursed: 170_000_000, affected: 4200,  shelters: 3,  municipality: "Kapilvastu" },
    { district: "Dang",        allocated: 210_000_000, disbursed: 150_000_000, affected: 3600,  shelters: 3,  municipality: "Tulsipur" },
    { district: "Nawalparasi", allocated: 190_000_000, disbursed: 130_000_000, affected: 3200,  shelters: 2,  municipality: "Ramgram" },
    { district: "Rolpa",       allocated: 150_000_000, disbursed:  100_000_000, affected: 2800,  shelters: 2,  municipality: "Rolpa" },
  ],
  Karnali: [
    { district: "Surkhet",  allocated: 280_000_000, disbursed: 210_000_000, affected: 3200,  shelters: 3,  municipality: "Birendranagar" },
    { district: "Jumla",    allocated: 220_000_000, disbursed: 150_000_000, affected: 2400,  shelters: 2,  municipality: "Chandannath" },
    { district: "Humla",    allocated: 180_000_000, disbursed: 120_000_000, affected: 1800,  shelters: 1,  municipality: "Namkha" },
    { district: "Dolpa",    allocated: 220_000_000, disbursed: 140_000_000, affected: 1500,  shelters: 1,  municipality: "Thuli Bheri" },
  ],
  Sudurpashchim: [
    { district: "Kailali",     allocated: 260_000_000, disbursed: 180_000_000, affected: 4200,  shelters: 4,  municipality: "Dhangadhi" },
    { district: "Kanchanpur",  allocated: 200_000_000, disbursed: 120_000_000, affected: 3100,  shelters: 2,  municipality: "Mahendranagar" },
    { district: "Doti",        allocated: 180_000_000, disbursed: 100_000_000, affected: 2800,  shelters: 2,  municipality: "Dipayal Silgadhi" },
    { district: "Bajhang",     allocated: 160_000_000, disbursed:  60_000_000, affected: 2400,  shelters: 2,  municipality: "Chainpur" },
  ],
};

// Aid distribution records
export const AID_RECORDS = [
  { id: 1,  province: "Koshi",     district: "Sunsari",      municipality: "Inaruwa",     recipient: "Koshi Flood Relief Camp A",    type: "money",   amount: 2_500_000, unit: "NPR",     date: "2026-02-20", status: "delivered",  beneficiaries: 340 },
  { id: 2,  province: "Koshi",     district: "Sunsari",      municipality: "Inaruwa",     recipient: "Inaruwa Ward 4 Families",      type: "food",    amount: 500,       unit: "packets", date: "2026-02-21", status: "delivered",  beneficiaries: 500 },
  { id: 3,  province: "Koshi",     district: "Sunsari",      municipality: "Dharan",      recipient: "Dharan Shelter Camp",          type: "shelter", amount: 120,       unit: "tents",   date: "2026-02-21", status: "delivered",  beneficiaries: 480 },
  { id: 4,  province: "Koshi",     district: "Morang",       municipality: "Biratnagar",  recipient: "Biratnagar Ward 7-11",         type: "clothes", amount: 800,       unit: "sets",    date: "2026-02-22", status: "in-transit", beneficiaries: 800 },
  { id: 5,  province: "Koshi",     district: "Morang",       municipality: "Urlabari",    recipient: "Urlabari School Relief Center", type: "food",    amount: 350,       unit: "packets", date: "2026-02-22", status: "delivered",  beneficiaries: 350 },
  { id: 6,  province: "Bagmati",   district: "Sindhupalchok", municipality: "Melamchi",    recipient: "Melamchi Landslide Survivors", type: "money",   amount: 4_200_000, unit: "NPR",     date: "2026-02-19", status: "delivered",  beneficiaries: 220 },
  { id: 7,  province: "Bagmati",   district: "Sindhupalchok", municipality: "Chautara",    recipient: "Chautara School Camp",         type: "shelter", amount: 80,        unit: "tents",   date: "2026-02-20", status: "delivered",  beneficiaries: 320 },
  { id: 8,  province: "Bagmati",   district: "Chitwan",       municipality: "Bharatpur",   recipient: "Rapti Flood Evacuees",         type: "food",    amount: 600,       unit: "packets", date: "2026-02-21", status: "delivered",  beneficiaries: 600 },
  { id: 9,  province: "Bagmati",   district: "Makwanpur",     municipality: "Hetauda",     recipient: "Hetauda Fire Affected",        type: "clothes", amount: 300,       unit: "sets",    date: "2026-02-22", status: "pending",    beneficiaries: 300 },
  { id: 10, province: "Gandaki",   district: "Kaski",         municipality: "Pokhara",     recipient: "Seti River Landslide Camp",    type: "money",   amount: 3_100_000, unit: "NPR",     date: "2026-02-20", status: "delivered",  beneficiaries: 180 },
  { id: 11, province: "Gandaki",   district: "Kaski",         municipality: "Pokhara",     recipient: "Pokhara Ward 17 Evacuees",     type: "shelter", amount: 60,        unit: "tents",   date: "2026-02-21", status: "delivered",  beneficiaries: 240 },
  { id: 12, province: "Gandaki",   district: "Gorkha",        municipality: "Gorkha",      recipient: "Gorkha EQ Assessment Camp",    type: "food",    amount: 200,       unit: "packets", date: "2026-02-22", status: "in-transit", beneficiaries: 200 },
  { id: 13, province: "Madhesh",   district: "Dhanusha",      municipality: "Janakpur",    recipient: "Janakpur Flood Relief Center", type: "money",   amount: 1_800_000, unit: "NPR",     date: "2026-02-21", status: "delivered",  beneficiaries: 410 },
  { id: 14, province: "Madhesh",   district: "Parsa",         municipality: "Birgunj",     recipient: "Birgunj Ward 3-5 Families",   type: "food",    amount: 450,       unit: "packets", date: "2026-02-22", status: "delivered",  beneficiaries: 450 },
  { id: 15, province: "Madhesh",   district: "Siraha",        municipality: "Lahan",       recipient: "Lahan Displaced Families",     type: "shelter", amount: 90,        unit: "tents",   date: "2026-02-22", status: "pending",    beneficiaries: 360 },
  { id: 16, province: "Lumbini",   district: "Rupandehi",     municipality: "Butwal",      recipient: "Butwal Flood Camp",            type: "money",   amount: 1_500_000, unit: "NPR",     date: "2026-02-20", status: "delivered",  beneficiaries: 280 },
  { id: 17, province: "Lumbini",   district: "Dang",          municipality: "Tulsipur",    recipient: "Tulsipur Fire Victims",        type: "clothes", amount: 250,       unit: "sets",    date: "2026-02-21", status: "delivered",  beneficiaries: 250 },
  { id: 18, province: "Karnali",   district: "Surkhet",       municipality: "Birendranagar", recipient: "Surkhet EQ Relief Camp",     type: "food",    amount: 180,       unit: "packets", date: "2026-02-22", status: "in-transit", beneficiaries: 180 },
  { id: 19, province: "Sudurpashchim", district: "Kailali",   municipality: "Dhangadhi",   recipient: "Dhangadhi Flood Evacuees",     type: "money",   amount: 2_000_000, unit: "NPR",     date: "2026-02-21", status: "delivered",  beneficiaries: 350 },
  { id: 20, province: "Sudurpashchim", district: "Doti",      municipality: "Dipayal Silgadhi", recipient: "Doti Landslide Survivors", type: "shelter", amount: 40,        unit: "tents",   date: "2026-02-22", status: "pending",    beneficiaries: 160 },
];

// Aid type metadata
export const AID_TYPES = {
  money:   { label: "Cash Relief",      color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200", icon: "banknote" },
  food:    { label: "Food Supplies",     color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: "utensils" },
  shelter: { label: "Shelter/Tents",     color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200", icon: "tent" },
  clothes: { label: "Clothing",          color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", icon: "shirt" },
};
