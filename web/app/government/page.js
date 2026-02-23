"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Landmark, TrendingUp, Users, AlertTriangle, ArrowUpRight,
  DollarSign, Building2, ChevronDown, X, Send, Shield,
  BarChart3, MapPin, RefreshCw,
} from "lucide-react";
import { getNationalDashboard, getAllProvinces, getRecentAid } from "../lib/government-api";

const fmtNPR = (n) => {
  if (n >= 1_000_000_000) return `NPR ${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `NPR ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `NPR ${(n / 1_000).toFixed(2)}K`;
  return `NPR ${n.toLocaleString()}`;
};
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

export default function GovernmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showDistribute, setShowDistribute] = useState(false);
  const [distProvince, setDistProvince] = useState("Koshi");
  const [distAmount, setDistAmount] = useState("");
  const [distributions, setDistributions] = useState([]);
  
  // Dynamic data state
  const [nationalData, setNationalData] = useState(null);
  const [provincesData, setProvincesData] = useState([]);
  const [recentAid, setRecentAid] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const PROVINCES = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];

  // Fetch dashboard data
  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const [national, provinces, aid] = await Promise.all([
        getNationalDashboard(),
        getAllProvinces(),
        getRecentAid(8),
      ]);
      
      setNationalData(national);
      setProvincesData(provinces);
      setRecentAid(aid);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setDataLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "government")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === "government") {
      fetchDashboardData();
    }
  }, [user]);

  if (loading || !user || user.role !== "government") return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  if (dataLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading dashboard data...</p>
      </div>
    </div>
  );

  const totalAffected = provincesData.reduce((s, p) => s + (p.affected || 0), 0);
  const totalDisasters = provincesData.reduce((s, p) => s + (p.disasters || 0), 0);

  const handleDistribute = () => {
    if (!distAmount || isNaN(Number(distAmount))) return;
    setDistributions((prev) => [...prev, {
      id: Date.now(),
      province: distProvince,
      amount: Number(distAmount),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("en-GB", { hour12: false }).slice(0, 5),
    }]);
    setDistAmount("");
    setShowDistribute(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-blue-400">CENTRAL COMMAND</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Government Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 font-mono">
              Operator: {user.name} — FY {nationalData?.fiscal_year || "2082/83"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchDashboardData(true)} disabled={refreshing}
              className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 px-4 py-2.5 text-sm font-bold tracking-wider text-gray-700 hover:bg-gray-200 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
              {refreshing ? 'REFRESHING...' : 'REFRESH'}
            </button>
            <button onClick={() => setShowDistribute(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 px-5 py-2.5 text-sm font-bold tracking-wider text-white hover:bg-emerald-500">
              <Send className="h-4 w-4" /> ALLOCATE FUNDS
            </button>
          </div>
        </div>

        {/* National stats */}
        <div className="grid grid-cols-2 gap-px bg-gray-200 sm:grid-cols-5 mb-8">
          {[
            { label: "TOTAL BUDGET", value: fmtNPR(nationalData?.total || 0), color: "text-gray-900", icon: DollarSign },
            { label: "ALLOCATED", value: fmtNPR(nationalData?.allocated || 0), color: "text-emerald-400", icon: TrendingUp },
            { label: "DISBURSED", value: fmtNPR(nationalData?.disbursed || 0), color: "text-blue-400", icon: ArrowUpRight },
            { label: "DISASTERS", value: totalDisasters, color: "text-amber-400", icon: AlertTriangle },
            { label: "AFFECTED", value: totalAffected.toLocaleString(), color: "text-red-400", icon: Users },
          ].map((s) => (
            <div key={s.label} className="bg-white p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs font-mono tracking-widest text-gray-500">{s.label}</span>
              </div>
              <p className={`text-lg font-black font-mono ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Budget utilization bars */}
        <div className="border border-gray-200 bg-white p-5 mb-8">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            National Budget Utilization
          </h2>
          <div className="space-y-3">
            {[
              { label: "Allocated / Total", value: pct(nationalData?.allocated || 0, nationalData?.total || 1), a: fmtNPR(nationalData?.allocated || 0), b: fmtNPR(nationalData?.total || 0) },
              { label: "Disbursed / Allocated", value: pct(nationalData?.disbursed || 0, nationalData?.allocated || 1), a: fmtNPR(nationalData?.disbursed || 0), b: fmtNPR(nationalData?.allocated || 0) },
              { label: "Disbursed / Total", value: pct(nationalData?.disbursed || 0, nationalData?.total || 1), a: fmtNPR(nationalData?.disbursed || 0), b: fmtNPR(nationalData?.total || 0) },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-gray-500">{bar.label}</span>
                  <span className="text-xs font-mono text-gray-500">{bar.a} / {bar.b}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-800">
                    <div className={`h-full transition-all ${bar.value >= 80 ? "bg-emerald-500" : bar.value >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${bar.value}%` }} />
                  </div>
                  <span className={`w-10 text-right text-xs font-mono font-bold ${bar.value >= 80 ? "text-emerald-400" : bar.value >= 50 ? "text-amber-400" : "text-red-400"}`}>
                    {bar.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Province allocation table */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" />
              Province Fund Allocation
            </h2>
            <div className="border border-gray-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-mono font-bold tracking-widest text-gray-500">PROVINCE</th>
                    <th className="px-4 py-3 text-right text-xs font-mono font-bold tracking-widest text-gray-500">ALLOCATED</th>
                    <th className="px-4 py-3 text-right text-xs font-mono font-bold tracking-widest text-gray-500">DISBURSED</th>
                    <th className="px-4 py-3 text-center text-xs font-mono font-bold tracking-widest text-gray-500">UTIL %</th>
                    <th className="px-4 py-3 text-right text-xs font-mono font-bold tracking-widest text-gray-500">EVENTS</th>
                    <th className="px-4 py-3 text-right text-xs font-mono font-bold tracking-widest text-gray-500">AFFECTED</th>
                  </tr>
                </thead>
                <tbody>
                  {provincesData.map((province) => {
                    const util = pct(province.disbursed, province.allocated);
                    return (
                      <tr key={province.province} className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-bold text-gray-900">{province.province}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gray-900">{fmtNPR(province.allocated)}</td>
                        <td className="px-4 py-3 text-right font-mono text-gray-900">{fmtNPR(province.disbursed)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-800">
                              <div className={`h-full ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${util}%` }} />
                            </div>
                            <span className={`text-xs font-mono font-bold ${util >= 80 ? "text-emerald-400" : util >= 60 ? "text-amber-400" : "text-red-400"}`}>
                              {util}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-amber-400">{province.disasters || 0}</td>
                        <td className="px-4 py-3 text-right font-mono text-red-400">{(province.affected || 0).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Local distributions */}
            {distributions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-500" />
                  Session Distributions
                </h3>
                <div className="space-y-2">
                  {distributions.map((d) => (
                    <div key={d.id} className="flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 bg-emerald-400" />
                        <span className="text-sm font-bold text-gray-900">{d.province}</span>
                        <span className="text-xs font-mono text-gray-500">{d.date} {d.time}</span>
                      </div>
                      <span className="font-mono text-base font-bold text-emerald-400">{fmtNPR(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Aid Dispatches */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Recent Aid Dispatches
            </h2>
            <div className="space-y-2">
              {recentAid.map((r) => {
                const st = r.status === "delivered" ? "text-emerald-400" : r.status === "in-transit" ? "text-amber-400" : "text-blue-400";
                return (
                  <div key={r.id} className="border border-gray-200 bg-white p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-gray-900 truncate pr-2">{r.recipient}</span>
                      <span className={`text-xs font-mono font-bold ${st}`}>{r.status.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                      <span>{r.district}, {r.province}</span>
                      <span>{r.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Modal */}
      {showDistribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowDistribute(false)}>
          <div className="w-full max-w-md border border-gray-200 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 p-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">Allocate Funds</h2>
                <p className="text-xs font-mono text-gray-500 mt-0.5">Distribute budget to province</p>
              </div>
              <button onClick={() => setShowDistribute(false)}
                className="flex h-8 w-8 items-center justify-center border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-500 mb-1.5">TARGET PROVINCE</label>
                <div className="relative">
                  <select value={distProvince} onChange={(e) => setDistProvince(e.target.value)}
                    className="w-full appearance-none border border-gray-200 bg-gray-50 px-3 py-2.5 pr-8 text-sm text-gray-900 focus:border-emerald-500/50 focus:outline-none">
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-gray-500 mb-1.5">AMOUNT (NPR)</label>
                <input type="number" value={distAmount} onChange={(e) => setDistAmount(e.target.value)}
                  placeholder="e.g. 50000000"
                  className="w-full border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-emerald-500/50 focus:outline-none" />
                {distAmount && !isNaN(Number(distAmount)) && Number(distAmount) > 0 && (
                  <p className="mt-1 text-xs font-mono text-emerald-400">{fmtNPR(Number(distAmount))}</p>
                )}
              </div>
              <button onClick={handleDistribute} disabled={!distAmount || isNaN(Number(distAmount)) || Number(distAmount) <= 0}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 py-3 text-sm font-bold tracking-wider text-white hover:bg-emerald-500 disabled:opacity-30">
                <Send className="h-4 w-4" /> CONFIRM ALLOCATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
