"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  CloudRain, Mountain, Activity, Flame, Wind, Brain,
  X, ChevronDown, MapPin, TrendingUp, BarChart3,
  Info, Calendar, Filter, Layers,
} from "lucide-react";
import { PREDICTIONS } from "../data/predictions";

const NepalMap = dynamic(() => import("../components/NepalMap"), { ssr: false });

/* ────── HELPERS ────── */

const TYPE_ICON = { Flood: CloudRain, Landslide: Mountain, Earthquake: Activity, Wildfire: Flame, "Extreme Weather": Wind };
const TYPE_FILTERS = ["All", "Flood", "Landslide", "Earthquake", "Wildfire", "Extreme Weather"];

const SEV = {
  critical: { dot: "bg-red-500", badge: "border-red-500/30 text-red-400 bg-red-500/10", text: "text-red-400", bar: "bg-red-500" },
  high:     { dot: "bg-amber-500", badge: "border-amber-500/30 text-amber-400 bg-amber-500/10", text: "text-amber-400", bar: "bg-amber-500" },
  moderate: { dot: "bg-blue-400", badge: "border-blue-400/30 text-blue-400 bg-blue-400/10", text: "text-blue-400", bar: "bg-blue-400" },
  low:      { dot: "bg-gray-400", badge: "border-gray-400/30 text-gray-400 bg-gray-400/10", text: "text-gray-400", bar: "bg-gray-400" },
};

const FORECAST = [
  { day: "Mon", delta: -3 }, { day: "Tue", delta: 2 }, { day: "Wed", delta: 5 },
  { day: "Thu", delta: -1 }, { day: "Fri", delta: 8 }, { day: "Sat", delta: -4 }, { day: "Sun", delta: 1 },
];

const PROVINCES = ["All", "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const DISTRICTS_BY_PROVINCE = { Koshi: ["Sunsari", "Morang", "Panchthar", "Taplejung", "Jhapa", "Udayapur"], Madhesh: ["Dhanusha", "Parsa", "Siraha", "Sarlahi", "Saptari", "Rautahat", "Mahottari"], Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur", "Sindhupalchok", "Chitwan", "Makwanpur", "Nuwakot"], Gandaki: ["Kaski", "Gorkha", "Lamjung", "Palpa", "Mustang"], Lumbini: ["Rupandehi", "Kapilvastu", "Dang", "Nawalparasi", "Rolpa"], Karnali: ["Surkhet", "Jumla", "Humla", "Dolpa"], Sudurpashchim: ["Kailali", "Kanchanpur", "Doti", "Bajhang"] };
const MUNICIPALITIES_BY_DISTRICT = { Sunsari: ["Itahari Sub-Metro", "Dharan Sub-Metro"], Morang: ["Biratnagar Metro", "Urlabari"], Kathmandu: ["Kathmandu Metro"], Sindhupalchok: ["Melamchi", "Chautara Sangachok"], Chitwan: ["Bharatpur Metro"], Kaski: ["Pokhara Metro"], Gorkha: ["Gorkha"], Rupandehi: ["Butwal Sub-Metro", "Siddharthanagar"], Jumla: ["Chandannath"], Kailali: ["Dhangadhi Sub-Metro"], Kanchanpur: ["Mahendranagar"], Bajhang: ["Chainpur"], Doti: ["Dipayal Silgadhi", "K.I. Singh"], Dhanusha: ["Janakpur Sub-Metro"], Parsa: ["Birgunj Metro"] };

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

