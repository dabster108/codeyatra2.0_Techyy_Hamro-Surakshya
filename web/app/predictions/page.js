"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  CloudRain,
  Mountain,
  Activity,
  Flame,
  Wind,
  Brain,
  X,
  ChevronDown,
  MapPin,
  BarChart3,
  Filter,
  Layers,
  TrendingUp,
  Shield,
  AlertTriangle,
  ChevronRight,
  Database,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { PREDICTIONS } from "../data/predictions";
import WildfireAPI, { clearWildfireCache } from "../lib/wildfire-api";
const NepalMap = dynamic(() => import("../components/NepalMap"), {
  ssr: false,
});

/* ────── CONSTANTS ────── */

const TYPE_ICON = {
  Flood: CloudRain,
  Landslide: Mountain,
  Earthquake: Activity,
  Wildfire: Flame,
  "Extreme Weather": Wind,
};
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
  Koshi: ["Sunsari", "Morang", "Panchthar", "Taplejung", "Jhapa", "Udayapur"],
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
  Sunsari: ["Itahari Sub-Metro", "Dharan Sub-Metro"],
  Morang: ["Biratnagar Metro", "Urlabari"],
  Kathmandu: ["Kathmandu Metro"],
  Sindhupalchok: ["Melamchi", "Chautara Sangachok"],
  Chitwan: ["Bharatpur Metro"],
  Kaski: ["Pokhara Metro"],
  Gorkha: ["Gorkha"],
  Rupandehi: ["Butwal Sub-Metro", "Siddharthanagar"],
  Jumla: ["Chandannath"],
  Kailali: ["Dhangadhi Sub-Metro"],
  Kanchanpur: ["Mahendranagar"],
  Bajhang: ["Chainpur"],
  Doti: ["Dipayal Silgadhi", "K.I. Singh"],
  Dhanusha: ["Janakpur Sub-Metro"],
  Parsa: ["Birgunj Metro"],
};

