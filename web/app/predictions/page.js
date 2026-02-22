"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
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
  ChevronRight,
  X,
  Thermometer,
  CloudRain,
  Activity,
  AlertTriangle,
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
  critical: { label: "Critical", bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200",    bar: "bg-red-500",    dot: "bg-red-500",    ring: "ring-red-200"    },
  high:     { label: "High",     bg: "bg-orange-50",  text: "text-orange-600", border: "border-orange-200", bar: "bg-orange-500", dot: "bg-orange-500", ring: "ring-orange-200" },
  moderate: { label: "Moderate", bg: "bg-yellow-50",  text: "text-yellow-600", border: "border-yellow-200", bar: "bg-yellow-400", dot: "bg-yellow-400", ring: "ring-yellow-200" },
  low:      { label: "Low",      bg: "bg-green-50",   text: "text-green-600",  border: "border-green-200",  bar: "bg-green-500",  dot: "bg-green-500",  ring: "ring-green-200"  },
};

const FACTORS = [
  { icon: CloudRain,   label: "Rainfall (7d)",    value: "340mm",  sub: "Above average" },
  { icon: Thermometer, label: "Temperature",       value: "+2.4°C", sub: "Anomaly from baseline" },
  { icon: Activity,    label: "Soil Moisture",     value: "94%",    sub: "Saturation level" },
  { icon: Wind,        label: "Wind Speed",         value: "52km/h", sub: "Avg. surface wind" },
];

const FORECAST = [
  { day: "Today",    risk: 87, type: "Flood",     severity: "critical" },
  { day: "Tomorrow", risk: 79, type: "Flood",     severity: "high"     },
  { day: "Wed",      risk: 64, type: "Landslide", severity: "high"     },
  { day: "Thu",      risk: 47, type: "Landslide", severity: "moderate" },
  { day: "Fri",      risk: 35, type: "Flood",     severity: "moderate" },
  { day: "Sat",      risk: 22, type: "Flood",     severity: "low"      },
  { day: "Sun",      risk: 18, type: "Flood",     severity: "low"      },
];

// Sort by risk descending
const SORTED = [...PREDICTIONS].sort((a, b) => b.risk - a.risk);