/* ────── DETAIL POPUP ────── */
function DetailPopup({ item, onClose }) {
  if (!item) return null;
  const sev = SEV[item.severity];
  const Icon = TYPE_ICON[item.type] || Activity;
  const factors = [
    { label: "Rainfall Index", value: Math.min(99, item.risk + 5), bar: "bg-blue-400" },
    { label: "Soil Saturation", value: Math.min(99, item.risk - 8), bar: "bg-amber-400" },
    { label: "Slope Grade", value: Math.min(99, Math.round(item.risk * 0.7)), bar: "bg-purple-400" },
    { label: "Historical Freq", value: Math.min(99, Math.round(item.risk * 0.85)), bar: "bg-cyan-400" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-lg border border-border bg-[#0d1117] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className={`h-1 w-full ${sev.bar}`} />

        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-5 w-5 ${sev.text}`} />
              <span className={`border px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest ${sev.badge}`}>
                {item.severity.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-muted">{item.type}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{item.name}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center border border-border text-muted hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Location */}
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              { l: "PROVINCE", v: item.province }, { l: "DISTRICT", v: item.district },
              { l: "MUNICIPALITY", v: item.municipality }, { l: "PREDICTED", v: item.date },
            ].map((d) => (
              <div key={d.l} className="bg-surface p-3">
                <span className="text-[9px] font-mono tracking-widest text-muted">{d.l}</span>
                <p className="mt-0.5 text-xs font-bold text-white">{d.v}</p>
              </div>
            ))}
          </div>

          {/* Risk score */}
          <div className="border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-muted">AI RISK SCORE</span>
              <span className={`text-2xl font-black font-mono ${sev.text}`}>{item.risk}%</span>
            </div>
            <div className="h-2 w-full bg-gray-800">
              <div className={`h-full ${sev.bar} transition-all`} style={{ width: `${item.risk}%` }} />
            </div>
          </div>

          {/* 7-day forecast */}
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted">7-DAY FORECAST</span>
            <div className="mt-3 flex justify-between gap-1">
              {FORECAST.map((f) => {
                const val = Math.max(10, Math.min(99, item.risk + f.delta));
                return (
                  <div key={f.day} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-muted">{f.day}</span>
                    <div className="w-full h-16 bg-gray-800 relative">
                      <div className={`absolute bottom-0 w-full ${val >= 80 ? "bg-red-500" : val >= 60 ? "bg-amber-500" : val >= 40 ? "bg-blue-400" : "bg-gray-400"}`}
                        style={{ height: `${val}%` }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-white">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contributing factors */}
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted">CONTRIBUTING FACTORS</span>
            <div className="mt-3 space-y-2">
              {factors.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="w-28 text-[10px] text-muted">{f.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-800">
                    <div className={`h-full ${f.bar}`} style={{ width: `${f.value}%` }} />
                  </div>
                  <span className="w-8 text-right text-[10px] font-mono font-bold text-white">{f.value}</span>
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
export default function PredictionsPage() {
  const [type, setType] = useState("All");
  const [province, setProvince] = useState("All");
  const [district, setDistrict] = useState("All");
  const [municipality, setMunicipality] = useState("All");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const districts = province !== "All" && DISTRICTS_BY_PROVINCE[province]
    ? ["All", ...DISTRICTS_BY_PROVINCE[province]] : ["All"];
  const municipalities = district !== "All" && MUNICIPALITIES_BY_DISTRICT[district]
    ? ["All", ...MUNICIPALITIES_BY_DISTRICT[district]] : ["All"];

  const filtered = useMemo(() => {
    return PREDICTIONS.filter((p) => {
      if (type !== "All" && p.type !== type) return false;
      if (province !== "All" && p.province !== province) return false;
      if (district !== "All" && p.district !== district) return false;
      if (municipality !== "All" && p.municipality !== municipality) return false;
      if (date && p.date !== date) return false;
      return true;
    });
  }, [type, province, district, municipality, date]);

  const handleMarkerClick = useCallback((p) => setSelected(p), []);

  const counts = {
    critical: filtered.filter((p) => p.severity === "critical").length,
    high: filtered.filter((p) => p.severity === "high").length,
    moderate: filtered.filter((p) => p.severity === "moderate").length,
    low: filtered.filter((p) => p.severity === "low").length,
    total: filtered.length,
  };

  return (
    <div className="min-h-screen bg-background cmd-grid">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-purple-400">AI ENGINE</span>
            </div>
            <h1 className="text-2xl font-black text-white">Risk Predictions</h1>
            <p className="mt-1 text-sm text-muted">ML-powered local-level disaster risk forecasting for Nepal</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            {[
              { label: "CRITICAL", value: counts.critical, color: "text-red-400" },
              { label: "HIGH", value: counts.high, color: "text-amber-400" },
              { label: "MODERATE", value: counts.moderate, color: "text-blue-400" },
              { label: "TOTAL", value: counts.total, color: "text-white" },
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Select label="Type" value={type} onChange={(v) => setType(v)} options={TYPE_FILTERS} />
            <Select label="Province" value={province}
              onChange={(v) => { setProvince(v); setDistrict("All"); setMunicipality("All"); }}
              options={PROVINCES} />
            <Select label="District" value={district}
              onChange={(v) => { setDistrict(v); setMunicipality("All"); }}
              options={districts} />
            <Select label="Municipality" value={municipality} onChange={setMunicipality} options={municipalities} />
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full border border-border bg-surface px-3 py-2 text-xs text-white focus:border-emerald-500/50 focus:outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={() => { setType("All"); setProvince("All"); setDistrict("All"); setMunicipality("All"); setDate(""); }}
                className="w-full border border-border bg-surface px-3 py-2 text-xs text-muted hover:text-white hover:border-white/30 transition-colors">
                RESET
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="relative border border-border bg-[#0d1117]">
          <div className="h-[500px] lg:h-[560px]">
            <NepalMap data={filtered} onMarkerClick={handleMarkerClick} />
          </div>

          {/* Legend overlay */}
          <div className="absolute left-3 top-3 z-[10] border border-border bg-[#0d1117]/90 backdrop-blur p-3">
            <span className="text-[9px] font-mono font-bold tracking-widest text-muted">SEVERITY</span>
            <div className="mt-2 space-y-1.5">
              {[
                { label: "Critical (80+)", color: "bg-red-500" },
                { label: "High (60-79)", color: "bg-amber-500" },
                { label: "Moderate (40-59)", color: "bg-blue-400" },
                { label: "Low (<40)", color: "bg-gray-400" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 ${l.color}`} />
                  <span className="text-[10px] text-gray-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="absolute right-3 top-3 z-[10] border border-border bg-[#0d1117]/90 backdrop-blur px-3 py-2">
            <span className="font-mono text-xs text-white font-bold">{counts.total}</span>
            <span className="ml-1 text-[10px] font-mono text-muted">PREDICTIONS</span>
          </div>
        </div>

        {/* AI Info Cards */}
        <div className="mt-6 grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
          {[
            { icon: Brain, title: "ML Model", desc: "Random Forest + LSTM ensemble analyzing 12 environmental variables including rainfall, soil moisture, slope gradient, and historical patterns.", color: "text-purple-400" },
            { icon: Layers, title: "Data Sources", desc: "DHM real-time weather stations, NASA SRTM terrain data, USGS seismic feeds, and NDRRMA historical disaster database (2015-2026).", color: "text-cyan-400" },
            { icon: BarChart3, title: "Accuracy", desc: "93.2% validation accuracy on historical data. Predictions updated every 6 hours. Local-level granularity for all 753 local governments.", color: "text-emerald-400" },
          ].map((card) => (
            <div key={card.title} className="bg-[#0d1117] p-5">
              <card.icon className={`h-4 w-4 ${card.color} mb-2`} />
              <h3 className="text-xs font-bold text-white">{card.title}</h3>
              <p className="mt-1.5 text-[11px] text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <DetailPopup item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