const SEV = {
  extreme: {
    dot: "bg-red-500",
    bar: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-50 border-red-200 text-red-700",
    label: "EXTREME",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  high: {
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    text: "text-orange-600",
    badge: "bg-orange-50 border-orange-200 text-orange-700",
    label: "HIGH",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  medium: {
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    text: "text-amber-600",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    label: "MEDIUM",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  // low: {
  //   dot: "bg-blue-400",
  //   bar: "bg-blue-400",
  //   text: "text-blue-600",
  //   badge: "bg-blue-50 border-blue-200 text-blue-700",
  //   label: "LOW",
  //   bg: "bg-blue-50",
  //   border: "border-blue-200",
  // },
  minimal: {
    dot: "bg-gray-400",
    bar: "bg-gray-400",
    text: "text-gray-500",
    badge: "bg-gray-50 border-gray-200 text-gray-600",
    label: "MINIMAL",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
  // Backwards compatibility with old static data
  critical: {
    dot: "bg-red-500",
    bar: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-50 border-red-200 text-red-700",
    label: "EXTREME",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  moderate: {
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    text: "text-amber-600",
    badge: "bg-amber-50 border-amber-200 text-amber-700",
    label: "MEDIUM",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

const FORECAST = [
  { day: "Mon", delta: -3 },
  { day: "Tue", delta: 2 },
  { day: "Wed", delta: 5 },
  { day: "Thu", delta: -1 },
  { day: "Fri", delta: 8 },
  { day: "Sat", delta: -4 },
  { day: "Sun", delta: 1 },
];

/* ────── SELECT COMPONENT ────── */
function Select({ label, value, onChange, options }) {
  return (
    <div className="w-full">
      <label className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm font-semibold text-gray-700 shadow-sm focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all hover:border-emerald-300 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

/* ────── PREDICTION CARD ────── */
function PredictionCard({ item, onClick }) {
  const sev = SEV[item.severity] || SEV.minimal; // Fallback to minimal if undefined
  const Icon = TYPE_ICON[item.type] || Activity;
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl border border-gray-200 bg-gray-50 shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className={`h-1 w-full ${sev.bar}`} />
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${sev.bg} border ${sev.border}`}
            >
              <Icon className={`h-4 w-4 ${sev.text}`} />
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-mono font-bold tracking-widest ${sev.badge}`}
            >
              {sev.label}
            </span>
          </div>
          <span className={`text-lg font-black font-mono ${sev.text}`}>
            {item.risk}%
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
          {item.name}
        </h3>
        <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full ${sev.bar} transition-all`}
            style={{ width: `${item.risk}%` }}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {item.district}, {item.province}
          </span>
          <span>{item.type}</span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View analysis <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </button>
  );
}

/* ────── DETAIL POPUP ────── */
function DetailPopup({ item, onClose }) {
  const sev = item ? SEV[item.severity] || SEV.minimal : null; // Fallback to minimal if undefined

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [item]);

  if (!item) return null;

  const Icon = TYPE_ICON[item.type] || Activity;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-900/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-gray-50 shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-1.5 w-full rounded-t-3xl ${sev.bar}`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${sev.bg} border ${sev.border} shadow-sm`}
            >
              <Icon className={`h-5 w-5 ${sev.text}`} />
            </div>
            <div className="flex flex-col gap-1">
              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-mono font-bold tracking-widest ${sev.badge}`}
              >
                {sev.label}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
                {item.type}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-slate-500 hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Location Name */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {item.name}
            </h2>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            {[
              { l: "PROVINCE", v: item.province, icon: MapPin },
              { l: "DISTRICT", v: item.district, icon: MapPin },
              { l: "MUNICIPALITY", v: item.municipality, icon: MapPin },
            ].map((d) => (
              <div
                key={d.l}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <d.icon className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-500">
                    {d.l}
                  </span>
                </div>
                <p className="text-base font-bold text-gray-900">{d.v}</p>
              </div>
            ))}
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

  // Wildfire data state
  const [useRealWildfireData, setUseRealWildfireData] = useState(false);
  const [wildfireData, setWildfireData] = useState([]);
  const [wildfireLoading, setWildfireLoading] = useState(false);
  const [wildfireStats, setWildfireStats] = useState(null);
  const [wildfireError, setWildfireError] = useState(null);
  const debounceTimer = useRef(null);

  const fetchWildfireData = useCallback(
    async (currentProvince, currentDistrict) => {
      setWildfireLoading(true);
      setWildfireError(null);

      try {
        // Build filters — skip health-check preflight (it only doubles latency)
        const filters = {
          minFireProb: 0.8, // Show predictions with 80%+ probability (medium risk and above)
          limit: 1000,
        };

        if (currentProvince !== "All") {
          const provinceNum = getProvinceNumber(currentProvince);
          if (provinceNum) filters.province = provinceNum;
        }

        if (currentDistrict !== "All") {
          filters.district = currentDistrict;
        }

        // Fetch predictions and stats in parallel — both calls benefit from the
        // in-memory cache in wildfire-api.js so repeated identical requests are free
        const [predictions, stats] = await Promise.all([
          WildfireAPI.getPredictions(filters),
          WildfireAPI.getStats(),
        ]);

        const transformedData =
          WildfireAPI.transformToFrontendFormat(predictions);
        setWildfireData(transformedData);
        setWildfireStats(stats);
        setWildfireError(null);
      } catch (error) {
        console.error("Failed to fetch wildfire data:", error);
        setWildfireData([]);
        setWildfireStats(null);
        setWildfireError(
          "Could not reach the backend API. Make sure the server is running on port 8005.",
        );
      } finally {
        setWildfireLoading(false);
      }
    },
    [],
  );

  // Debounce wildfire fetches so rapidly changing filters don't fire parallel requests
  useEffect(() => {
    if (type === "Wildfire") {
      setUseRealWildfireData(true);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        fetchWildfireData(province, district);
      }, 300); // 300 ms debounce — fast enough to feel instant, slow enough to batch
    } else {
      setUseRealWildfireData(false);
    }
    return () => clearTimeout(debounceTimer.current);
  }, [type, province, district, fetchWildfireData]);

  const getProvinceNumber = (provinceName) => {
    const provinceMap = {
      Koshi: 1,
      Madhesh: 2,
      Bagmati: 3,
      Gandaki: 4,
      Lumbini: 5,
      Karnali: 6,
      Sudurpashchim: 7,
    };
    return provinceMap[provinceName];
  };

  const districts =
    province !== "All" && DISTRICTS_BY_PROVINCE[province]
      ? ["All", ...DISTRICTS_BY_PROVINCE[province]]
      : ["All"];
  const municipalities =
    district !== "All" && MUNICIPALITIES_BY_DISTRICT[district]
      ? ["All", ...MUNICIPALITIES_BY_DISTRICT[district]]
      : ["All"];

  // Combine static and real wildfire data
  const allPredictions = useMemo(() => {
    if (useRealWildfireData && type === "Wildfire" && wildfireData.length > 0) {
      // Use real wildfire data from Neon database
      return wildfireData;
    }
    // Use static predictions
    return PREDICTIONS;
  }, [useRealWildfireData, type, wildfireData]);

  const filtered = useMemo(() => {
    return allPredictions.filter((p) => {
      if (type !== "All" && p.type !== type) return false;
      if (province !== "All" && p.province !== province) return false;
      if (district !== "All" && p.district !== district) return false;
      if (municipality !== "All" && p.municipality !== municipality)
        return false;
      if (date && p.date !== date) return false;
      return true;
    });
  }, [allPredictions, type, province, district, municipality, date]);

  const handleMarkerClick = useCallback((p) => setSelected(p), []);

  const counts = {
    extreme: filtered.filter(
      (p) => p.severity === "extreme" || p.severity === "critical",
    ).length, // Include old "critical"
    high: filtered.filter((p) => p.severity === "high").length,
    medium: filtered.filter(
      (p) => p.severity === "medium" || p.severity === "moderate",
    ).length, // Include old "moderate"
    low: filtered.filter((p) => p.severity === "low").length,
    minimal: filtered.filter((p) => p.severity === "minimal").length,
    total: filtered.length,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div className="animate-slide-up-fade">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200">
                <Brain className="h-4 w-4 text-emerald-600" />
              </span>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-600">
                AI PREDICTION ENGINE
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 sm:text-4xl lg:text-5xl tracking-tight">
              Disaster <span className="text-emerald-500">Risk Forecast</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl">
              Machine Learning powered local-level disaster risk forecasting for
              Nepal, analyzing multiple environmental factors in real-time.
            </p>
          </div>

          {/* Stats */}
          {/* <div className="flex flex-wrap gap-4 animate-slide-up-fade delay-100">
            {[
              {
                label: "EXTREME",
                value: counts.extreme,
                color: "text-red-600",
                bg: "bg-red-50",
                border: "border-red-100",
              },
              { 
                label: "HIGH", 
                value: counts.high, 
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-100",
              },
              {
                label: "MEDIUM",
                value: counts.medium,
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-100",
              },
              { 
                label: "TOTAL ALERT", 
                value: counts.total, 
                color: "text-slate-800",
                bg: "bg-slate-100",
                border: "border-slate-200",
              },
            ].map((s) => (
              <div key={s.label} className={`flex flex-col items-center justify-center rounded-2xl border ${s.border} ${s.bg} px-5 py-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}>
                <div className={`text-2xl font-black font-mono ${s.color}`}>
                  {s.value}
                </div>
                <div className="mt-1 text-[9px] font-mono tracking-widest text-slate-500 font-bold">
                  {s.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm mb-8 animate-slide-up-fade delay-200 transition-all hover:shadow-md hover:border-emerald-200">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200">
              <Filter className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-600">
              FILTER PREDICTIONS
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
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
            <div className="w-full">
              <label className="block text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all hover:border-emerald-300"
              />
            </div>
            <div className="w-full">
              <button
                onClick={() => {
                  setType("All");
                  setProvince("All");
                  setDistrict("All");
                  setMunicipality("All");
                  setDate("");
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold tracking-wider text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
              >
                RESET FILTERS
              </button>
            </div>
          </div>
        </div>

        {/* Wildfire data status banner — visible only when Wildfire type is active */}
        {type === "Wildfire" && (
          <div className="mb-4">
            {wildfireLoading && (
              <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                {/* Animated spinner */}
                <svg
                  className="h-4 w-4 animate-spin flex-none"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Fetching live wildfire predictions from the database…
              </div>
            )}

            {wildfireError && !wildfireLoading && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 flex-none mt-0.5" />
                <span>{wildfireError}</span>
              </div>
            )}
          </div>
        )}

        {/* Map */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm animate-slide-up-fade delay-300 transition-all hover:shadow-md hover:border-emerald-200">
          {/* Map loading skeleton — overlays the map while fetching */}
          {wildfireLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl">
              <svg
                className="h-10 w-10 animate-spin text-emerald-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-sm font-bold text-slate-600">
                Loading wildfire data…
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-12 animate-pulse rounded-full bg-slate-200"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="h-[500px] lg:h-[600px] w-full bg-slate-50/50">
            <NepalMap data={filtered} onMarkerClick={handleMarkerClick} />
          </div>

          {/* Legend overlay */}
          <div className="absolute left-4 top-4 z-[5] rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-mono font-bold tracking-widest text-slate-500">
                SEVERITY INDEX
              </span>
            </div>
            <div className="space-y-2.5">
              {[
                {
                  label: "High",
                  color: "bg-red-500",
                  text: "text-red-700",
                  bg: "bg-red-50",
                },
                {
                  label: "Medium",
                  color: "bg-orange-500",
                  text: "text-orange-700",
                  bg: "bg-orange-50",
                },
                {
                  label: "Low",
                  color: "bg-amber-400",
                  text: "text-amber-700",
                  bg: "bg-amber-50",
                },
                // { label: "Low (50-80%)", color: "bg-blue-400", text: "text-blue-600", bg: "bg-blue-50" },
                {
                  label: "Minimal",
                  color: "bg-gray-400",
                  text: "text-gray-600",
                  bg: "bg-gray-50",
                },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md ${l.bg}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${l.color} shadow-sm`}
                    />
                  </span>
                  <span className={`text-xs font-semibold ${l.text}`}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results count */}
          {/* <div className="absolute right-4 top-4 z-[5] flex items-center gap-2 rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-lg">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="font-mono text-sm text-gray-900 font-black">
              {counts.total}
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500">
              TRACKED AREAS
            </span>
          </div> */}
        </div>

        {/* AI Info Cards */}
        {/* <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-slide-up-fade delay-400">
          {[
            {
              icon: Brain,
              title: "ML Model Ensemble",
              desc: "Random Forest + LSTM ensemble analyzing 12 environmental variables including rainfall, soil moisture, slope gradient, and historical patterns.",
              color: "text-purple-600",
              bg: "bg-purple-50",
              border: "border-purple-200 hover:border-purple-300",
            },
            {
              icon: Layers,
              title: "Data Sources",
              desc: "DHM real-time weather stations, NASA SRTM terrain data, USGS seismic feeds, and NDRRMA historical disaster database (2015-2026).",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-200 hover:border-emerald-300",
            },
            {
              icon: BarChart3,
              title: "Validation Score",
              desc: "93.2% validation accuracy on historical data. Predictions updated every 6 hours. Local-level granularity for all 753 local governments.",
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-200 hover:border-blue-300",
            },
          ].map((card) => (
            <div key={card.title} className={`group rounded-2xl border ${card.border} bg-gray-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg`}>
              <div className={`mb-4 inline-flex rounded-xl ${card.bg} p-3 transition-transform group-hover:scale-110 border border-white`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-[12px] leading-relaxed text-slate-500">
                {card.desc}
              </p>
            </div>
          ))}
        </div> */}
      </div>

      <DetailPopup item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
