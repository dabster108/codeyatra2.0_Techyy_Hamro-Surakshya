"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Droplets,
  Mountain,
  Flame,
  Wind,
  Waves,
  Clock,
  MapPin,
  RefreshCw,
  Bell,
  BellOff,
  ArrowUpRight,
  Users,
  CheckCircle2,
  X,
  Info,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const ALERTS = [
  {
    id: 1, type: "Flood", icon: Droplets, severity: "critical",
    title: "Severe Flooding – Koshi River Basin",
    province: "Koshi", district: "Sunsari", municipality: "Inaruwa",
    description: "Water level at Chatara barrage has exceeded the danger mark by 2.4 m. Immediate evacuation of riverbank settlements within 1 km radius ordered.",
    affectedPeople: 12400, date: "2026-02-22", time: "12 min ago", status: "active",
    actions: ["Evacuate Zone A", "Shelters Open"],
  },
  {
    id: 2, type: "Landslide", icon: Mountain, severity: "high",
    title: "Landslide Risk – Seti Corridor",
    province: "Gandaki", district: "Kaski", municipality: "Pokhara",
    description: "Heavy rainfall (180mm in 6 hrs) has destabilised slopes along BP Highway KM 34–58. Road blocked.",
    affectedPeople: 3800, date: "2026-02-22", time: "38 min ago", status: "active",
    actions: ["Road Closed", "Rescue Deployed"],
  },
  {
    id: 3, type: "Earthquake", icon: Waves, severity: "high",
    title: "Magnitude 5.2 Earthquake",
    province: "Sudurpashchim", district: "Bajhang", municipality: "Chainpur",
    description: "5.2M earthquake at 14 km depth. Structural assessments ongoing. Aftershock risk elevated for 48 hrs.",
    affectedPeople: 6100, date: "2026-02-22", time: "1 hr ago", status: "monitoring",
    actions: ["Assessment Ongoing"],
  },
  {
    id: 4, type: "Wildfire", icon: Flame, severity: "high",
    title: "Forest Fire – Chure Range",
    province: "Bagmati", district: "Makwanpur", municipality: "Hetauda",
    description: "Active wildfire spanning ~340 hectares. Wind speed 45 km/h. Fire brigade and Army deployed.",
    affectedPeople: 1200, date: "2026-02-21", time: "2 hr ago", status: "active",
    actions: ["Firefighting Active"],
  },
  {
    id: 5, type: "Flood", icon: Droplets, severity: "moderate",
    title: "Flash Flood Warning – Rapti Basin",
    province: "Bagmati", district: "Chitwan", municipality: "Bharatpur",
    description: "Upstream rainfall forecast to cause flash flooding along Rapti river within 4–6 hours. Precautionary evacuation advised.",
    affectedPeople: 5500, date: "2026-02-21", time: "2 hr ago", status: "warning",
    actions: ["Pre-Evacuation"],
  },
  {
    id: 6, type: "Extreme Weather", icon: Wind, severity: "moderate",
    title: "Thunderstorm & Hail Alert",
    province: "Bagmati", district: "Kathmandu", municipality: "Kathmandu Metro",
    description: "Heavy thunderstorm with hail from 15:00–20:00. Winds up to 70 km/h expected. Avoid outdoor activities.",
    affectedPeople: 89000, date: "2026-02-22", time: "3 hr ago", status: "warning",
    actions: ["Public Advisory"],
  },
  {
    id: 7, type: "Landslide", icon: Mountain, severity: "low",
    title: "Minor Landslide – Prithvi Highway",
    province: "Bagmati", district: "Dhading", municipality: "Nilkantha",
    description: "Small debris flow blocking one lane of Prithvi Highway near KM 78. Clearance underway. Expect 2–3 hr delay.",
    affectedPeople: 0, date: "2026-02-21", time: "5 hr ago", status: "resolved",
    actions: ["Clearance Underway"],
  },
  {
    id: 8, type: "Flood", icon: Droplets, severity: "low",
    title: "River Watch – Bagmati",
    province: "Madhesh", district: "Sarlahi", municipality: "Lalbandi",
    description: "Bagmati river rising steadily. Currently 0.8 m below danger mark. Monitoring teams standby.",
    affectedPeople: 0, date: "2026-02-20", time: "6 hr ago", status: "monitoring",
    actions: ["Monitoring Active"],
  },
  {
    id: 9, type: "Wildfire", icon: Flame, severity: "moderate",
    title: "Wildfire Spread – Palpa Hills",
    province: "Lumbini", district: "Palpa", municipality: "Tansen",
    description: "Fire spreading across dry forest patches in Palpa. Wind conditions unfavorable.",
    affectedPeople: 800, date: "2026-02-20", time: "8 hr ago", status: "active",
    actions: ["Fire Brigade Dispatched"],
  },
  {
    id: 10, type: "Earthquake", icon: Waves, severity: "moderate",
    title: "Magnitude 4.1 Tremor",
    province: "Koshi", district: "Taplejung", municipality: "Phungling",
    description: "4.1M earthquake felt across Taplejung and Panchthar. No major damage reported.",
    affectedPeople: 500, date: "2026-02-20", time: "10 hr ago", status: "monitoring",
    actions: ["Field Assessment"],
  },
];

