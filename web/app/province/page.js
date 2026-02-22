"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  MapPin, TrendingUp, Users, AlertTriangle, DollarSign,
  Building2, ChevronDown, X, Send, Shield, ArrowUpRight,
  Banknote, UtensilsCrossed, Tent, Shirt, Search, Filter,
  BarChart3, Home,
} from "lucide-react";
import {
  PROVINCE_BUDGETS, DISTRICT_DATA, AID_RECORDS, AID_TYPES,
} from "../data/budget";

const fmtNPR = (n) => `NPR ${(n / 1_000_000_000).toFixed(2)}B`;
const fmtNPRm = (n) => n >= 1_000_000 ? `NPR ${(n / 1_000_000).toFixed(1)}M` : `NPR ${n.toLocaleString()}`;
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const AID_ICONS = { money: Banknote, food: UtensilsCrossed, shelter: Tent, clothes: Shirt };
const AID_COLORS = {
  money: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  food: { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" },
  shelter: { text: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  clothes: { text: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
};

const STATUS_STYLE = {
  delivered:  { text: "text-emerald-400", dot: "bg-emerald-400", label: "DELIVERED" },
  "in-transit": { text: "text-amber-400", dot: "bg-amber-400", label: "IN-TRANSIT" },
  pending:    { text: "text-blue-400", dot: "bg-blue-400", label: "PENDING" },
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

  useEffect(() => {
    if (!loading && (!user || user.role !== "province")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const province = user?.province;
  const budget = province ? PROVINCE_BUDGETS[province] : null;
  const districts = province ? (DISTRICT_DATA[province] || []) : [];
  const baseAid = useMemo(() => province ? AID_RECORDS.filter((r) => r.province === province) : [], [province]);
  const allAid = [...baseAid, ...localAid];

  const filteredAid = useMemo(() => {
    return allAid.filter((r) => {
      if (aidType !== "All" && r.type !== aidType) return false;
      if (aidSearch && !r.recipient.toLowerCase().includes(aidSearch.toLowerCase()) &&
          !r.district.toLowerCase().includes(aidSearch.toLowerCase())) return false;
      return true;
    });
  }, [allAid, aidType, aidSearch]);

  useEffect(() => {
    if (districts.length > 0 && !dispDistrict) setDispDistrict(districts[0].district);
  }, [districts, dispDistrict]);

  if (loading || !user || user.role !== "province") return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  const handleDispatch = () => {
    if (!dispAmount || !dispRecipient || !dispDistrict) return;
    const unit = dispType === "money" ? "NPR" : dispType === "food" ? "packets" : dispType === "shelter" ? "tents" : "sets";
    setLocalAid((prev) => [...prev, {
      id: Date.now(),
      province,
      district: dispDistrict,
      municipality: "-",
      recipient: dispRecipient,
      type: dispType,
      amount: Number(dispAmount),
      unit,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      beneficiaries: 0,
    }]);
    setDispAmount("");
    setDispRecipient("");
    setShowDispatch(false);
  };

  return (
    <div className="min-h-screen bg-background cmd-grid">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-amber-400">PROVINCE COMMAND</span>
            </div>
            <h1 className="text-2xl font-black text-white">{province} Province</h1>
            <p className="mt-1 text-xs text-muted font-mono">Operator: {user.name}</p>
          </div>
          <button onClick={() => setShowDispatch(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 px-5 py-2.5 text-xs font-bold tracking-wider text-white hover:bg-emerald-500">
            <Send className="h-4 w-4" /> DISPATCH AID
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-px bg-border mb-6 w-fit">
          {[
            { key: "overview", label: "OVERVIEW" },
            { key: "districts", label: "DISTRICTS" },
            { key: "aid", label: "AID RECORDS" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-[10px] font-mono font-bold tracking-widest transition-colors ${
                tab === t.key ? "bg-emerald-600 text-white" : "bg-[#0d1117] text-muted hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && budget && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {[
                { label: "ALLOCATED", value: fmtNPR(budget.allocated), color: "text-emerald-400", icon: DollarSign },
                { label: "DISBURSED", value: fmtNPR(budget.disbursed), color: "text-blue-400", icon: ArrowUpRight },
                { label: "DISASTERS", value: budget.disasters, color: "text-amber-400", icon: AlertTriangle },
                { label: "AFFECTED", value: budget.affected.toLocaleString(), color: "text-red-400", icon: Users },
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

            {/* Utilization */}
            <div className="border border-border bg-[#0d1117] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-500" /> Budget Utilization
                </span>
                <span className="font-mono text-sm font-bold text-emerald-400">{pct(budget.disbursed, budget.allocated)}%</span>
              </div>
              <div className="h-3 w-full bg-gray-800">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct(budget.disbursed, budget.allocated)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-mono text-muted">
                <span>Disbursed: {fmtNPR(budget.disbursed)}</span>
                <span>Remaining: {fmtNPR(budget.allocated - budget.disbursed)}</span>
              </div>
            </div>

            {/* District quick view */}
            <div>
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-500" /> District Overview
              </h3>
              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                {districts.map((d) => {
                  const util = pct(d.disbursed, d.allocated);
                  return (
                    <div key={d.district} className="bg-[#0d1117] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-white">{d.district}</h4>
                        <span className={`text-[10px] font-mono font-bold ${util >= 80 ? "text-emerald-400" : util >= 60 ? "text-amber-400" : "text-red-400"}`}>
                          {util}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-800 mb-2">
                        <div className={`h-full ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${util}%` }} />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-muted">
                        <span>Affected: <span className="text-red-400">{d.affected.toLocaleString()}</span></span>
                        <span>Shelters: <span className="text-blue-400">{d.shelters}</span></span>
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
          <div>
            <div className="border border-border overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">DISTRICT</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">ALLOCATED</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">DISBURSED</th>
                    <th className="px-4 py-3 text-center text-[10px] font-mono font-bold tracking-widest text-muted">UTIL %</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">AFFECTED</th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">SHELTERS</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">HQ</th>
                  </tr>
                </thead>
                <tbody>
                  {districts.map((d) => {
                    const util = pct(d.disbursed, d.allocated);
                    return (
                      <tr key={d.district} className="border-b border-border bg-[#0d1117] hover:bg-surface-hover transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{d.district}</td>
                        <td className="px-4 py-3 text-right font-mono text-white">{fmtNPRm(d.allocated)}</td>
                        <td className="px-4 py-3 text-right font-mono text-white">{fmtNPRm(d.disbursed)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-14 h-1.5 bg-gray-800">
                              <div className={`h-full ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${util}%` }} />
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${util >= 80 ? "text-emerald-400" : util >= 60 ? "text-amber-400" : "text-red-400"}`}>
                              {util}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-red-400">{d.affected.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-mono text-blue-400">{d.shelters}</td>
                        <td className="px-4 py-3 text-muted">{d.municipality}</td>
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
          <div>
            {/* Filters */}
            <div className="border border-border bg-[#0d1117] p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500">FILTER AID</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                    <input value={aidSearch} onChange={(e) => setAidSearch(e.target.value)} placeholder="Recipient or district..."
                      className="w-full border border-border bg-surface pl-8 pr-3 py-2 text-xs text-white placeholder:text-muted/50 focus:border-emerald-500/50 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Type</label>
                  <div className="relative">
                    <select value={aidType} onChange={(e) => setAidType(e.target.value)}
                      className="w-full appearance-none border border-border bg-surface px-3 py-2 pr-8 text-xs text-white focus:border-emerald-500/50 focus:outline-none">
                      <option value="All">All Types</option>
                      {Object.entries(AID_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Aid Table */}
            <div className="border border-border overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">RECIPIENT</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">TYPE</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">AMOUNT</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">DISTRICT</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">DATE</th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAid.map((r) => {
                    const Icon = AID_ICONS[r.type] || Banknote;
                    const ac = AID_COLORS[r.type] || AID_COLORS.money;
                    const st = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
                    return (
                      <tr key={r.id} className="border-b border-border bg-[#0d1117] hover:bg-surface-hover transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{r.recipient}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider ${ac.text} ${ac.border} ${ac.bg}`}>
                            <Icon className="h-3 w-3" />
                            {AID_TYPES[r.type]?.label?.toUpperCase() || r.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-white">
                          {r.type === "money" ? fmtNPRm(r.amount) : `${r.amount} ${r.unit}`}
                        </td>
                        <td className="px-4 py-3 text-muted">{r.district}</td>
                        <td className="px-4 py-3 font-mono text-muted">{r.date}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 ${st.dot}`} />
                            <span className={`text-[10px] font-mono font-bold ${st.text}`}>{st.label}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredAid.length === 0 && (
                <div className="bg-[#0d1117] p-12 text-center">
                  <p className="text-sm text-muted">No records match filters</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      {showDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowDispatch(false)}>
          <div className="w-full max-w-md border border-border bg-[#0d1117]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-sm font-bold text-white">Dispatch Aid</h2>
                <p className="text-[10px] font-mono text-muted mt-0.5">{province} Province</p>
              </div>
              <button onClick={() => setShowDispatch(false)}
                className="flex h-8 w-8 items-center justify-center border border-border text-muted hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-muted mb-1.5">AID TYPE</label>
                <div className="grid grid-cols-4 gap-px bg-border">
                  {Object.entries(AID_TYPES).map(([key, val]) => {
                    const Icon = AID_ICONS[key];
                    const ac = AID_COLORS[key];
                    return (
                      <button key={key} onClick={() => setDispType(key)}
                        className={`flex flex-col items-center gap-1 p-3 text-[10px] font-mono transition-colors ${
                          dispType === key ? `${ac.bg} ${ac.text} border ${ac.border}` : "bg-[#0d1117] text-muted hover:text-white"
                        }`}>
                        <Icon className="h-4 w-4" />
                        {key.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-muted mb-1.5">TARGET DISTRICT</label>
                <div className="relative">
                  <select value={dispDistrict} onChange={(e) => setDispDistrict(e.target.value)}
                    className="w-full appearance-none border border-border bg-surface px-3 py-2.5 pr-8 text-sm text-white focus:border-emerald-500/50 focus:outline-none">
                    {districts.map((d) => <option key={d.district} value={d.district}>{d.district}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-muted mb-1.5">RECIPIENT</label>
                <input value={dispRecipient} onChange={(e) => setDispRecipient(e.target.value)} placeholder="Camp or group name"
                  className="w-full border border-border bg-surface px-3 py-2.5 text-sm text-white placeholder:text-muted/50 focus:border-emerald-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-widest text-muted mb-1.5">
                  AMOUNT {dispType === "money" ? "(NPR)" : dispType === "food" ? "(PACKETS)" : dispType === "shelter" ? "(TENTS)" : "(SETS)"}
                </label>
                <input type="number" value={dispAmount} onChange={(e) => setDispAmount(e.target.value)} placeholder="e.g. 500"
                  className="w-full border border-border bg-surface px-3 py-2.5 text-sm font-mono text-white placeholder:text-muted/50 focus:border-emerald-500/50 focus:outline-none" />
              </div>
              <button onClick={handleDispatch}
                disabled={!dispAmount || !dispRecipient || !dispDistrict}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 py-2.5 text-xs font-bold tracking-wider text-white hover:bg-emerald-500 disabled:opacity-30">
                <Send className="h-4 w-4" /> CONFIRM DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
