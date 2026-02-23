"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Landmark, TrendingUp, Users, AlertTriangle, ArrowUpRight,
  DollarSign, Building2, ChevronDown, X, Send, Shield,
  BarChart3, MapPin,
} from "lucide-react";
import {
  NATIONAL_BUDGET, PROVINCE_BUDGETS, AID_RECORDS, PROVINCES,
} from "../data/budget";

const fmtNPR = (n) => `NPR ${(n / 1_000_000_000).toFixed(2)}B`;
const fmtNPRm = (n) => n >= 1_000_000 ? `NPR ${(n / 1_000_000).toFixed(1)}M` : `NPR ${n.toLocaleString()}`;
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8005";

export default function GovernmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showDistribute, setShowDistribute] = useState(false);
  const [distProvince, setDistProvince] = useState("Koshi");
  const [distAmount, setDistAmount] = useState("");
  const [distributions, setDistributions] = useState([]);
  
  // Real data state
  const [nationalRes, setNationalRes] = useState(null);
  const [provStats, setProvStats] = useState([]);
  const [aidRecords, setAidRecords] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [sumResRaw, recResRaw] = await Promise.all([
          fetch(`${BASE}/public/summary`),
          fetch(`${BASE}/records/get-all-records`)
        ]);
        const sumRes = await sumResRaw.json();
        const recRes = await recResRaw.json();

        setNationalRes({
          ...sumRes,
          total_budget: 12500000000, // Maintaining the fixed hypothetical central ceiling unless returned by API
        });

        // Map live province groupings
        const provMap = {};
        PROVINCES.forEach(p => provMap[p] = { allocated: 0, distributed: 0, disasters: 0, affected: 0 });
        if (recRes.by_province) {
          recRes.by_province.forEach(p => {
             const matchedK = PROVINCES.find(prov => prov.toLowerCase() === (p.province || "").toLowerCase());
             if (matchedK && provMap[matchedK]) {
                 provMap[matchedK].distributed = p.total_amount;
                 provMap[matchedK].affected = p.record_count; 
             }
          });
        }
        
        // Setup equitable proportional allocations
        const totalAlloc = sumRes.total_allocated || 500000000;
        const baseAllocPerProv = totalAlloc / PROVINCES.length;
        Object.keys(provMap).forEach((p) => {
             provMap[p].allocated = baseAllocPerProv + (provMap[p].distributed * 1.5); 
        });
        
        setProvStats(Object.entries(provMap).map(([k,v]) => ({ province: k, ...v })));

        if (recRes.recent_records) {
             setAidRecords(recRes.recent_records.map(r => ({
                id: r.id,
                recipient: r.full_name || "Unknown",
                type: "money",
                amount: r.relief_amount,
                unit: "NPR",
                province: PROVINCES.find(prov => prov.toLowerCase() === (r.province || "").toLowerCase()) || r.province,
                district: r.district,
                date: new Date(r.created_at).toISOString().split('T')[0],
                status: "delivered", // Processed from backend
             })));
        }
      } catch (err) {
        console.error("Dashboard fetching failed", err);
      } finally {
        setFetching(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "government")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "government") return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  const totalAffected = nationalRes?.total_beneficiaries || Object.values(provStats).reduce((s, p) => s + p.affected, 0) || 0;
  const totalDisasters = aidRecords.length > 0 ? Array.from(new Set(aidRecords.map(a => a.disaster_type))).length : 0;
  const recentAid = aidRecords.slice(0, 8);

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
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8 animate-slide-up-fade">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 border border-blue-200 shadow-sm">
                <Landmark className="h-4 w-4 text-blue-600" />
              </span>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-600">CENTRAL COMMAND</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Government Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Operator: <span className="font-bold text-gray-700">{user.name}</span> — FY 2082/83
            </p>
          </div>
          <button onClick={() => setShowDistribute(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md">
            <Send className="h-4 w-4 text-emerald-400" /> ALLOCATE FUNDS
          </button>
        </div>

        {/* National stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mb-8 animate-slide-up-fade delay-100">
          {[
            { label: "TOTAL BUDGET", value: fmtNPR(nationalRes?.total_budget || 12500000000), color: "text-slate-900", iconColor: "text-slate-600", bg: "bg-white", iconBg: "bg-slate-100", border: "border-gray-200", icon: DollarSign },
            { label: "ALLOCATED", value: fmtNPR(nationalRes?.total_allocated || 0), color: "text-emerald-700", iconColor: "text-emerald-600", bg: "bg-emerald-50", iconBg: "bg-white", border: "border-emerald-200", icon: TrendingUp },
            { label: "DISTRIBUTED", value: fmtNPR(nationalRes?.total_used || 0), color: "text-blue-700", iconColor: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-white", border: "border-blue-200", icon: ArrowUpRight },
            { label: "DISASTERS", value: totalDisasters, color: "text-amber-700", iconColor: "text-amber-600", bg: "bg-amber-50", iconBg: "bg-white", border: "border-amber-200", icon: AlertTriangle },
            { label: "AFFECTED", value: totalAffected.toLocaleString(), color: "text-red-700", iconColor: "text-red-600", bg: "bg-red-50", iconBg: "bg-white", border: "border-red-200", icon: Users },
          ].map((s, idx) => (
            <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`} style={{ animationDelay: `${idx * 100 + 100}ms` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg} shadow-sm border ${s.border}`}>
                  <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">{s.label}</span>
              </div>
              <p className={`text-xl font-black font-mono tracking-tight ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Budget utilization bars */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8 animate-slide-up-fade delay-300">
          <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </div>
            National Budget Utilization
          </h2>
          <div className="space-y-6">
            {[
              { label: "Allocated / Total Budget", value: pct(nationalRes?.total_allocated, nationalRes?.total_budget || 12500000000), a: fmtNPR(nationalRes?.total_allocated || 0), b: fmtNPR(nationalRes?.total_budget || 12500000000) },
              { label: "Distributed / Allocated", value: pct(nationalRes?.total_used, nationalRes?.total_allocated), a: fmtNPR(nationalRes?.total_used || 0), b: fmtNPR(nationalRes?.total_allocated || 0) },
              { label: "Distributed / Total Budget", value: pct(nationalRes?.total_used, nationalRes?.total_budget || 12500000000), a: fmtNPR(nationalRes?.total_used || 0), b: fmtNPR(nationalRes?.total_budget || 12500000000) },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">{bar.label}</span>
                  <span className="text-[11px] font-mono font-bold tracking-tight text-slate-400">{bar.a} <span className="text-slate-300">/</span> {bar.b}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 rounded-full bg-gray-100 shadow-inner overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ease-out ${bar.value >= 80 ? "bg-emerald-500" : bar.value >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.max(bar.value, 1)}%` }} />
                  </div>
                  <span className={`w-12 text-right text-sm font-black font-mono ${bar.value >= 80 ? "text-emerald-500" : bar.value >= 50 ? "text-amber-500" : "text-red-500"}`}>
                    {bar.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] animate-slide-up-fade delay-500">
          {/* Province allocation table */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200 shadow-sm">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">
                Province Fund Allocation
              </h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-5 py-4 text-left text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">PROVINCE</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">ALLOCATED</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">DISTRIBUTED</th>
                    <th className="px-5 py-4 text-center text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">UTIL %</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">EVENTS</th>
                    <th className="px-5 py-4 text-right text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">AFFECTED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {provStats.map((prov) => {
                    const util = pct(prov.distributed, prov.allocated);
                    return (
                      <tr key={prov.province} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="font-bold text-gray-900 leading-none pb-px">{prov.province}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-mono font-semibold text-gray-600">{fmtNPR(prov.allocated)}</td>
                        <td className="px-5 py-4 text-right font-mono font-semibold text-gray-900">{fmtNPR(prov.distributed)}</td>
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
                        <td className="px-5 py-4 text-right font-mono font-bold text-amber-600">{prov.disasters}</td>
                        <td className="px-5 py-4 text-right font-mono font-bold text-rose-600">{prov.affected.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Local distributions */}
            {distributions.length > 0 && (
              <div className="mt-8 p-5 rounded-bl-2xl rounded-br-2xl bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-600" />
                  Session Distributions
                </h3>
                <div className="space-y-3">
                  {distributions.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                        <span className="text-sm font-bold text-gray-900">{d.province}</span>
                        <span className="text-[10px] font-mono text-slate-500">{d.date} {d.time}</span>
                      </div>
                      <span className="font-mono text-sm font-black text-emerald-700">{fmtNPRm(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Aid Dispatches */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 border border-blue-200 shadow-sm">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              Recent Data Pulls (API)
            </h2>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {recentAid.length > 0 ? recentAid.map((r, i) => {
                const st = r.status === "delivered" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : r.status === "in-transit" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-blue-700 bg-blue-50 border-blue-200";
                return (
                  <div key={r.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300 animate-slide-up-fade" style={{ animationDelay: `${i * 100 + 400}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900 truncate pr-2">{r.recipient}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${st}`}>{r.status.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-500">
                      <span>{r.district}, {r.province}</span>
                      <span>{r.date}</span>
                    </div>
                  </div>
                );
              }) : (
                 <div className="flex items-center justify-center h-40 text-sm text-slate-400 font-mono">NO RECORDS FOUND</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Modal */}
      {showDistribute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowDistribute(false)}>
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-slide-up-fade" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-gray-900">Allocate Funds</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Distribute emergency budget</p>
              </div>
              <button onClick={() => setShowDistribute(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">TARGET PROVINCE</label>
                <div className="relative">
                  <select value={distProvince} onChange={(e) => setDistProvince(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-2">AMOUNT (NPR)</label>
                <input type="number" value={distAmount} onChange={(e) => setDistAmount(e.target.value)}
                  placeholder="e.g. 50000000"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-mono font-bold text-gray-900 shadow-sm placeholder:text-slate-300 placeholder:font-sans transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                {distAmount && !isNaN(Number(distAmount)) && Number(distAmount) > 0 && (
                  <p className="mt-2 text-[10px] font-mono font-bold text-emerald-600">{fmtNPRm(Number(distAmount))}</p>
                )}
              </div>
              <button onClick={handleDistribute} disabled={!distAmount || isNaN(Number(distAmount)) || Number(distAmount) <= 0}
                className="group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-900 mt-2 px-8 py-4 text-sm font-bold tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-gray-800 disabled:opacity-50 hover:shadow-lg disabled:hover:shadow-none outline-none">
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 opacity-60" />
                <Send className="h-4 w-4" /> CONFIRM ALLOCATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
