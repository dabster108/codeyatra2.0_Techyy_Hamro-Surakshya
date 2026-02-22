"use client";

import { useState, useMemo } from "react";
import {
  AlertTriangle, CloudRain, Mountain, Activity, Flame, Wind,
  MapPin, Users, X, ChevronDown, Clock, Radio, Shield,
  Filter, Search,
} from "lucide-react";

/* ────── DATA ────── */
const ALERTS = [
  { id: 1,  type: "Flood",     icon: CloudRain, severity: "critical", title: "Severe Flooding — Koshi River Basin", province: "Koshi", district: "Sunsari", municipality: "Itahari Sub-Metro", description: "Water levels have breached critical threshold. Koshi River at Chatara recording 9.2m (danger: 8.5m). 14 wards inundated. Agricultural land submerged across 4,200 hectares.", affectedPeople: 34200, date: "2026-02-25", time: "06:45", status: "active", actions: ["Evacuate low-lying areas immediately", "Move to higher ground", "Avoid river crossings", "Contact NDRRMA 1155"] },
  { id: 2,  type: "Landslide", icon: Mountain,   severity: "critical", title: "Massive Landslide — Melamchi Valley", province: "Bagmati", district: "Sindhupalchok", municipality: "Melamchi", description: "Major debris flow triggered by continuous rainfall. Melamchi Bazar road severed at 3 points. Helambu trail blocked. 42 houses buried, rescue teams deployed.", affectedPeople: 8900, date: "2026-02-25", time: "03:20", status: "active", actions: ["Stay away from steep slopes", "Do not attempt road travel", "Report missing persons to 100", "Helicopter rescue requested"] },
  { id: 3,  type: "Earthquake", icon: Activity,  severity: "high",     title: "Seismic Activity — Gorkha Epicenter", province: "Gandaki", district: "Gorkha", municipality: "Gorkha", description: "4.8ML earthquake detected at 12km depth. Epicenter 15km NW of Gorkha Bazar. Aftershock sequence ongoing (12 events >2.5ML in 6hrs). DMG assessing structural damage.", affectedPeople: 15400, date: "2026-02-24", time: "14:32", status: "warning", actions: ["Move to open spaces", "Check structural integrity", "Prepare emergency kit", "Stay away from damaged buildings"] },
  { id: 4,  type: "Flood",     icon: CloudRain, severity: "high",     title: "Flash Flood Warning — Rapti River", province: "Lumbini", district: "Rupandehi", municipality: "Butwal Sub-Metro", description: "Rapti River rising rapidly due to upstream rainfall in Dang. Expected to breach embankment within 12 hours. Pre-positioning relief supplies at 5 distribution points.", affectedPeople: 19600, date: "2026-02-26", time: "10:15", status: "warning", actions: ["Prepare for possible evacuation", "Secure important documents", "Stock food and water", "Monitor local radio"] },
  { id: 5,  type: "Wildfire",  icon: Flame,     severity: "high",     title: "Forest Fire — Chitwan National Park", province: "Bagmati", district: "Chitwan", municipality: "Bharatpur Metro", description: "Uncontrolled wildfire spreading across 850 hectares of buffer zone. Wind speed 25km/h from SE. 3 community forests threatened. Army battalion deployed for containment.", affectedPeople: 5200, date: "2026-02-28", time: "16:00", status: "active", actions: ["Evacuate buffer zone settlements", "Close park entry points", "Report fire sightings to 101", "Avoid smoke-affected areas"] },
  { id: 6,  type: "Flood",     icon: CloudRain, severity: "moderate", title: "Rising Water Levels — Bagmati Corridor", province: "Madhesh", district: "Sarlahi", municipality: "Malangwa", description: "Bagmati River at Karmaiya gauge: 6.1m (warning: 5.8m, danger: 7.2m). Trend upward. Southern Sarlahi low-lands being monitored. Pre-alert issued to 8 municipalities.", affectedPeople: 12000, date: "2026-02-27", time: "09:30", status: "monitoring", actions: ["Prepare emergency supplies", "Know your evacuation route", "Keep phone charged", "Monitor this feed"] },
  { id: 7,  type: "Extreme Weather", icon: Wind, severity: "moderate", title: "Heavy Snowfall — High Himalayas", province: "Karnali", district: "Jumla", municipality: "Chandannath", description: "72-hour snowfall accumulation exceeding 120cm in Jumla, Humla, Dolpa. Air transport suspended. Road access cut to 4 districts. Food supplies running low in remote VDCs.", affectedPeople: 8900, date: "2026-03-01", time: "08:00", status: "active", actions: ["Stock essential supplies", "Avoid mountain travel", "Check on elderly neighbors", "Keep alternate heating ready"] },
  { id: 8,  type: "Landslide", icon: Mountain,   severity: "moderate", title: "Slope Instability — Pokhara Metro Ward 17", province: "Gandaki", district: "Kaski", municipality: "Pokhara Metro", description: "Ground cracks observed in Seti River gorge area. 24 houses in red zone. Geologists measuring 4cm lateral displacement. Ward office issued voluntary evacuation advisory.", affectedPeople: 3200, date: "2026-02-25", time: "11:45", status: "monitoring", actions: ["Evacuate if in red zone", "Watch for ground cracks", "Report changes to ward office", "Prepare emergency bag"] },
  { id: 9,  type: "Flood",     icon: CloudRain, severity: "low",      title: "Seasonal Monitoring — Mahakali Basin", province: "Sudurpashchim", district: "Kanchanpur", municipality: "Mahendranagar", description: "Pre-monsoon monitoring active. Rivers at normal levels. Early warning systems tested and functional. Community preparedness drills completed in 12 municipalities.", affectedPeople: 0, date: "2026-03-01", time: "07:00", status: "monitoring", actions: ["No immediate action required", "Review family emergency plan", "Check emergency kit supplies", "Know your ward contact"] },
  { id: 10, type: "Earthquake", icon: Activity,  severity: "low",      title: "Micro-seismic Activity — Far Western Region", province: "Sudurpashchim", district: "Bajhang", municipality: "Chainpur", description: "Cluster of micro-earthquakes (1.8-2.6ML) detected over past 72 hours. National Seismological Centre monitoring. No structural risk at current magnitude. Public advised to stay informed.", affectedPeople: 0, date: "2026-03-05", time: "12:00", status: "resolved", actions: ["Stay informed via official channels", "No action needed currently", "Review earthquake preparedness", "Know emergency numbers"] },
];

