"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import {
  Brain,
  Droplets,
  Mountain,
  Flame,
  Wind,
  Waves,
  MapPin,
  TrendingUp,
  Clock,
  X,
  Thermometer,
  CloudRain,
  Activity,
  AlertTriangle,
  Calendar,
  Filter,
} from "lucide-react";

// Dynamic import — Leaflet cannot run server-side
const NepalMap = dynamic(() => import("../components/NepalMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  ),
});

import { PREDICTIONS } from "../data/predictions";

const TYPE_ICON = {
  Flood:           Droplets,
  Landslide:       Mountain,
  Earthquake:      Waves,
  Wildfire:        Flame,
  "Extreme Weather": Wind,
};

const SEV = {
  critical: { label: "Critical", bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200",    bar: "bg-red-500",    dot: "bg-red-500" },
  high:     { label: "High",     bg: "bg-orange-50",  text: "text-orange-600", border: "border-orange-200", bar: "bg-orange-500", dot: "bg-orange-500" },
  moderate: { label: "Moderate", bg: "bg-yellow-50",  text: "text-yellow-600", border: "border-yellow-200", bar: "bg-yellow-400", dot: "bg-yellow-400" },
  low:      { label: "Low",      bg: "bg-green-50",   text: "text-green-600",  border: "border-green-200",  bar: "bg-green-500",  dot: "bg-green-500" },
};

const FORECAST = [
  { day: "Today",    risk: 87, type: "Flood",     severity: "critical" },
  { day: "Tomorrow", risk: 79, type: "Flood",     severity: "high"     },
  { day: "Wed",      risk: 64, type: "Landslide", severity: "high"     },
  { day: "Thu",      risk: 47, type: "Landslide", severity: "moderate" },
  { day: "Fri",      risk: 35, type: "Flood",     severity: "moderate" },
  { day: "Sat",      risk: 22, type: "Flood",     severity: "low"      },
  { day: "Sun",      risk: 18, type: "Flood",     severity: "low"      },
];

// Detail Popup Overlay Component
function DetailPopup({ p, onClose }) {
  if (!p) return null;
  const sev = SEV[p.severity];
  const Icon = TYPE_ICON[p.type];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className={`p-6 border-b ${sev.border} ${sev.bg}`}>
          <div className="flex items-start gap-3">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${sev.bg} border ${sev.border}`}>
              <Icon className={`h-6 w-6 ${sev.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {p.district}, {p.province}
                </span>
                <span>•</span>
                <span>{p.municipality}</span>
              </div>
            </div>
          </div>

          {/* Risk score */}
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Risk Level
              </div>
              <div className={`text-6xl font-black ${sev.text}`}>{p.risk}%</div>
            </div>
            <div className={`rounded-xl ${sev.bg} border ${sev.border} px-4 py-2`}>
              <div className={`text-sm font-bold ${sev.text}`}>{sev.label} Risk</div>
              <div className="text-xs text-gray-500">{p.type}</div>
            </div>
          </div>
        </div>

        {/* 7-day forecast */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-700">7-Day Forecast</h3>
          </div>
          <div className="flex items-end justify-between gap-2">
            {FORECAST.map((f, idx) => {
              const fsev = SEV[f.severity];
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="text-[10px] font-semibold text-gray-400">{f.day}</div>
                  <div
                    className={`w-full rounded-t-md ${fsev.bar} transition-all`}
                    style={{ height: `${f.risk * 1.2}px` }}
                  />
                  <div className={`text-[10px] font-bold ${fsev.text}`}>{f.risk}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contributing factors */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-700">Contributing Factors</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <CloudRain className="h-4 w-4 text-blue-500 mb-2" />
              <div className="text-xs text-gray-500 mb-0.5">Rainfall (7d)</div>
              <div className="text-lg font-black text-gray-900">340mm</div>
              <div className="text-[10px] text-gray-400">Above average</div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Thermometer className="h-4 w-4 text-red-500 mb-2" />
              <div className="text-xs text-gray-500 mb-0.5">Temperature</div>
              <div className="text-lg font-black text-gray-900">+2.4°C</div>
              <div className="text-[10px] text-gray-400">Anomaly</div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Activity className="h-4 w-4 text-green-500 mb-2" />
              <div className="text-xs text-gray-500 mb-0.5">Soil Moisture</div>
              <div className="text-lg font-black text-gray-900">94%</div>
              <div className="text-[10px] text-gray-400">Saturation level</div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Wind className="h-4 w-4 text-purple-500 mb-2" />
              <div className="text-xs text-gray-500 mb-0.5">Wind Speed</div>
              <div className="text-lg font-black text-gray-900">52km/h</div>
              <div className="text-[10px] text-gray-400">Avg. surface wind</div>
            </div>
          </div>
        </div>

        {/* Predicted date */}
        <div className="px-6 pb-6">
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <div>
              <div className="text-xs text-purple-600 font-semibold">Predicted Event Date</div>
              <div className="text-sm font-black text-purple-900">{p.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PredictionsPage() {
  const [selected, setSelected] = useState(null);
  
  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [municipalityFilter, setMunicipalityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Extract unique values for filters
  const provinces = ["All", ...new Set(PREDICTIONS.map(p => p.province))];
  const districts = useMemo(() => {
    if (provinceFilter === "All") return ["All", ...new Set(PREDICTIONS.map(p => p.district))];
    return ["All", ...new Set(PREDICTIONS.filter(p => p.province === provinceFilter).map(p => p.district))];
  }, [provinceFilter]);
  const municipalities = useMemo(() => {
    let filtered = PREDICTIONS;
    if (provinceFilter !== "All") filtered = filtered.filter(p => p.province === provinceFilter);
    if (districtFilter !== "All") filtered = filtered.filter(p => p.district === districtFilter);
    return ["All", ...new Set(filtered.map(p => p.municipality))];
  }, [provinceFilter, districtFilter]);
  const types = ["All", "Flood", "Landslide", "Earthquake", "Wildfire", "Extreme Weather"];

  // Apply filters
  const filtered = useMemo(() => {
    return PREDICTIONS.filter(p => {
      if (dateFilter && p.date !== dateFilter) return false;
      if (provinceFilter !== "All" && p.province !== provinceFilter) return false;
      if (districtFilter !== "All" && p.district !== districtFilter) return false;
      if (municipalityFilter !== "All" && p.municipality !== municipalityFilter) return false;
      if (typeFilter !== "All" && p.type !== typeFilter) return false;
      return true;
    });
  }, [dateFilter, provinceFilter, districtFilter, municipalityFilter, typeFilter]);

  const counts = useMemo(() => ({
    critical: filtered.filter((p) => p.severity === "critical").length,
    high:     filtered.filter((p) => p.severity === "high").length,
    moderate: filtered.filter((p) => p.severity === "moderate").length,
    low:      filtered.filter((p) => p.severity === "low").length,
  }), [filtered]);

  const hasActiveFilters = dateFilter || provinceFilter !== "All" || districtFilter !== "All" || municipalityFilter !== "All" || typeFilter !== "All";

  const clearFilters = () => {
    setDateFilter("");
    setProvinceFilter("All");
    setDistrictFilter("All");
    setMunicipalityFilter("All");
    setTypeFilter("All");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">AI Prediction Engine</h1>
              </div>
              <p className="text-sm text-gray-500 ml-11.5">
                Local-level machine learning risk forecasts · Updated every 6 hours
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Last run: 2 hrs ago
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-700">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs font-semibold text-green-600 hover:text-green-700"
              >
                Clear all
              </button>
            )}
          </div>
          
          {/* Filter controls */}
          <div className="flex flex-wrap items-end justify-center gap-3">
            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Province</label>
              <select
                value={provinceFilter}
                onChange={(e) => {
                  setProvinceFilter(e.target.value);
                  setDistrictFilter("All");
                  setMunicipalityFilter("All");
                }}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* District */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">District</label>
              <select
                value={districtFilter}
                onChange={(e) => {
                  setDistrictFilter(e.target.value);
                  setMunicipalityFilter("All");
                }}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Municipality */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Municipality</label>
              <select
                value={municipalityFilter}
                onChange={(e) => setMunicipalityFilter(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Disaster Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Disaster Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{filtered.length}</span> of {PREDICTIONS.length} predicted locations
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative h-[700px] z-0">
          <NepalMap onSelect={setSelected} selected={selected} predictions={filtered} />

          {/* Legend overlay - FIXED z-index */}
          <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-3 shadow-md">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Risk Level</div>
            {[
              { label: "Critical (≥80%)", color: "bg-red-500" },
              { label: "High (60–79%)",   color: "bg-orange-500" },
              { label: "Moderate (35–59%)", color: "bg-yellow-400" },
              { label: "Low (<35%)",      color: "bg-green-500" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className={`h-3 w-3 rounded-full ${color}`} />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
              Circle size = risk magnitude
            </div>
          </div>

          {/* Hint */}
          {!selected && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 px-4 py-2 shadow text-xs text-gray-500 whitespace-nowrap">
              Click a circle to see local forecast
            </div>
          )}
        </div>

        {/* AI model info */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: CloudRain,   title: "Weather Data",    desc: "DHM rainfall, temperature & wind readings from 300+ weather stations across Nepal." },
            { icon: TrendingUp,  title: "Historical Patterns", desc: "10 years of disaster event data from NDRRMA, analysed for seasonal and geographic trends." },
            { icon: Activity,    title: "Terrain Analysis", desc: "Elevation, slope gradient, soil moisture & vegetation index from satellite imagery." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50">
                  <Icon className="h-4.5 w-4.5 text-purple-500" />
                </div>
                <span className="text-sm font-semibold text-gray-800">{title}</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Critical Risk",  val: counts.critical, ...SEV.critical },
            { label: "High Risk",      val: counts.high,     ...SEV.high     },
            { label: "Moderate Risk",  val: counts.moderate, ...SEV.moderate },
            { label: "Low Risk",       val: counts.low,      ...SEV.low      },
          ].map(({ label, val, bg, text, border }) => (
            <div key={label} className={`rounded-2xl border ${border} ${bg} py-5 text-center`}>
              <div className={`text-5xl font-black ${text}`}>{val}</div>
              <div className="mt-1.5 text-sm font-semibold text-gray-500">{label}</div>
              <div className="text-xs text-gray-400">locations</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Popup */}
      <DetailPopup p={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
