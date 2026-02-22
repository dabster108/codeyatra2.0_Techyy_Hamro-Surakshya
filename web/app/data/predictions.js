// Local-level predictions (municipality/ward granularity)
export const PREDICTIONS = [
  // Koshi Province
  { id: 1,  name: "Itahari",         district: "Sunsari",       province: "Koshi",     municipality: "Itahari Sub-Metro",  lat: 26.67, lng: 87.28, type: "Flood",      risk: 91, severity: "critical", date: "2026-02-25" },
  { id: 2,  name: "Dharan",          district: "Sunsari",       province: "Koshi",     municipality: "Dharan Sub-Metro",   lat: 26.82, lng: 87.28, type: "Flood",      risk: 87, severity: "critical", date: "2026-02-24" },
  { id: 3,  name: "Biratnagar",      district: "Morang",        province: "Koshi",     municipality: "Biratnagar Metro",   lat: 26.45, lng: 87.28, type: "Flood",      risk: 82, severity: "critical", date: "2026-02-26" },
  { id: 4,  name: "Urlabari",        district: "Morang",        province: "Koshi",     municipality: "Urlabari",           lat: 26.63, lng: 87.15, type: "Flood",      risk: 68, severity: "high",     date: "2026-02-25" },
  { id: 5,  name: "Phidim",          district: "Panchthar",     province: "Koshi",     municipality: "Phidim",             lat: 27.15, lng: 87.74, type: "Landslide",  risk: 71, severity: "high",     date: "2026-02-27" },
  { id: 6,  name: "Taplejung Ward 5",district: "Taplejung",     province: "Koshi",     municipality: "Taplejung",          lat: 27.35, lng: 87.66, type: "Earthquake", risk: 42, severity: "moderate", date: "2026-03-01" },
  
  // Bagmati Province
  { id: 7,  name: "Kathmandu-16",    district: "Kathmandu",     province: "Bagmati",   municipality: "Kathmandu Metro",    lat: 27.72, lng: 85.32, type: "Extreme Weather", risk: 65, severity: "high",     date: "2026-02-23" },
  { id: 8,  name: "Lalitpur-21",     district: "Lalitpur",      province: "Bagmati",   municipality: "Lalitpur Metro",     lat: 27.67, lng: 85.32, type: "Extreme Weather", risk: 58, severity: "moderate", date: "2026-02-24" },
  { id: 9,  name: "Bhaktapur-12",    district: "Bhaktapur",     province: "Bagmati",   municipality: "Bhaktapur",          lat: 27.67, lng: 85.43, type: "Extreme Weather", risk: 54, severity: "moderate", date: "2026-02-24" },
  { id: 10, name: "Hetauda",         district: "Makwanpur",     province: "Bagmati",   municipality: "Hetauda Sub-Metro",  lat: 27.43, lng: 85.03, type: "Wildfire",   risk: 73, severity: "high",     date: "2026-02-28" },
  { id: 11, name: "Chautara",        district: "Sindhupalchok", province: "Bagmati",   municipality: "Chautara Sangachok", lat: 27.65, lng: 85.63, type: "Landslide",  risk: 77, severity: "high",     date: "2026-02-26" },
  { id: 12, name: "Melamchi",        district: "Sindhupalchok", province: "Bagmati",   municipality: "Melamchi",           lat: 27.80, lng: 85.68, type: "Landslide",  risk: 84, severity: "critical", date: "2026-02-25" },
  { id: 13, name: "Bidur",           district: "Nuwakot",       province: "Bagmati",   municipality: "Bidur",              lat: 27.94, lng: 85.15, type: "Landslide",  risk: 62, severity: "high",     date: "2026-02-27" },
  
  // Gandaki Province
  { id: 14, name: "Pokhara-17",      district: "Kaski",         province: "Gandaki",   municipality: "Pokhara Metro",      lat: 28.21, lng: 83.99, type: "Landslide",  risk: 79, severity: "high",     date: "2026-02-25" },
  { id: 15, name: "Gorkha Bazar",    district: "Gorkha",        province: "Gandaki",   municipality: "Gorkha",             lat: 28.00, lng: 84.62, type: "Earthquake", risk: 69, severity: "high",     date: "2026-03-02" },
  { id: 16, name: "Besisahar",       district: "Lamjung",       province: "Gandaki",   municipality: "Besisahar",          lat: 28.23, lng: 84.43, type: "Landslide",  risk: 56, severity: "moderate", date: "2026-02-28" },
  { id: 17, name: "Tansen",          district: "Palpa",         province: "Gandaki",   municipality: "Tansen",             lat: 27.86, lng: 83.55, type: "Wildfire",   risk: 48, severity: "moderate", date: "2026-03-03" },
  { id: 18, name: "Jomsom",          district: "Mustang",       province: "Gandaki",   municipality: "Gharapjhong",        lat: 28.78, lng: 83.72, type: "Extreme Weather", risk: 29, severity: "low",      date: "2026-03-05" },
  
  // Lumbini Province
  { id: 19, name: "Butwal",          district: "Rupandehi",     province: "Lumbini",   municipality: "Butwal Sub-Metro",   lat: 27.70, lng: 83.45, type: "Flood",      risk: 64, severity: "high",     date: "2026-02-26" },
  { id: 20, name: "Bhairahawa",      district: "Rupandehi",     province: "Lumbini",   municipality: "Siddharthanagar",    lat: 27.50, lng: 83.45, type: "Flood",      risk: 59, severity: "moderate", date: "2026-02-27" },
  { id: 21, name: "Kapilvastu",      district: "Kapilvastu",    province: "Lumbini",   municipality: "Kapilvastu",         lat: 27.57, lng: 83.05, type: "Flood",      risk: 52, severity: "moderate", date: "2026-02-28" },
  { id: 22, name: "Ramgram",         district: "Nawalparasi",   province: "Lumbini",   municipality: "Ramgram",            lat: 27.63, lng: 83.45, type: "Flood",      risk: 61, severity: "high",     date: "2026-02-26" },
  { id: 23, name: "Tulsipur",        district: "Dang",          province: "Lumbini",   municipality: "Tulsipur Sub-Metro", lat: 28.13, lng: 82.30, type: "Wildfire",   risk: 46, severity: "moderate", date: "2026-03-04" },
  { id: 24, name: "Rolpa Bazar",     district: "Rolpa",         province: "Lumbini",   municipality: "Rolpa",              lat: 28.26, lng: 82.63, type: "Wildfire",   risk: 38, severity: "moderate", date: "2026-03-06" },
  
  // Karnali Province
  { id: 25, name: "Birendranagar",   district: "Surkhet",       province: "Karnali",   municipality: "Birendranagar",      lat: 28.60, lng: 81.63, type: "Wildfire",   risk: 51, severity: "moderate", date: "2026-03-02" },
  { id: 26, name: "Jumla Khalanga",  district: "Jumla",         province: "Karnali",   municipality: "Chandannath",        lat: 29.27, lng: 82.18, type: "Earthquake", risk: 44, severity: "moderate", date: "2026-03-08" },
  { id: 27, name: "Simikot",         district: "Humla",         province: "Karnali",   municipality: "Namkha",             lat: 29.97, lng: 81.82, type: "Earthquake", risk: 32, severity: "low",      date: "2026-03-10" },
  { id: 28, name: "Dunai",           district: "Dolpa",         province: "Karnali",   municipality: "Thuli Bheri",        lat: 28.97, lng: 82.90, type: "Extreme Weather", risk: 27, severity: "low",      date: "2026-03-12" },
  
  // Sudurpashchim Province
  { id: 29, name: "Dhangadhi",       district: "Kailali",       province: "Sudurpashchim", municipality: "Dhangadhi Sub-Metro", lat: 28.70, lng: 80.59, type: "Flood",      risk: 56, severity: "moderate", date: "2026-02-28" },
  { id: 30, name: "Mahendranagar",   district: "Kanchanpur",    province: "Sudurpashchim", municipality: "Mahendranagar",       lat: 28.97, lng: 80.18, type: "Flood",      risk: 49, severity: "moderate", date: "2026-03-01" },
  { id: 31, name: "Dipayal",         district: "Doti",          province: "Sudurpashchim", municipality: "Dipayal Silgadhi",    lat: 29.27, lng: 80.94, type: "Landslide",  risk: 41, severity: "moderate", date: "2026-03-03" },
  { id: 32, name: "Chainpur",        district: "Bajhang",       province: "Sudurpashchim", municipality: "Chainpur",            lat: 29.55, lng: 81.21, type: "Earthquake", risk: 74, severity: "high",     date: "2026-03-05" },
  { id: 33, name: "Silgarhi Doti",   district: "Doti",          province: "Sudurpashchim", municipality: "K.I. Singh",          lat: 29.32, lng: 80.98, type: "Landslide",  risk: 36, severity: "low",      date: "2026-03-07" },
  
  // Madhesh Province
  { id: 34, name: "Janakpur",        district: "Dhanusha",      province: "Madhesh",   municipality: "Janakpur Sub-Metro", lat: 26.73, lng: 85.92, type: "Flood",      risk: 70, severity: "high",     date: "2026-02-25" },
  { id: 35, name: "Birgunj",         district: "Parsa",         province: "Madhesh",   municipality: "Birgunj Metro",      lat: 27.01, lng: 84.88, type: "Flood",      risk: 75, severity: "high",     date: "2026-02-24" },
  { id: 36, name: "Lahan",           district: "Siraha",        province: "Madhesh",   municipality: "Lahan",              lat: 26.72, lng: 86.48, type: "Flood",      risk: 66, severity: "high",     date: "2026-02-26" },
  { id: 37, name: "Malangwa",        district: "Sarlahi",       province: "Madhesh",   municipality: "Malangwa",           lat: 26.86, lng: 85.56, type: "Flood",      risk: 53, severity: "moderate", date: "2026-02-27" },
  { id: 38, name: "Gaur",            district: "Rautahat",      province: "Madhesh",   municipality: "Gaur",               lat: 26.77, lng: 85.28, type: "Flood",      risk: 58, severity: "moderate", date: "2026-02-28" },
  { id: 39, name: "Rajbiraj",        district: "Saptari",       province: "Madhesh",   municipality: "Rajbiraj",           lat: 26.54, lng: 86.74, type: "Flood",      risk: 63, severity: "high",     date: "2026-02-27" },
  { id: 40, name: "Bardibas",        district: "Mahottari",     province: "Madhesh",   municipality: "Bardibas",           lat: 26.99, lng: 85.90, type: "Flood",      risk: 47, severity: "moderate", date: "2026-03-01" },
  
  // Additional high-risk areas
  { id: 41, name: "Chitwan Bharatpur", district: "Chitwan",     province: "Bagmati",   municipality: "Bharatpur Metro",    lat: 27.68, lng: 84.43, type: "Flood",      risk: 80, severity: "critical", date: "2026-02-23" },
  { id: 42, name: "Narayanghat",     district: "Chitwan",       province: "Bagmati",   municipality: "Bharatpur Metro",    lat: 27.70, lng: 84.42, type: "Flood",      risk: 76, severity: "high",     date: "2026-02-24" },
  { id: 43, name: "Damak",           district: "Jhapa",         province: "Koshi",     municipality: "Damak",              lat: 26.66, lng: 87.70, type: "Flood",      risk: 55, severity: "moderate", date: "2026-02-29" },
  { id: 44, name: "Mechinagar",      district: "Jhapa",         province: "Koshi",     municipality: "Mechinagar",         lat: 26.65, lng: 87.92, type: "Flood",      risk: 50, severity: "moderate", date: "2026-03-01" },
  { id: 45, name: "Triyuga Gaighat", district: "Udayapur",      province: "Koshi",     municipality: "Triyuga",            lat: 26.73, lng: 86.89, type: "Landslide",  risk: 45, severity: "moderate", date: "2026-03-02" },
];
