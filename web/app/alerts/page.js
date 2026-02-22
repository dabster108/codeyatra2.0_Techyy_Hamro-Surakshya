"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertTriangle,
  CloudRain,
  Mountain,
  Activity,
  Flame,
  Wind,
  MapPin,
  Users,
  X,
  ChevronDown,
  Clock,
  Radio,
  Shield,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Bell,
  BarChart2,
  Eye,
  Lock,
  Phone,
} from "lucide-react";

/* ────── DATA ────── */
const ALERTS = [
  {
    id: 1,
    type: "Flood",
    icon: CloudRain,
    severity: "critical",
    title: "Severe Flooding — Koshi River Basin",
    province: "Koshi",
    district: "Sunsari",
    municipality: "Itahari Sub-Metro",
    description:
      "Water levels have breached critical threshold. Koshi River at Chatara recording 9.2m (danger: 8.5m). 14 wards inundated. Agricultural land submerged across 4,200 hectares.",
    affectedPeople: 34200,
    date: "2026-02-25",
    time: "06:45",
    status: "active",
    actions: [
      "Evacuate low-lying areas immediately",
      "Move to higher ground",
      "Avoid river crossings",
      "Contact NDRRMA 1155",
    ],
  },
  {
    id: 2,
    type: "Landslide",
    icon: Mountain,
    severity: "critical",
    title: "Massive Landslide — Melamchi Valley",
    province: "Bagmati",
    district: "Sindhupalchok",
    municipality: "Melamchi",
    description:
      "Major debris flow triggered by continuous rainfall. Melamchi Bazar road severed at 3 points. Helambu trail blocked. 42 houses buried, rescue teams deployed.",
    affectedPeople: 8900,
    date: "2026-02-25",
    time: "03:20",
    status: "active",
    actions: [
      "Stay away from steep slopes",
      "Do not attempt road travel",
      "Report missing persons to 100",
      "Helicopter rescue requested",
    ],
  },
  {
    id: 3,
    type: "Earthquake",
    icon: Activity,
    severity: "high",
    title: "Seismic Activity — Gorkha Epicenter",
    province: "Gandaki",
    district: "Gorkha",
    municipality: "Gorkha",
    description:
      "4.8ML earthquake detected at 12km depth. Epicenter 15km NW of Gorkha Bazar. Aftershock sequence ongoing (12 events >2.5ML in 6hrs). DMG assessing structural damage.",
    affectedPeople: 15400,
    date: "2026-02-24",
    time: "14:32",
    status: "warning",
    actions: [
      "Move to open spaces",
      "Check structural integrity",
      "Prepare emergency kit",
      "Stay away from damaged buildings",
    ],
  },
  {
    id: 4,
    type: "Flood",
    icon: CloudRain,
    severity: "high",
    title: "Flash Flood Warning — Rapti River",
    province: "Lumbini",
    district: "Rupandehi",
    municipality: "Butwal Sub-Metro",
    description:
      "Rapti River rising rapidly due to upstream rainfall in Dang. Expected to breach embankment within 12 hours. Pre-positioning relief supplies at 5 distribution points.",
    affectedPeople: 19600,
    date: "2026-02-26",
    time: "10:15",
    status: "warning",
    actions: [
      "Prepare for possible evacuation",
      "Secure important documents",
      "Stock food and water",
      "Monitor local radio",
    ],
  },
  {
    id: 5,
    type: "Wildfire",
    icon: Flame,
    severity: "high",
    title: "Forest Fire — Chitwan National Park",
    province: "Bagmati",
    district: "Chitwan",
    municipality: "Bharatpur Metro",
    description:
      "Uncontrolled wildfire spreading across 850 hectares of buffer zone. Wind speed 25km/h from SE. 3 community forests threatened. Army battalion deployed for containment.",
    affectedPeople: 5200,
    date: "2026-02-28",
    time: "16:00",
    status: "active",
    actions: [
      "Evacuate buffer zone settlements",
      "Close park entry points",
      "Report fire sightings to 101",
      "Avoid smoke-affected areas",
    ],
  },
  {
    id: 6,
    type: "Flood",
    icon: CloudRain,
    severity: "moderate",
    title: "Rising Water Levels — Bagmati Corridor",
    province: "Madhesh",
    district: "Sarlahi",
    municipality: "Malangwa",
    description:
      "Bagmati River at Karmaiya gauge: 6.1m (warning: 5.8m, danger: 7.2m). Trend upward. Southern Sarlahi low-lands being monitored. Pre-alert issued to 8 municipalities.",
    affectedPeople: 12000,
    date: "2026-02-27",
    time: "09:30",
    status: "monitoring",
    actions: [
      "Prepare emergency supplies",
      "Know your evacuation route",
      "Keep phone charged",
      "Monitor this feed",
    ],
  },
  {
    id: 7,
    type: "Extreme Weather",
    icon: Wind,
    severity: "moderate",
    title: "Heavy Snowfall — High Himalayas",
    province: "Karnali",
    district: "Jumla",
    municipality: "Chandannath",
    description:
      "72-hour snowfall accumulation exceeding 120cm in Jumla, Humla, Dolpa. Air transport suspended. Road access cut to 4 districts. Food supplies running low in remote VDCs.",
    affectedPeople: 8900,
    date: "2026-03-01",
    time: "08:00",
    status: "active",
    actions: [
      "Stock essential supplies",
      "Avoid mountain travel",
      "Check on elderly neighbors",
      "Keep alternate heating ready",
    ],
  },
  {
    id: 8,
    type: "Landslide",
    icon: Mountain,
    severity: "moderate",
    title: "Slope Instability — Pokhara Metro Ward 17",
    province: "Gandaki",
    district: "Kaski",
    municipality: "Pokhara Metro",
    description:
      "Ground cracks observed in Seti River gorge area. 24 houses in red zone. Geologists measuring 4cm lateral displacement. Ward office issued voluntary evacuation advisory.",
    affectedPeople: 3200,
    date: "2026-02-25",
    time: "11:45",
    status: "monitoring",
    actions: [
      "Evacuate if in red zone",
      "Watch for ground cracks",
      "Report changes to ward office",
      "Prepare emergency bag",
    ],
  },
  {
    id: 9,
    type: "Flood",
    icon: CloudRain,
    severity: "low",
    title: "Seasonal Monitoring — Mahakali Basin",
    province: "Sudurpashchim",
    district: "Kanchanpur",
    municipality: "Mahendranagar",
    description:
      "Pre-monsoon monitoring active. Rivers at normal levels. Early warning systems tested and functional. Community preparedness drills completed in 12 municipalities.",
    affectedPeople: 0,
    date: "2026-03-01",
    time: "07:00",
    status: "monitoring",
    actions: [
      "No immediate action required",
      "Review family emergency plan",
      "Check emergency kit supplies",
      "Know your ward contact",
    ],
  },
  {
    id: 10,
    type: "Earthquake",
    icon: Activity,
    severity: "low",
    title: "Micro-seismic Activity — Far Western Region",
    province: "Sudurpashchim",
    district: "Bajhang",
    municipality: "Chainpur",
    description:
      "Cluster of micro-earthquakes (1.8-2.6ML) detected over past 72 hours. National Seismological Centre monitoring. No structural risk at current magnitude. Public advised to stay informed.",
    affectedPeople: 0,
    date: "2026-03-05",
    time: "12:00",
    status: "resolved",
    actions: [
      "Stay informed via official channels",
      "No action needed currently",
      "Review earthquake preparedness",
      "Know emergency numbers",
    ],
  },
];

