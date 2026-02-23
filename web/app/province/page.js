"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  MapPin, TrendingUp, Users, AlertTriangle, DollarSign,
  Building2, ChevronDown, X, Send, Shield, ArrowUpRight,
  Banknote, UtensilsCrossed, Tent, Shirt, Search, Filter,
  BarChart3, Home, RefreshCw,
} from "lucide-react";
import { getProvinceDetail, getRecentAid } from "../lib/government-api";
import { AID_TYPES } from "../data/budget";

const fmtNPR = (n) => {
  if (n >= 1_000_000_000) return `NPR ${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `NPR ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `NPR ${(n / 1_000).toFixed(2)}K`;
  return `NPR ${n.toLocaleString()}`;
};
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const PROVINCE_THEMES = {
  Koshi: {
    primary: "emerald", bg: "bg-emerald-50", text: "text-emerald-900",
    border: "border-emerald-200", ring: "ring-emerald-200",
    btn: "bg-emerald-600 hover:bg-emerald-700", icon: "text-emerald-600", light: "bg-emerald-100",
  },
  Madhesh: {
    primary: "orange", bg: "bg-orange-50", text: "text-orange-900",
    border: "border-orange-200", ring: "ring-orange-200",
    btn: "bg-orange-600 hover:bg-orange-700", icon: "text-orange-600", light: "bg-orange-100",
  },
  Bagmati: {
    primary: "blue", bg: "bg-blue-50", text: "text-blue-900",
    border: "border-blue-200", ring: "ring-blue-200",
    btn: "bg-blue-600 hover:bg-blue-700", icon: "text-blue-600", light: "bg-blue-100",
  },
  Gandaki: {
    primary: "cyan", bg: "bg-cyan-50", text: "text-cyan-900",
    border: "border-cyan-200", ring: "ring-cyan-200",
    btn: "bg-cyan-600 hover:bg-cyan-700", icon: "text-cyan-600", light: "bg-cyan-100",
  },
  Lumbini: {
    primary: "yellow", bg: "bg-yellow-50", text: "text-yellow-900",
    border: "border-yellow-200", ring: "ring-yellow-200",
    btn: "bg-yellow-600 hover:bg-yellow-700", icon: "text-yellow-600", light: "bg-yellow-100",
  },
  Karnali: {
    primary: "rose", bg: "bg-rose-50", text: "text-rose-900",
    border: "border-rose-200", ring: "ring-rose-200",
    btn: "bg-rose-600 hover:bg-rose-700", icon: "text-rose-600", light: "bg-rose-100",
  },
  Sudurpashchim: {
    primary: "purple", bg: "bg-purple-50", text: "text-purple-900",
    border: "border-purple-200", ring: "ring-purple-200",
    btn: "bg-purple-600 hover:bg-purple-700", icon: "text-purple-600", light: "bg-purple-100",
  },
};

const AID_ICONS = { money: Banknote, food: UtensilsCrossed, shelter: Tent, clothes: Shirt, medical: Shield, personnel: Users };
const AID_COLORS = {
  money: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  food: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  shelter: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  clothes: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
};
const STATUS_STYLE = {
  delivered: { text: "text-emerald-400", dot: "bg-emerald-400", label: "DELIVERED" },
  "in-transit": { text: "text-amber-400", dot: "bg-amber-400", label: "IN-TRANSIT" },
  pending: { text: "text-blue-400", dot: "bg-blue-400", label: "PENDING" },
};

