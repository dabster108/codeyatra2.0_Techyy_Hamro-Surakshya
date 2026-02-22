const en = {
  // ── Home ──────────────────────────────────────────────
  appName: "Hamro Suraksha",
  appSubtitle: "Safety",
  welcomeLine1: "Stay Safe,",
  welcomeLine2: "Stay Secure",
  welcomeDesc: "Real-time protection and monitoring.",
  realtimeAlerts: "Real-time Alerts",
  viewAll: "View All",
  evacuationAreas: "Evacuation Areas",
  seeMap: "See Map",

  // alert items on home
  alert1Title: "Heavy Rainfall Warning",
  alert1Sub: "Kathmandu Valley • 2m ago",
  alert2Title: "Traffic Congestion",
  alert2Sub: "Koteshwor - Tinkune • 15m ago",
  alert3Title: "System Maintenance",
  alert3Sub: "Scheduled for 12:00 AM • 1h ago",

  // evacuation places on home
  evac1Name: "Tudikhel Ground",
  evac2Name: "Dasharath Stadium",
  evac3Name: "UN Park",

  // ── Map ───────────────────────────────────────────────
  maps: "Maps",
  evacAreaLabel: "Evacuation Areas",
  selectArea: "Select Area",
  disasterType: "Disaster Type",
  selectType: "Select Type",
  selectDate: "Select Date:",
  police: "Police",
  hospital: "Hospital",
  area3: "Area 3",
  flood: "Flood",
  landslide: "Landslide",
  fire: "Fire",
  other: "Other",

  // ── Alert Screen ──────────────────────────────────────
  alertsTitle: "Alerts",
  filterByLocation: "Filter by Location",
  filterByDate: "Filter by Date",
  province: "Province",
  district: "District",
  municipality: "Municipality",
  selectProvince: "Select Province",
  selectDistrict: "Select District",
  selectMunicipality: "Select Municipality",
  from: "From",
  to: "To",
  all: "All",
  clearFilters: "Clear Filters",
  noAlertsFound: "No alerts found",
  alertsFound: (n: number) => `${n} Alert${n !== 1 ? "s" : ""} Found`,
  noAlertsTitle: "No Alerts",
  noAlertsSub:
    "No alerts match the selected filters.\nTry adjusting the location or date range.",

  // severity
  high: "High",
  medium: "Medium",
  low: "Low",

  // categories
  catFlood: "Flood",
  catLandslide: "Landslide",
  catFire: "Fire",
  catEarthquake: "Earthquake",
  catStorm: "Storm",
  catDisease: "Disease",

  // mock alert content
  a1Title: "Severe Flooding in Terai Region",
  a1Loc: "Bardiya, Lumbini Province",
  a1Desc: "Heavy rainfall causing severe flooding. Evacuation advised.",
  a2Title: "Landslide Risk Alert",
  a2Loc: "Sindhupalchok, Bagmati Province",
  a2Desc: "Soil saturation has reached critical levels on northern slopes.",
  a3Title: "Forest Fire Spreading",
  a3Loc: "Chitwan, Bagmati Province",
  a3Desc: "Wildfire spreading near buffer zone. Community on standby.",
  a4Title: "Minor Earthquake Reported",
  a4Loc: "Kaski, Gandaki Province",
  a4Desc: "Magnitude 3.8 earthquake recorded near Pokhara. No damage reported.",
  a5Title: "Monsoon Storm Warning",
  a5Loc: "Sunsari, Koshi Province",
  a5Desc: "Strong winds expected. Residents advised to stay indoors.",
  a6Title: "Disease Outbreak Alert",
  a6Loc: "Kailali, Sudurpashchim Province",
  a6Desc:
    "Cholera cases rising. Medical teams deployed. Boil water before use.",
  a7Title: "Flash Flood Advisory",
  a7Loc: "Humla, Karnali Province",
  a7Desc: "Glacial lake overflow risk. Communities downstream should prepare.",
  a8Title: "Earthquake Aftershocks Ongoing",
  a8Loc: "Bajhang, Sudurpashchim Province",
  a8Desc: "Aftershocks continuing. Structural damage reported in 3 VDCs.",
};

export type Translations = typeof en;
export default en;