const DISASTER_CATEGORIES = [
  {
    type: "Flood",
    icon: CloudRain,
    location: "Sunsari",
    region: "Koshi River Basin",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  {
    type: "Landslide",
    icon: Mountain,
    location: "Sindhupalchok",
    region: "Melamchi Valley",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  {
    type: "Earthquake",
    icon: Activity,
    location: "Gorkha",
    region: "Gorkha Epicenter",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  {
    type: "Wildfire",
    icon: Flame,
    location: "Chitwan",
    region: "Chitwan National Park",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  {
    type: "Extreme Weather",
    icon: Wind,
    location: "Jumla",
    region: "High Himalayas",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
];

const NAV_TABS = [
  { label: "ALERTS", href: "/alerts", icon: Bell },
  { label: "PREDICTIONS", href: "/predictions", icon: BarChart2 },
  { label: "TRANSPARENCY", href: "/transparency", icon: Eye },
  { label: "ASSISTANT", href: "/chatbot", icon: Zap },
  { label: "SOS", href: "/sos", icon: Phone },
  { label: "ACCESS", href: "/login", icon: Lock },
];

const TYPE_FILTERS = [
  "All",
  "Flood",
  "Landslide",
  "Earthquake",
  "Wildfire",
  "Extreme Weather",
];
const PROVINCES = [
  "All",
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];
const DISTRICTS_BY_PROVINCE = {
  Koshi: [
    "Sunsari",
    "Morang",
    "Jhapa",
    "Taplejung",
    "Panchthar",
    "Udayapur",
    "Sindhupalchok",
  ],
  Madhesh: [
    "Dhanusha",
    "Parsa",
    "Siraha",
    "Sarlahi",
    "Saptari",
    "Rautahat",
    "Mahottari",
  ],
  Bagmati: [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Sindhupalchok",
    "Chitwan",
    "Makwanpur",
    "Nuwakot",
  ],
  Gandaki: ["Kaski", "Gorkha", "Lamjung", "Palpa", "Mustang"],
  Lumbini: ["Rupandehi", "Kapilvastu", "Dang", "Nawalparasi", "Rolpa"],
  Karnali: ["Surkhet", "Jumla", "Humla", "Dolpa"],
  Sudurpashchim: ["Kailali", "Kanchanpur", "Doti", "Bajhang"],
};
const MUNICIPALITIES_BY_DISTRICT = {
  Sunsari: ["Itahari Sub-Metro", "Dharan Sub-Metro", "Inaruwa"],
  Morang: ["Biratnagar Metro", "Urlabari"],
  Sindhupalchok: ["Melamchi", "Chautara Sangachok"],
  Chitwan: ["Bharatpur Metro"],
  Makwanpur: ["Hetauda Sub-Metro"],
  Kathmandu: ["Kathmandu Metro"],
  Kaski: ["Pokhara Metro"],
  Gorkha: ["Gorkha"],
  Rupandehi: ["Butwal Sub-Metro", "Siddharthanagar"],
  Sarlahi: ["Malangwa"],
  Jumla: ["Chandannath"],
  Kanchanpur: ["Mahendranagar"],
  Bajhang: ["Chainpur"],
  Kailali: ["Dhangadhi Sub-Metro"],
  Dhanusha: ["Janakpur Sub-Metro"],
  Parsa: ["Birgunj Metro"],
};

const SEV = {
  critical: {
    bar: "bg-red-500",
    badge: "bg-red-50 border-red-200 text-red-700",
    dot: "bg-red-500",
    text: "text-red-600",
    label: "CRITICAL",
  },
  high: {
    bar: "bg-amber-500",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
    text: "text-amber-600",
    label: "HIGH",
  },
  moderate: {
    bar: "bg-blue-400",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-400",
    text: "text-blue-600",
    label: "MODERATE",
  },
  low: {
    bar: "bg-gray-400",
    badge: "bg-gray-50 border-gray-200 text-gray-600",
    dot: "bg-gray-400",
    text: "text-gray-500",
    label: "LOW",
  },
};

const STATUS_STYLE = {
  active: {
    dot: "bg-red-500 animate-pulse",
    text: "text-red-600",
    badge: "bg-red-50 border-red-200 text-red-700",
    label: "ACTIVE",
  },
  warning: {
    dot: "bg-amber-500 animate-pulse",
    text: "text-amber-600",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    label: "WARNING",
  },
  monitoring: {
    dot: "bg-blue-400",
    text: "text-blue-600",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    label: "MONITORING",
  },
  resolved: {
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    badge: "bg-emerald-50 border-emerald-200 text-emerald-700",
    label: "RESOLVED",
  },
};

/* ────── SUB-COMPONENTS ────── */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-xs text-gray-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function AlertCard({ alert, onClick }) {
  const sev = SEV[alert.severity];
  const st = STATUS_STYLE[alert.status];
  const bgClass = sev.badge.split(" ")[0];
  const borderClass = sev.badge.split(" ")[1];
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className={`h-1 w-full ${sev.bar}`} />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${bgClass} border ${borderClass}`}
            >
              <alert.icon className={`h-3.5 w-3.5 ${sev.text}`} />
            </div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest ${sev.badge}`}
            >
              {sev.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            <span className={`text-[9px] font-mono font-bold ${st.text}`}>
              {st.label}
            </span>
          </div>
        </div>
        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
          {alert.title}
        </h3>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {alert.district}, {alert.province}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {alert.date} · {alert.time}
          </span>
          {alert.affectedPeople > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {alert.affectedPeople.toLocaleString()} affected
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View details <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
}

function AlertModal({ alert, onClose }) {
  const sev = alert ? SEV[alert.severity] : null;
  const st = alert ? STATUS_STYLE[alert.status] : null;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (alert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [alert]);

  if (!alert) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[75vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl animate-fade-in-up scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1 w-full rounded-t-2xl ${sev.bar}`} />
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest ${sev.badge}`}
              >
                {sev.label}
              </span>
              <span
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold ${st.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
            <h2 className="text-lg font-black text-gray-900">{alert.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "PROVINCE", value: alert.province },
              { label: "DISTRICT", value: alert.district },
              { label: "MUNICIPALITY", value: alert.municipality },
              { label: "TIMESTAMP", value: `${alert.date} ${alert.time}` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <span className="text-[9px] font-mono font-semibold tracking-widest text-slate-400">
                  {item.label}
                </span>
                <p className="mt-1 text-xs font-bold text-gray-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 mb-2">
              SITUATION REPORT
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {alert.description}
            </p>
          </div>
          {alert.affectedPeople > 0 && (
            <div className="flex items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-amber-100 border border-amber-200">
                <Users className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold tracking-widest text-amber-600">
                  AFFECTED POPULATION
                </p>
                <p className="text-2xl font-black text-gray-900">
                  {alert.affectedPeople.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 mb-3">
              REQUIRED ACTIONS
            </h3>
            <div className="space-y-2">
              {alert.actions.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                >
                  <span
                    className={`mt-1 h-2 w-2 flex-none rounded-full ${sev.dot}`}
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    {a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────── MAIN PAGE ────── */
export default function AlertsPage() {
  const [type, setType] = useState("All");
  const [province, setProvince] = useState("All");
  const [district, setDistrict] = useState("All");
  const [municipality, setMunicipality] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const districts =
    province !== "All" && DISTRICTS_BY_PROVINCE[province]
      ? ["All", ...DISTRICTS_BY_PROVINCE[province]]
      : ["All"];
  const municipalities =
    district !== "All" && MUNICIPALITIES_BY_DISTRICT[district]
      ? ["All", ...MUNICIPALITIES_BY_DISTRICT[district]]
      : ["All"];

  const filtered = useMemo(() => {
    return ALERTS.filter((a) => {
      if (type !== "All" && a.type !== type) return false;
      if (province !== "All" && a.province !== province) return false;
      if (district !== "All" && a.district !== district) return false;
      if (municipality !== "All" && a.municipality !== municipality)
        return false;
      if (from && a.date < from) return false;
      if (to && a.date > to) return false;
      if (
        search &&
        !a.title.toLowerCase().includes(search.toLowerCase()) &&
        !a.district.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [type, province, district, municipality, from, to, search]);

  const counts = {
    critical: filtered.filter((a) => a.severity === "critical").length,
    high: filtered.filter((a) => a.severity === "high").length,
    moderate: filtered.filter((a) => a.severity === "moderate").length,
    active: filtered.filter((a) => a.status === "active").length,
  };

  const clearFilters = () => {
    setType("All");
    setProvince("All");
    setDistrict("All");
    setMunicipality("All");
    setFrom("");
    setTo("");
    setSearch("");
  };
  const hasFilters =
    type !== "All" ||
    province !== "All" ||
    district !== "All" ||
    municipality !== "All" ||
    from ||
    to ||
    search;

  return (
    <div
      className={`min-h-screen bg-white transition-opacity duration-700 ease-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ── DISASTER CATEGORIES ── */}
        <div
          className={`transition-all duration-700 ease-out delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-center text-xl font-black tracking-[0.2em] text-gray-900 mb-5">
            ACTIVE DISASTER CATEGORIES
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {DISASTER_CATEGORIES.map((cat) => (
              <button
                key={cat.type}
                onClick={() => setType(type === cat.type ? "All" : cat.type)}
                className={`group flex-none flex flex-col items-center text-center gap-2.5 rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md w-[180px] ${
                  type === cat.type
                    ? `${cat.bg} ${cat.border} shadow-md -translate-y-0.5`
                    : "bg-white border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div
                  className={`inline-flex rounded-xl border p-2.5 ${cat.bg} ${cat.border}`}
                >
                  <cat.icon className={`h-5 w-5 ${cat.color}`} />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold transition-colors ${type === cat.type ? cat.color : "text-gray-900 group-hover:text-emerald-700"}`}
                  >
                    {cat.type.toUpperCase()}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {cat.location}
                  </p>
                  <p className="text-[10px] text-slate-400">{cat.region}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
                  <span
                    className={`text-[9px] font-mono font-bold ${cat.color}`}
                  >
                    MONITORING
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── LIVE FEED STATS ── */}
        <div
          className={`transition-all duration-700 ease-out delay-[300ms] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-red-600" />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-600">
                  LIVE FEED
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                Disaster Alerts
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
              {[
                {
                  label: "CRITICAL",
                  value: counts.critical,
                  color: "text-red-600",
                  bg: "bg-red-50",
                  dot: "bg-red-500",
                },
                {
                  label: "HIGH",
                  value: counts.high,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  dot: "bg-amber-500",
                },
                {
                  label: "MODERATE",
                  value: counts.moderate,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  dot: "bg-blue-400",
                },
                {
                  label: "ACTIVE",
                  value: counts.active,
                  color: "text-red-600",
                  bg: "bg-red-50",
                  dot: "bg-red-500 animate-pulse",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center gap-4 px-6 py-5 ${s.bg}`}
                >
                  <div>
                    <div className={`text-3xl font-black font-mono ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500">
                        {s.label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div
          className={`transition-all duration-700 ease-out delay-[400ms] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-600">
                  FILTERS
                </span>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-mono font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  CLEAR ALL
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Title, district..."
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2 text-xs text-gray-800 shadow-sm placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                  />
                </div>
              </div>
              <Select
                label="Type"
                value={type}
                onChange={(v) => setType(v)}
                options={TYPE_FILTERS}
              />
              <Select
                label="Province"
                value={province}
                onChange={(v) => {
                  setProvince(v);
                  setDistrict("All");
                  setMunicipality("All");
                }}
                options={PROVINCES}
              />
              <Select
                label="District"
                value={district}
                onChange={(v) => {
                  setDistrict(v);
                  setMunicipality("All");
                }}
                options={districts}
              />
              <Select
                label="Municipality"
                value={municipality}
                onChange={setMunicipality}
                options={municipalities}
              />
              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  From
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  To
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── ALERTS LIST ── */}
        <div
          className={`transition-all duration-700 ease-out delay-[500ms] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono font-bold tracking-[0.2em] text-gray-900">
              {filtered.length} ALERT{filtered.length !== 1 ? "S" : ""}
            </h2>
            {hasFilters && (
              <span className="text-[10px] font-mono text-slate-400">
                showing filtered results
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-20 text-center shadow-sm">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-gray-200 shadow-sm">
                <Shield className="h-7 w-7 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">No Alerts Found</p>
              <p className="mt-1 text-xs text-slate-500">
                Adjust your filters or check back later
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors shadow-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((a) => (
                <AlertCard
                  key={a.id}
                  alert={a}
                  onClick={() => setSelected(a)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertModal alert={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