export default function ProvincePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [showDispatch, setShowDispatch] = useState(false);
  const [dispType, setDispType] = useState("money");
  const [dispDistrict, setDispDistrict] = useState("");
  const [dispAmount, setDispAmount] = useState("");
  const [dispRecipient, setDispRecipient] = useState("");
  const [localAid, setLocalAid] = useState([]);
  const [aidSearch, setAidSearch] = useState("");
  const [aidType, setAidType] = useState("All");
  const [provinceData, setProvinceData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const province = user?.province;
  const theme = PROVINCE_THEMES[province] || PROVINCE_THEMES["Koshi"];

  const fetchProvinceData = async (showRefresh = false) => {
    if (!province) return;
    if (showRefresh) setRefreshing(true);
    try {
      const [detail, aid] = await Promise.all([
        getProvinceDetail(province),
        getRecentAid(20),
      ]);
      setProvinceData(detail);
      const filteredAid = aid.filter(a => a.province === province);
      const transformedAid = filteredAid.map(a => ({
        id: a.id, province: a.province, district: a.district,
        municipality: "-", recipient: a.recipient, type: "money",
        amount: a.amount, unit: "NPR", date: a.date,
        status: a.status || "delivered", beneficiaries: 1,
      }));
      setLocalAid(transformedAid);
    } catch (error) {
      console.error("Failed to fetch province data:", error);
    } finally {
      setDataLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "province")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === "province" && province) {
      fetchProvinceData();
    }
  }, [user, province]);

  const budget = provinceData?.budget || { allocated: 0, disbursed: 0, remaining: 0, utilization: 0 };
  const districts = provinceData?.districts || [];
  const allAid = localAid;

  const filteredAid = useMemo(() => {
    return allAid.filter((r) => {
      if (aidSearch && !r.recipient?.toLowerCase().includes(aidSearch.toLowerCase()) && !r.district?.toLowerCase().includes(aidSearch.toLowerCase()))
        return false;
      if (aidType !== "All" && r.type !== aidType) return false;
      return true;
    });
  }, [allAid, aidType, aidSearch]);

  useEffect(() => {
    if (districts.length > 0 && !dispDistrict)
      setDispDistrict(districts[0].district);
  }, [districts, dispDistrict]);

  const handleDispatch = async () => {
    if (!dispAmount || !dispRecipient || !dispDistrict) return;
    const payload = {
      full_name: dispRecipient,
      citizenship_no: "N/A",
      relief_amount: Number(dispAmount),
      province: province,
      district: dispDistrict,
      disaster_type: "Flood",
      officer_name: user?.name || "Unknown Officer",
      officer_id: user?.id || "PROV-ADMIN",
    };
    try {
      const res = await fetch("http://127.0.0.1:8005/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDispAmount("");
        setDispRecipient("");
        setShowDispatch(false);
        fetchProvinceData(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user || user.role !== "province") return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  if (dataLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="text-center">
        <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading province data...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} pb-16 transition-colors duration-500`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8 animate-slide-up-fade">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white ${theme.border} border shadow-sm`}>
                <MapPin className={`h-4 w-4 ${theme.icon}`} />
              </span>
              <span className={`text-[10px] font-mono font-bold tracking-[0.2em] ${theme.text} uppercase opacity-70`}>
                PROVINCE COMMAND
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{province} Province</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Operator: <span className="font-bold text-gray-700">{user.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchProvinceData(true)} disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-xs font-bold tracking-wider text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-50 transition-all">
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'REFRESHING...' : 'REFRESH'}
            </button>
            <button onClick={() => setShowDispatch(true)}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wider text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${theme.btn}`}>
              <Send className="h-4 w-4 text-white/80" /> DISPATCH AID
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 animate-slide-up-fade delay-100">
          {[
            { key: "overview", label: "OVERVIEW" },
            { key: "districts", label: "DISTRICTS" },
            { key: "aid", label: "AID RECORDS" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-xs font-bold tracking-widest rounded-xl transition-all duration-300 ${
                tab === t.key
                  ? `${theme.btn} text-white shadow-md`
                  : "bg-white border border-gray-200 text-slate-500 hover:text-gray-900 hover:border-gray-300 shadow-sm"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-6 animate-slide-up-fade delay-200">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "ALLOCATED", value: fmtNPR(budget.allocated), icon: DollarSign },
                { label: "DISBURSED", value: fmtNPR(budget.disbursed), icon: ArrowUpRight },
                { label: "DISASTERS", value: provinceData?.stats?.disasters || 0, icon: AlertTriangle },
                { label: "AFFECTED", value: (provinceData?.stats?.affected || 0).toLocaleString(), icon: Users },
              ].map((s, idx) => (
                <div key={s.label}
                  className={`rounded-2xl border ${theme.border} bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden`}
                  style={{ animationDelay: `${idx * 100 + 200}ms` }}>
                  <div className={`absolute top-0 right-0 p-4 opacity-5 ${theme.text}`}>
                    <s.icon className="w-16 h-16" />
                  </div>
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border ${theme.border}`}>
                      <s.icon className={`h-4 w-4 ${theme.icon}`} />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">{s.label}</span>
                  </div>
                  <p className="text-xl font-black font-mono tracking-tight text-gray-900 relative z-10">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Utilization */}
            <div className={`rounded-2xl border ${theme.border} bg-white p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.light} border ${theme.border}`}>
                    <BarChart3 className={`h-4 w-4 ${theme.icon}`} />
                  </div>
                  Budget Utilization
                </span>
                <span className={`font-mono text-xl font-black ${theme.text}`}>{budget.utilization}%</span>
              </div>
              <div className="h-4 w-full rounded-full bg-gray-100 shadow-inner overflow-hidden">
                <div className={`h-full transition-all duration-1000 ease-out ${theme.btn}`}
                  style={{ width: `${Math.max(budget.utilization, 1)}%` }} />
              </div>
              <div className="mt-3 flex justify-between text-xs font-mono font-medium text-slate-500">
                <span>Disbursed: <strong className="text-gray-900">{fmtNPR(budget.disbursed)}</strong></span>
                <span>Remaining: <strong className="text-gray-900">{fmtNPR(budget.remaining)}</strong></span>
              </div>
            </div>

            {/* District quick view */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className={`h-4 w-4 ${theme.icon}`} /> District Overview
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {districts.map((d) => {
                  const util = d.utilization || pct(d.disbursed, d.allocated);
                  return (
                    <div key={d.district}
                      className={`rounded-2xl border ${theme.border} bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900">{d.district}</h4>
                        <span className={`text-[10px] font-mono font-bold ${util >= 80 ? "text-emerald-600" : util >= 60 ? "text-amber-600" : "text-red-500"}`}>
                          {util}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden mb-3">
                        <div className={`h-full transition-all duration-1000 ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${Math.max(util, 1)}%` }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-medium text-slate-500">
                        <span className="bg-gray-50 px-2 py-1.5 rounded-md flex justify-between">
                          Affected: <span className="text-red-600 font-bold">{(d.affected || 0).toLocaleString()}</span>
                        </span>
                        <span className="bg-gray-50 px-2 py-1.5 rounded-md flex justify-between">
                          Events: <span className="text-amber-600 font-bold">{d.disasters || 0}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Districts Tab */}
        {tab === "districts" && (
          <div className={`rounded-2xl border ${theme.border} bg-white shadow-sm overflow-hidden animate-slide-up-fade delay-200`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">DISTRICT</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">ALLOCATED</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">DISBURSED</th>
                    <th className="px-5 py-4 text-center text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">UTIL %</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">AFFECTED</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">EVENTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {districts.map((d) => {
                    const util = d.utilization || pct(d.disbursed, d.allocated);
                    return (
                      <tr key={d.district} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">{d.district}</td>
                        <td className="px-5 py-4 text-right font-mono font-semibold text-gray-600">{fmtNPR(d.allocated)}</td>
                        <td className="px-5 py-4 text-right font-mono font-semibold text-gray-900">{fmtNPR(d.disbursed)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ease-out ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${Math.max(util, 1)}%` }} />
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${util >= 80 ? "text-emerald-600" : util >= 60 ? "text-amber-600" : "text-red-500"}`}>
                              {util}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-red-500">{(d.affected || 0).toLocaleString()}</td>
                        <td className="px-5 py-4 text-right font-mono text-amber-500">{d.disasters || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Aid Tab */}
        {tab === "aid" && (
          <div className="animate-slide-up-fade delay-200">
            <div className={`rounded-2xl border ${theme.border} bg-white p-6 shadow-sm mb-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Filter className={`h-4 w-4 ${theme.icon}`} />
                <span className={`text-[10px] font-mono font-bold tracking-[0.2em] ${theme.icon}`}>FILTER AID</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={aidSearch} onChange={(e) => setAidSearch(e.target.value)} placeholder="Recipient or district..."
                      className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">Type</label>
                  <div className="relative">
                    <select value={aidType} onChange={(e) => setAidType(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                      <option value="All">All Types</option>
                      {Object.entries(AID_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border ${theme.border} bg-white shadow-sm overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">RECIPIENT</th>
                      <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">TYPE</th>
                      <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">AMOUNT</th>
                      <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">DISTRICT</th>
                      <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">DATE</th>
                      <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAid.map((r) => {
                      const Icon = AID_ICONS[r.type] || Banknote;
                      const ac = AID_COLORS[r.type] || AID_COLORS.money;
                      const st = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
                      return (
                        <tr key={r.id} className="bg-white hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-bold text-gray-900 whitespace-nowrap">{r.recipient}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider ${ac.text} ${ac.border} ${ac.bg}`}>
                              <Icon className="h-3.5 w-3.5" />
                              {AID_TYPES[r.type]?.label?.toUpperCase() || r.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono font-bold text-gray-900">
                            {r.type === "money" ? fmtNPR(r.amount) : `${r.amount} ${r.unit}`}
                          </td>
                          <td className="px-5 py-4 text-slate-500 font-medium">{r.district}</td>
                          <td className="px-5 py-4 font-mono font-medium text-slate-400">{r.date}</td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                              <span className={`text-[10px] font-mono font-bold ${st.text}`}>{st.label}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredAid.length === 0 && (
                <div className="bg-white p-12 text-center">
                  <p className="text-sm text-slate-500">No records match filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {showDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={() => setShowDispatch(false)}>
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-slide-up-fade" onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between border-b border-gray-100 ${theme.bg} px-6 py-5`}>
              <div>
                <h2 className="text-lg font-black text-gray-900">Dispatch Aid</h2>
                <p className={`text-xs font-medium ${theme.text} mt-1`}>{province} Province</p>
              </div>
              <button onClick={() => setShowDispatch(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">AID TYPE</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(AID_TYPES).map(([key, val]) => {
                    const Icon = AID_ICONS[key];
                    const ac = AID_COLORS[key] || AID_COLORS.money;
                    return (
                      <button key={key} onClick={() => setDispType(key)}
                        className={`flex flex-col items-center gap-1 p-3 text-[10px] font-mono rounded-xl transition-all ${
                          dispType === key ? `${ac.bg} ${ac.text} border ${ac.border} shadow-sm` : "bg-gray-50 text-gray-500 hover:text-gray-900 border border-transparent"
                        }`}>
                        {Icon && <Icon className="h-4 w-4" />}
                        {key.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">TARGET DISTRICT</label>
                <div className="relative">
                  <select value={dispDistrict} onChange={(e) => setDispDistrict(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                    {districts.map((d) => <option key={d.district} value={d.district}>{d.district}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">RECIPIENT / GROUP</label>
                <input value={dispRecipient} onChange={(e) => setDispRecipient(e.target.value)} placeholder="Camp or group name"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">
                  AMOUNT {dispType === "money" ? "(NPR)" : dispType === "food" ? "(PACKETS)" : dispType === "shelter" ? "(TENTS)" : "(SETS)"}
                </label>
                <input type="number" value={dispAmount} onChange={(e) => setDispAmount(e.target.value)} placeholder="e.g. 500000"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-mono font-bold text-gray-900 shadow-sm placeholder:text-slate-300 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </div>
              <button onClick={handleDispatch} disabled={!dispAmount || !dispRecipient || !dispDistrict}
                className={`group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl ${theme.btn} mt-2 px-8 py-4 text-sm font-bold tracking-wider text-white shadow-sm transition-all duration-300 disabled:opacity-50 hover:shadow-lg disabled:hover:shadow-none outline-none`}>
                <Send className="h-4 w-4" /> CONFIRM DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