const TYPE_FILTERS = ["All", "Flood", "Landslide", "Earthquake", "Wildfire", "Extreme Weather"];

const PROVINCES = ["All Provinces", "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];

const DISTRICTS_BY_PROVINCE = {
  Koshi: ["All Districts", "Sunsari", "Taplejung", "Dhankuta", "Morang", "Solukhumbu"],
  Madhesh: ["All Districts", "Sarlahi", "Bara", "Parsa", "Rautahat", "Mahottari"],
  Bagmati: ["All Districts", "Kathmandu", "Chitwan", "Makwanpur", "Dhading", "Bhaktapur"],
  Gandaki: ["All Districts", "Kaski", "Syangja", "Lamjung", "Gorkha", "Tanahun"],
  Lumbini: ["All Districts", "Palpa", "Rupandehi", "Kapilbastu", "Arghakhanchi"],
  Karnali: ["All Districts", "Surkhet", "Dailekh", "Jajarkot", "Dolpa"],
  Sudurpashchim: ["All Districts", "Bajhang", "Doti", "Kailali", "Dadeldhura"],
};

const MUNICIPALITIES_BY_DISTRICT = {
  Sunsari: ["All Municipalities", "Inaruwa", "Itahari", "Dharan", "Biratnagar"],
  Kaski: ["All Municipalities", "Pokhara", "Lekhnath"],
  Bajhang: ["All Municipalities", "Chainpur", "Jaya Prithvi"],
  Makwanpur: ["All Municipalities", "Hetauda", "Thaha"],
  Chitwan: ["All Municipalities", "Bharatpur", "Ratnanagar"],
  Kathmandu: ["All Municipalities", "Kathmandu Metro", "Kirtipur"],
  Dhading: ["All Municipalities", "Nilkantha", "Dhunibesi"],
  Sarlahi: ["All Municipalities", "Lalbandi", "Haripur"],
  Palpa: ["All Municipalities", "Tansen", "Rampur"],
  Taplejung: ["All Municipalities", "Phungling"],
};

const SEV = {
  critical: { label: "Critical", dot: "bg-red-500",    badge: "bg-red-50 text-red-600 border-red-200",       top: "bg-red-500",    text: "text-red-600"    },
  high:     { label: "High",     dot: "bg-orange-500", badge: "bg-orange-50 text-orange-600 border-orange-200", top: "bg-orange-500", text: "text-orange-600" },
  moderate: { label: "Moderate", dot: "bg-yellow-500", badge: "bg-yellow-50 text-yellow-600 border-yellow-200", top: "bg-yellow-400", text: "text-yellow-600" },
  low:      { label: "Low",      dot: "bg-green-500",  badge: "bg-green-50 text-green-600 border-green-200",   top: "bg-green-500",  text: "text-green-600"  },
};

const STATUS = {
  active:     "bg-red-100 text-red-700",
  warning:    "bg-yellow-100 text-yellow-700",
  monitoring: "bg-blue-100 text-blue-700",
  resolved:   "bg-green-100 text-green-700",
};

// ── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard({ alert, onClick }) {
  const sev = SEV[alert.severity];
  const Icon = alert.icon;
  const isActive = alert.status === "active";

  return (
    <button
      onClick={() => onClick(alert)}
      className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white text-left transition-all hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
    >
      <div className={`h-1 w-full ${sev.top}`} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Icon + status */}
        <div className="flex items-start justify-between gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 ${sev.text}`}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isActive && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${STATUS[alert.status]}`}>
              {alert.status}
            </span>
          </div>
        </div>

        {/* Type + title */}
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-widest ${sev.text} mb-1`}>{alert.type}</div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-green-700 line-clamp-2">
            {alert.title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{alert.municipality}, {alert.district}</span>
        </div>

        {/* Severity + time */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sev.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
            {sev.label}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock className="h-3 w-3" />{alert.time}
          </span>
        </div>

        {alert.affectedPeople > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Users className="h-3 w-3 shrink-0" />
            <span>{alert.affectedPeople.toLocaleString()} affected</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function AlertModal({ alert, onClose }) {
  const sev = SEV[alert.severity];
  const Icon = alert.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Severity top bar */}
        <div className={`h-1.5 w-full ${sev.top}`} />

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 ${sev.text}`}>
              <Icon className="h-6 w-6" />
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${sev.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
              {sev.label}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS[alert.status]}`}>
              {alert.status}
            </span>
          </div>

          <h2 className="mt-3 text-lg font-bold text-gray-900 leading-snug">{alert.title}</h2>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {alert.municipality} · {alert.district} · {alert.province}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-4 space-y-4 border-t border-gray-50 pt-4">
          <p className="text-sm leading-relaxed text-gray-600">{alert.description}</p>

          {alert.affectedPeople > 0 && (
            <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
              <Users className="h-5 w-5 text-orange-500 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-orange-800">
                  {alert.affectedPeople.toLocaleString()} people affected
                </div>
                <div className="text-xs text-orange-500">Estimated impact zone population</div>
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Response Actions
            </div>
            {alert.actions.map((a) => (
              <div key={a} className="flex items-center gap-2 py-1 text-sm text-gray-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                {a}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400 border-t border-gray-50 pt-3">
            <Clock className="h-3 w-3" /> Last updated {alert.time} · Auto-refreshes every 60s
          </div>
        </div>

        {/* CTAs */}
        <div className="border-t border-gray-100 p-4 flex gap-2">
          <Link
            href="/evacuate"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <MapPin className="h-4 w-4" /> Find Shelter
          </Link>
          <Link
            href="/sos"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            Emergency SOS <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300 cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [typeFilter, setTypeFilter]     = useState("All");
  const [province, setProvince]         = useState("All Provinces");
  const [district, setDistrict]         = useState("All Districts");
  const [municipality, setMunicipality] = useState("All Municipalities");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [modal, setModal]               = useState(null);
  const [subscribed, setSubscribed]     = useState(false);

  const handleProvince = (v) => { setProvince(v); setDistrict("All Districts"); setMunicipality("All Municipalities"); };
  const handleDistrict = (v) => { setDistrict(v); setMunicipality("All Municipalities"); };

  const districtOptions = province !== "All Provinces" && DISTRICTS_BY_PROVINCE[province]
    ? DISTRICTS_BY_PROVINCE[province] : ["All Districts"];

  const municipalityOptions = district !== "All Districts" && MUNICIPALITIES_BY_DISTRICT[district]
    ? MUNICIPALITIES_BY_DISTRICT[district] : ["All Municipalities"];

  const filtered = useMemo(() => ALERTS.filter((a) => {
    if (typeFilter !== "All" && a.type !== typeFilter) return false;
    if (province !== "All Provinces" && a.province !== province) return false;
    if (district !== "All Districts" && a.district !== district) return false;
    if (municipality !== "All Municipalities" && a.municipality !== municipality) return false;
    if (dateFrom && a.date < dateFrom) return false;
    if (dateTo && a.date > dateTo) return false;
    return true;
  }), [typeFilter, province, district, municipality, dateFrom, dateTo]);

  const hasActiveFilters = typeFilter !== "All" || province !== "All Provinces" || district !== "All Districts"
    || municipality !== "All Municipalities" || dateFrom || dateTo;

  const clearAll = () => {
    setTypeFilter("All"); setProvince("All Provinces"); setDistrict("All Districts");
    setMunicipality("All Municipalities"); setDateFrom(""); setDateTo("");
  };

  const counts = {
    critical: ALERTS.filter((a) => a.severity === "critical").length,
    high: ALERTS.filter((a) => a.severity === "high").length,
    active: ALERTS.filter((a) => a.status === "active").length,
    total: ALERTS.length,
  };

  const tickerAlerts = ALERTS.filter((a) => a.status === "active" || a.severity === "critical");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Ticker */}
      <div className="bg-red-600 overflow-hidden py-2 flex items-stretch">
        <div className="shrink-0 bg-red-800 px-4 flex items-center text-xs font-black tracking-widest text-white uppercase">
          LIVE
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex whitespace-nowrap" style={{ animation: "ticker 28s linear infinite" }}>
            {[...tickerAlerts, ...tickerAlerts, ...tickerAlerts].map((a, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-8 text-sm text-white shrink-0">
                <span className="font-black uppercase tracking-wider opacity-70 text-xs">{a.type}</span>
                <span>{a.title}</span>
                <span className="opacity-50">·</span>
                <span className="opacity-70">{a.district}</span>
                <span className="opacity-20 mx-2">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Title + subscribe */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Disaster Alerts</h1>
              <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live
              </span>
              <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-500">
                <RefreshCw className="h-3.5 w-3.5" /> Updated just now
              </div>
            </div>
            <button
              onClick={() => setSubscribed(!subscribed)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                subscribed ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {subscribed ? <><BellOff className="h-4 w-4" /> Subscribed</> : <><Bell className="h-4 w-4" /> Subscribe to Alerts</>}
            </button>
          </div>

          {/* Stats — big & centered */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Alerts",  val: counts.total,    color: "text-gray-900",   bg: "bg-gray-50",    border: "border-gray-200" },
              { label: "Critical",      val: counts.critical, color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200" },
              { label: "High Risk",     val: counts.high,     color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-200" },
              { label: "Active Now",    val: counts.active,   color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200" },
            ].map(({ label, val, color, bg, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} py-5 text-center`}>
                <div className={`text-5xl font-black ${color}`}>{val}</div>
                <div className="mt-1.5 text-sm font-semibold text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters — centered */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

          {/* Type pills — centered */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  typeFilter === f
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Location + date — all centered in one row */}
          <div className="flex flex-wrap items-end justify-center gap-3">
            <div className="flex flex-col gap-1 w-40">
              <label className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Province</label>
              <Select value={province} onChange={handleProvince} options={PROVINCES} />
            </div>
            <div className="flex flex-col gap-1 w-36">
              <label className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">District</label>
              <Select value={district} onChange={handleDistrict} options={districtOptions} />
            </div>
            <div className="flex flex-col gap-1 w-44">
              <label className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Municipality</label>
              <Select value={municipality} onChange={setMunicipality} options={municipalityOptions} />
            </div>
            <div className="flex flex-col gap-1 w-36">
              <label className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
            </div>
            <div className="flex flex-col gap-1 w-36">
              <label className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of {counts.total} alerts
            {hasActiveFilters && <span className="text-green-600 font-medium"> · filtered</span>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <CheckCircle2 className="h-14 w-14 text-green-200 mb-4" />
            <p className="text-base font-semibold">No alerts match your filters</p>
            <button onClick={clearAll} className="mt-2 text-sm text-green-600 hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onClick={setModal} />
            ))}
          </div>
        )}

        <div className="mt-8 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          Alerts sourced from NDRRMA, DHM & local municipalities. Refreshes every 60s. For emergencies call{" "}
          <strong className="ml-1">1155</strong>.
        </div>
      </div>

      {/* Modal */}
      {modal && <AlertModal alert={modal} onClose={() => setModal(null)} />}

      <style jsx>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
