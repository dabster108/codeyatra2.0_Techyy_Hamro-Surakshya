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

export default function GovernmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showDistribute, setShowDistribute] = useState(false);
  const [distProvince, setDistProvince] = useState("Koshi");
  const [distAmount, setDistAmount] = useState("");
  const [distributions, setDistributions] = useState([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "government")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "government") return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  const totalAffected = Object.values(PROVINCE_BUDGETS).reduce((s, p) => s + p.affected, 0);
  const totalDisasters = Object.values(PROVINCE_BUDGETS).reduce((s, p) => s + p.disasters, 0);
  const recentAid = AID_RECORDS.slice(0, 8);

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
    <div className="min-h-screen bg-background cmd-grid">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="h-4 w-4 text-blue-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-blue-400">CENTRAL COMMAND</span>
            </div>
            <h1 className="text-2xl font-black text-white">Government Dashboard</h1>
            <p className="mt-1 text-xs text-muted font-mono">
              Operator: {user.name} — FY {NATIONAL_BUDGET.fiscalYear}
            </p>
          </div>
          <button onClick={() => setShowDistribute(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 px-5 py-2.5 text-xs font-bold tracking-wider text-white hover:bg-emerald-500">
            <Send className="h-4 w-4" /> ALLOCATE FUNDS
          </button>
        </div>

        {/* National stats */}
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-5 mb-8">
          {[
            { label: "TOTAL BUDGET", value: fmtNPR(NATIONAL_BUDGET.total), color: "text-white", icon: DollarSign },
            { label: "ALLOCATED", value: fmtNPR(NATIONAL_BUDGET.allocated), color: "text-emerald-400", icon: TrendingUp },
            { label: "DISBURSED", value: fmtNPR(NATIONAL_BUDGET.disbursed), color: "text-blue-400", icon: ArrowUpRight },
            { label: "DISASTERS", value: totalDisasters, color: "text-amber-400", icon: AlertTriangle },
            { label: "AFFECTED", value: totalAffected.toLocaleString(), color: "text-red-400", icon: Users },
          ].map((s) => (
            <div key={s.label} className="bg-[#0d1117] p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                <span className="text-[9px] font-mono tracking-widest text-muted">{s.label}</span>
              </div>
              <p className={`text-lg font-black font-mono ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Budget utilization bars */}
        <div className="border border-border bg-[#0d1117] p-5 mb-8">
          <h2 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            National Budget Utilization
          </h2>
          <div className="space-y-3">
            {[
              { label: "Allocated / Total", value: pct(NATIONAL_BUDGET.allocated, NATIONAL_BUDGET.total), a: fmtNPR(NATIONAL_BUDGET.allocated), b: fmtNPR(NATIONAL_BUDGET.total) },
              { label: "Disbursed / Allocated", value: pct(NATIONAL_BUDGET.disbursed, NATIONAL_BUDGET.allocated), a: fmtNPR(NATIONAL_BUDGET.disbursed), b: fmtNPR(NATIONAL_BUDGET.allocated) },
              { label: "Disbursed / Total", value: pct(NATIONAL_BUDGET.disbursed, NATIONAL_BUDGET.total), a: fmtNPR(NATIONAL_BUDGET.disbursed), b: fmtNPR(NATIONAL_BUDGET.total) },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-muted">{bar.label}</span>
                  <span className="text-[10px] font-mono text-muted">{bar.a} / {bar.b}</span>
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
            <h2 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" />
              Province Fund Allocation
            </h2>
            <div className="border border-border overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">PROVINCE</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">ALLOCATED</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">DISBURSED</th>
                    <th className="px-4 py-3 text-center text-[10px] font-mono font-bold tracking-widest text-muted">UTIL %</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">EVENTS</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">AFFECTED</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVINCES.map((prov) => {
                    const b = PROVINCE_BUDGETS[prov];
                    const util = pct(b.disbursed, b.allocated);
                    return (
                      <tr key={prov} className="border-b border-border bg-[#0d1117] hover:bg-surface-hover transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted" />
                            <span className="font-bold text-white">{prov}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-white">{fmtNPR(b.allocated)}</td>
                        <td className="px-4 py-3 text-right font-mono text-white">{fmtNPR(b.disbursed)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-800">
                              <div className={`h-full ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${util}%` }} />
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${util >= 80 ? "text-emerald-400" : util >= 60 ? "text-amber-400" : "text-red-400"}`}>
                              {util}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-amber-400">{b.disasters}</td>
                        <td className="px-4 py-3 text-right font-mono text-red-400">{b.affected.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Local distributions */}
            {distributions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <Send className="h-3.5 w-3.5 text-emerald-500" />
                  Session Distributions
                </h3>
                <div className="space-y-2">
                  {distributions.map((d) => (
                    <div key={d.id} className="flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5 p-3">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 bg-emerald-400" />
                        <span className="text-xs font-bold text-white">{d.province}</span>
                        <span className="text-[10px] font-mono text-muted">{d.date} {d.time}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-emerald-400">{fmtNPRm(d.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Aid Dispatches */}
          <div>
            <h2 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Recent Aid Dispatches
            </h2>
            <div className="space-y-2">
              {recentAid.map((r) => {
                const st = r.status === "delivered" ? "text-emerald-400" : r.status === "in-transit" ? "text-amber-400" : "text-blue-400";
                return (
                  <div key={r.id} className="border border-border bg-[#0d1117] p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate pr-2">{r.recipient}</span>
                      <span className={`text-[9px] font-mono font-bold ${st}`}>{r.status.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted">
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
          <div className="w-full max-w-md border border-border bg-[#0d1117]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-sm font-bold text-white">Allocate Funds</h2>
                <p className="text-[10px] font-mono text-muted mt-0.5">Distribute budget to province</p>
              </div>
              <button onClick={() => setShowDistribute(false)}
                className="flex h-8 w-8 items-center justify-center border border-border text-muted hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-muted mb-1.5">TARGET PROVINCE</label>
                <div className="relative">
                  <select value={distProvince} onChange={(e) => setDistProvince(e.target.value)}
                    className="w-full appearance-none border border-border bg-surface px-3 py-2.5 pr-8 text-sm text-white focus:border-emerald-500/50 focus:outline-none">
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-muted mb-1.5">AMOUNT (NPR)</label>
                <input type="number" value={distAmount} onChange={(e) => setDistAmount(e.target.value)}
                  placeholder="e.g. 50000000"
                  className="w-full border border-border bg-surface px-3 py-2.5 text-sm font-mono text-white placeholder:text-muted/50 focus:border-emerald-500/50 focus:outline-none" />
                {distAmount && !isNaN(Number(distAmount)) && Number(distAmount) > 0 && (
                  <p className="mt-1 text-[10px] font-mono text-emerald-400">{fmtNPRm(Number(distAmount))}</p>
                )}
              </div>
              <button onClick={handleDistribute} disabled={!distAmount || isNaN(Number(distAmount)) || Number(distAmount) <= 0}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 py-2.5 text-xs font-bold tracking-wider text-white hover:bg-emerald-500 disabled:opacity-30">
                <Send className="h-4 w-4" /> CONFIRM ALLOCATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