function RiskBar({ risk, severity }) {
  const sev = SEV[severity];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${sev.bar} transition-all duration-500`}
          style={{ width: `${risk}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${sev.text}`}>{risk}%</span>
    </div>
  );
}

function PredictionCard({ p, onSelect, selected }) {
  const sev = SEV[p.severity];
  const Icon = TYPE_ICON[p.type];
  const isSelected = selected?.id === p.id;

  return (
    <button
      onClick={() => onSelect(isSelected ? null : p)}
      className={`group w-full rounded-xl border bg-white p-3 text-left transition-all hover:shadow-md ${
        isSelected
          ? `ring-2 ${sev.ring} border-transparent shadow-md`
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sev.bg} ${sev.text}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-sm font-semibold text-gray-900 truncate">{p.name}</span>
            <span className={`shrink-0 text-xs font-bold ${sev.text}`}>{p.risk}%</span>
          </div>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <span className="text-[11px] text-gray-400">{p.type}</span>
            <span className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 ${sev.bg} ${sev.text}`}>{sev.label}</span>
          </div>
          <RiskBar risk={p.risk} severity={p.severity} />
        </div>
      </div>
    </button>
  );
}

function DetailPanel({ p, onClose }) {
  const sev = SEV[p.severity];
  const Icon = TYPE_ICON[p.type];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-lg overflow-hidden">
      {/* Color header */}
      <div className={`${sev.bg} border-b ${sev.border} p-5`}>
        <div className="flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ${sev.text}`}>
            <Icon className="h-5 w-5" />
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/60">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-3 text-lg font-bold text-gray-900">{p.name} District</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
          <MapPin className="h-3.5 w-3.5" /> {p.type} Risk Zone
        </div>

        {/* Big risk score */}
        <div className="mt-4 flex items-end gap-3">
          <div>
            <div className={`text-6xl font-black ${sev.text}`}>{p.risk}%</div>
            <div className="text-sm text-gray-500">Risk Probability</div>
          </div>
          <div className={`mb-2 rounded-full px-3 py-1 text-sm font-bold ${sev.bg} ${sev.text} border ${sev.border}`}>
            {sev.label}
          </div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-white/60 overflow-hidden">
          <div
            className={`h-full rounded-full ${sev.bar} transition-all duration-700`}
            style={{ width: `${p.risk}%` }}
          />
        </div>
      </div>

      {/* Factors */}
      <div className="p-5 border-b border-gray-50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
          Contributing Factors
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FACTORS.map((f) => (
            <div key={f.label} className="rounded-xl bg-gray-50 p-3">
              <f.icon className="h-4 w-4 text-gray-400 mb-1.5" />
              <div className="text-sm font-bold text-gray-900">{f.value}</div>
              <div className="text-[10px] text-gray-400">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="p-5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
          7-Day Forecast
        </div>
        <div className="space-y-2">
          {FORECAST.map((f) => {
            const fs = SEV[f.severity];
            return (
              <div key={f.day} className="flex items-center gap-3">
                <span className="w-10 text-xs text-gray-400">{f.day}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${fs.bar}`}
                    style={{ width: `${f.risk}%` }}
                  />
                </div>
                <span className={`w-8 text-right text-xs font-bold tabular-nums ${fs.text}`}>{f.risk}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PredictionsPage() {
  const [selected, setSelected] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");

  const types = ["All", "Flood", "Landslide", "Earthquake", "Wildfire", "Extreme Weather"];

  const listFiltered = typeFilter === "All"
    ? SORTED
    : SORTED.filter((p) => p.type === typeFilter);

  const counts = {
    critical: PREDICTIONS.filter((p) => p.severity === "critical").length,
    high:     PREDICTIONS.filter((p) => p.severity === "high").length,
    moderate: PREDICTIONS.filter((p) => p.severity === "moderate").length,
    low:      PREDICTIONS.filter((p) => p.severity === "low").length,
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
                Machine learning risk forecasts across Nepal · Updated every 6 hours
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Last run: 2 hrs ago
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Critical Risk",  val: counts.critical, ...SEV.critical },
              { label: "High Risk",      val: counts.high,     ...SEV.high     },
              { label: "Moderate Risk",  val: counts.moderate, ...SEV.moderate },
              { label: "Low Risk",       val: counts.low,      ...SEV.low      },
            ].map(({ label, val, bg, text, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} py-5 text-center`}>
                <div className={`text-5xl font-black ${text}`}>{val}</div>
                <div className="mt-1.5 text-sm font-semibold text-gray-500">{label}</div>
                <div className="text-xs text-gray-400">districts</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main: map + list */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-5 h-[640px]">

          {/* Map */}
          <div className="flex-1 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
            <NepalMap onSelect={setSelected} selected={selected} />

            {/* Legend overlay */}
            <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-3 shadow-md">
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
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 px-4 py-2 shadow text-xs text-gray-500 whitespace-nowrap">
                Click a circle to see district forecast
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto">
            {selected ? (
              <DetailPanel p={selected} onClose={() => setSelected(null)} />
            ) : (
              <>
                {/* Filter pills */}
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Filter by type
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {types.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          typeFilter === t
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* District list */}
                <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex-1">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Districts by Risk
                    </div>
                    <span className="text-xs text-gray-400">{listFiltered.length} shown</span>
                  </div>
                  <div className="overflow-y-auto p-2 space-y-1.5 max-h-[450px]">
                    {listFiltered.map((p) => (
                      <PredictionCard
                        key={p.id}
                        p={p}
                        onSelect={setSelected}
                        selected={selected}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
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
      </div>
    </div>
  );
}