const TYPE_FILTERS = ["All", "Flood", "Landslide", "Earthquake", "Wildfire", "Extreme Weather"];
const TYPE_ICONS = { Flood: CloudRain, Landslide: Mountain, Earthquake: Activity, Wildfire: Flame, "Extreme Weather": Wind };

const PROVINCES = ["All", "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const DISTRICTS_BY_PROVINCE = {
  Koshi: ["Sunsari", "Morang", "Jhapa", "Taplejung", "Panchthar", "Udayapur", "Sindhupalchok"],
  Madhesh: ["Dhanusha", "Parsa", "Siraha", "Sarlahi", "Saptari", "Rautahat", "Mahottari"],
  Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur", "Sindhupalchok", "Chitwan", "Makwanpur", "Nuwakot"],
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
  critical: { dot: "bg-red-500", badge: "border-red-500/30 text-red-400 bg-red-500/10", bar: "bg-red-500", text: "text-red-400" },
  high:     { dot: "bg-amber-500", badge: "border-amber-500/30 text-amber-400 bg-amber-500/10", bar: "bg-amber-500", text: "text-amber-400" },
  moderate: { dot: "bg-blue-400", badge: "border-blue-400/30 text-blue-400 bg-blue-400/10", bar: "bg-blue-400", text: "text-blue-400" },
  low:      { dot: "bg-gray-400", badge: "border-gray-400/30 text-gray-400 bg-gray-400/10", bar: "bg-gray-400", text: "text-gray-400" },
};

const STATUS_STYLE = {
  active:     { dot: "bg-red-500 animate-pulse", text: "text-red-400", label: "ACTIVE" },
  warning:    { dot: "bg-amber-500 animate-pulse", text: "text-amber-400", label: "WARNING" },
  monitoring: { dot: "bg-blue-400", text: "text-blue-400", label: "MONITORING" },
  resolved:   { dot: "bg-emerald-400", text: "text-emerald-400", label: "RESOLVED" },
};

/* ────── COMPONENTS ────── */

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-border bg-surface px-3 py-2 pr-8 text-xs text-white focus:border-emerald-500/50 focus:outline-none">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}

function AlertCard({ alert, onClick }) {
  const sev = SEV[alert.severity];
  const st = STATUS_STYLE[alert.status];
  return (
    <button onClick={onClick}
      className="group w-full text-left border border-border bg-[#0d1117] transition-all hover:bg-surface-hover hover:border-border">
      {/* Severity bar */}
      <div className={`h-0.5 w-full ${sev.bar}`} />
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <alert.icon className={`h-4 w-4 ${sev.text}`} />
            <span className={`border px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest ${sev.badge}`}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 ${st.dot}`} />
            <span className={`text-[9px] font-mono font-bold ${st.text}`}>{st.label}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
          {alert.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-muted">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{alert.district}, {alert.province}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{alert.date} {alert.time}</span>
          {alert.affectedPeople > 0 && (
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{alert.affectedPeople.toLocaleString()}</span>
          )}
        </div>
      </div>
    </button>
  );
}

function AlertModal({ alert, onClose }) {
  if (!alert) return null;
  const sev = SEV[alert.severity];
  const st = STATUS_STYLE[alert.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl border border-border bg-[#0d1117] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Severity bar */}
        <div className={`h-1 w-full ${sev.bar}`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <alert.icon className={`h-5 w-5 ${sev.text}`} />
              <span className={`border px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest ${sev.badge}`}>
                {alert.severity.toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 ${st.dot}`} />
                <span className={`text-[10px] font-mono font-bold ${st.text}`}>{st.label}</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-white">{alert.title}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center border border-border text-muted hover:text-white hover:border-white/30 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Location & time */}
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              { label: "PROVINCE", value: alert.province },
              { label: "DISTRICT", value: alert.district },
              { label: "MUNICIPALITY", value: alert.municipality },
              { label: "TIMESTAMP", value: `${alert.date} ${alert.time}` },
            ].map((item) => (
              <div key={item.label} className="bg-surface p-3">
                <span className="text-[9px] font-mono tracking-widest text-muted">{item.label}</span>
                <p className="mt-0.5 text-xs font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-muted mb-2">SITUATION REPORT</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{alert.description}</p>
          </div>

          {/* Stats */}
          {alert.affectedPeople > 0 && (
            <div className="border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] font-mono tracking-widest text-muted">AFFECTED POPULATION</span>
              </div>
              <p className="mt-1 text-2xl font-black font-mono text-white">{alert.affectedPeople.toLocaleString()}</p>
            </div>
          )}

          {/* Actions */}
          <div>
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-muted mb-2">REQUIRED ACTIONS</h3>
            <div className="space-y-2">
              {alert.actions.map((a, i) => (
                <div key={i} className="flex items-start gap-2 border border-border bg-surface p-3">
                  <span className={`mt-0.5 h-2 w-2 flex-none ${sev.dot}`} />
                  <span className="text-xs text-gray-300">{a}</span>
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

  const districts = province !== "All" && DISTRICTS_BY_PROVINCE[province]
    ? ["All", ...DISTRICTS_BY_PROVINCE[province]] : ["All"];
  const municipalities = district !== "All" && MUNICIPALITIES_BY_DISTRICT[district]
    ? ["All", ...MUNICIPALITIES_BY_DISTRICT[district]] : ["All"];

  const filtered = useMemo(() => {
    return ALERTS.filter((a) => {
      if (type !== "All" && a.type !== type) return false;
      if (province !== "All" && a.province !== province) return false;
      if (district !== "All" && a.district !== district) return false;
      if (municipality !== "All" && a.municipality !== municipality) return false;
      if (from && a.date < from) return false;
      if (to && a.date > to) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.district.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [type, province, district, municipality, from, to, search]);

  const counts = {
    critical: filtered.filter((a) => a.severity === "critical").length,
    high: filtered.filter((a) => a.severity === "high").length,
    moderate: filtered.filter((a) => a.severity === "moderate").length,
    low: filtered.filter((a) => a.severity === "low").length,
    active: filtered.filter((a) => a.status === "active").length,
  };

  return (
    <div className="min-h-screen bg-background cmd-grid">
      {/* Ticker */}
      <div className="overflow-hidden border-b border-red-500/20 bg-red-500/5 py-1.5">
        <div className="flex animate-[scroll-left_40s_linear_infinite] whitespace-nowrap">
          {[...ALERTS, ...ALERTS, ...ALERTS].filter((a) => a.status === "active" || a.status === "warning").map((a, i) => (
            <span key={`${a.id}-${i}`} className="mx-8 inline-flex items-center gap-2 text-xs">
              <span className={`h-1.5 w-1.5 ${a.status === "active" ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
              <span className={`font-mono font-bold ${a.status === "active" ? "text-red-400" : "text-amber-400"}`}>{a.type.toUpperCase()}</span>
              <span className="text-muted">{a.district} — {a.title.split("—")[1] || a.title}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="h-4 w-4 text-red-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-400">LIVE FEED</span>
            </div>
            <h1 className="text-2xl font-black text-white">Disaster Alerts</h1>
          </div>

          {/* Stats strip */}
          <div className="flex gap-4">
            {[
              { label: "CRITICAL", value: counts.critical, color: "text-red-400" },
              { label: "HIGH", value: counts.high, color: "text-amber-400" },
              { label: "MODERATE", value: counts.moderate, color: "text-blue-400" },
              { label: "ACTIVE", value: counts.active, color: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className="text-right">
                <div className={`text-lg font-black font-mono ${s.color}`}>{s.value}</div>
                <div className="text-[9px] font-mono tracking-widest text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="border border-border bg-[#0d1117] p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500">FILTERS</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {/* Search */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                  className="w-full border border-border bg-surface pl-8 pr-3 py-2 text-xs text-white placeholder:text-muted/50 focus:border-emerald-500/50 focus:outline-none" />
              </div>
            </div>

            <Select label="Type" value={type} onChange={(v) => setType(v)} options={TYPE_FILTERS} />
            <Select label="Province" value={province}
              onChange={(v) => { setProvince(v); setDistrict("All"); setMunicipality("All"); }}
              options={PROVINCES} />
            <Select label="District" value={district}
              onChange={(v) => { setDistrict(v); setMunicipality("All"); }}
              options={districts} />
            <Select label="Municipality" value={municipality} onChange={setMunicipality} options={municipalities} />

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full border border-border bg-surface px-3 py-2 text-xs text-white focus:border-emerald-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full border border-border bg-surface px-3 py-2 text-xs text-white focus:border-emerald-500/50 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted font-mono">{filtered.length} ALERT{filtered.length !== 1 ? "S" : ""}</span>
          {(type !== "All" || province !== "All" || search) && (
            <button onClick={() => { setType("All"); setProvince("All"); setDistrict("All"); setMunicipality("All"); setFrom(""); setTo(""); setSearch(""); }}
              className="text-[10px] font-mono text-emerald-500 hover:text-emerald-400">
              CLEAR FILTERS
            </button>
          )}
        </div>

        {/* Alert Grid */}
        {filtered.length === 0 ? (
          <div className="border border-border bg-[#0d1117] p-16 text-center">
            <Shield className="mx-auto h-8 w-8 text-emerald-500/30 mb-3" />
            <p className="text-sm font-bold text-white">No Alerts Found</p>
            <p className="mt-1 text-xs text-muted">Adjust filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a) => (
              <AlertCard key={a.id} alert={a} onClick={() => setSelected(a)} />
            ))}
          </div>
        )}
      </div>

      <AlertModal alert={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
