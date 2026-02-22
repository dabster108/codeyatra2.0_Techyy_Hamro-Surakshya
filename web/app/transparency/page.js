"use client";

import { useState, useMemo } from "react";
import {
  Eye, TrendingUp, Search, ChevronDown, DollarSign,
  Users, AlertTriangle, Shield, ArrowUpRight, MapPin,
  Building2, Banknote, UtensilsCrossed, Tent, Shirt, Filter,
} from "lucide-react";
import {
  NATIONAL_BUDGET, PROVINCE_BUDGETS, AID_RECORDS, PROVINCES, AID_TYPES,
} from "../data/budget";

const fmtNPR = (n) => `NPR ${(n / 1_000_000_000).toFixed(2)}B`;
const fmtNPRm = (n) => n >= 1_000_000 ? `NPR ${(n / 1_000_000).toFixed(1)}M` : `NPR ${n.toLocaleString()}`;
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

const AID_ICONS = { money: Banknote, food: UtensilsCrossed, shelter: Tent, clothes: Shirt };
const AID_COLORS = {
  money: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  food: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  shelter: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  clothes: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
};

const STATUS_STYLE = {
  delivered:  { text: "text-emerald-400", dot: "bg-emerald-400", label: "DELIVERED" },
  "in-transit": { text: "text-amber-400", dot: "bg-amber-400", label: "IN-TRANSIT" },
  pending:    { text: "text-blue-400", dot: "bg-blue-400", label: "PENDING" },
};

export default function TransparencyPage() {
  const [search, setSearch] = useState("");
  const [filterProv, setFilterProv] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const totalAffected = Object.values(PROVINCE_BUDGETS).reduce((s, p) => s + p.affected, 0);
  const totalDisasters = Object.values(PROVINCE_BUDGETS).reduce((s, p) => s + p.disasters, 0);

  const filteredAid = useMemo(() => {
    return AID_RECORDS.filter((r) => {
      if (filterProv !== "All" && r.province !== filterProv) return false;
      if (filterType !== "All" && r.type !== filterType) return false;
      if (search && !r.recipient.toLowerCase().includes(search.toLowerCase()) &&
          !r.district.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterProv, filterType, search]);

  return (
    <div className="min-h-screen bg-background cmd-grid">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400">PUBLIC AUDIT</span>
          </div>
          <h1 className="text-2xl font-black text-white">Fund Transparency</h1>
          <p className="mt-1 text-sm text-muted">
            Real-time tracking of Nepal&apos;s disaster relief budget — FY {NATIONAL_BUDGET.fiscalYear}
          </p>
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

        {/* Utilization bar */}
        <div className="border border-border bg-[#0d1117] p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted">NATIONAL UTILIZATION</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{pct(NATIONAL_BUDGET.disbursed, NATIONAL_BUDGET.total)}%</span>
          </div>
          <div className="h-3 w-full bg-gray-800">
            <div className="relative h-full">
              <div className="absolute h-full bg-emerald-600/30" style={{ width: `${pct(NATIONAL_BUDGET.allocated, NATIONAL_BUDGET.total)}%` }} />
              <div className="absolute h-full bg-emerald-500" style={{ width: `${pct(NATIONAL_BUDGET.disbursed, NATIONAL_BUDGET.total)}%` }} />
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-[10px] text-muted font-mono">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-emerald-500" /> Disbursed</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-emerald-600/30" /> Allocated</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-gray-800" /> Unallocated</span>
          </div>
        </div>

        {/* Province breakdown */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-500" />
            Province Budget Distribution
          </h2>
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PROVINCES.map((prov) => {
              const b = PROVINCE_BUDGETS[prov];
              const util = pct(b.disbursed, b.allocated);
              return (
                <div key={prov} className="bg-[#0d1117] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-white">{prov}</h3>
                    <span className={`text-[10px] font-mono font-bold ${util >= 80 ? "text-emerald-400" : util >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {util}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 mb-3">
                    <div className={`h-full transition-all ${util >= 80 ? "bg-emerald-500" : util >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${util}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted">
                    <div>ALLOC: <span className="text-white">{fmtNPR(b.allocated)}</span></div>
                    <div>DISB: <span className="text-white">{fmtNPR(b.disbursed)}</span></div>
                    <div>EVENTS: <span className="text-amber-400">{b.disasters}</span></div>
                    <div>AFFECTED: <span className="text-red-400">{b.affected.toLocaleString()}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aid Distribution */}
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              Aid Distribution Records
            </h2>
            <span className="text-xs font-mono text-muted">{filteredAid.length} RECORDS</span>
          </div>

          {/* Aid Filters */}
          <div className="border border-border bg-[#0d1117] p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500">FILTER AID</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recipient or district..."
                    className="w-full border border-border bg-surface pl-8 pr-3 py-2 text-xs text-white placeholder:text-muted/50 focus:border-emerald-500/50 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Province</label>
                <div className="relative">
                  <select value={filterProv} onChange={(e) => setFilterProv(e.target.value)}
                    className="w-full appearance-none border border-border bg-surface px-3 py-2 pr-8 text-xs text-white focus:border-emerald-500/50 focus:outline-none">
                    <option value="All">All Provinces</option>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1.5">Aid Type</label>
                <div className="relative">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                    className="w-full appearance-none border border-border bg-surface px-3 py-2 pr-8 text-xs text-white focus:border-emerald-500/50 focus:outline-none">
                    <option value="All">All Types</option>
                    {Object.entries(AID_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">RECIPIENT</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">TYPE</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">AMOUNT</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">LOCATION</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">DATE</th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono font-bold tracking-widest text-muted">STATUS</th>
                  <th className="px-4 py-3 text-right text-[10px] font-mono font-bold tracking-widest text-muted">BENEFICIARIES</th>
                </tr>
              </thead>
              <tbody>
                {filteredAid.map((r) => {
                  const Icon = AID_ICONS[r.type] || Banknote;
                  const ac = AID_COLORS[r.type] || AID_COLORS.money;
                  const st = STATUS_STYLE[r.status] || STATUS_STYLE.pending;
                  return (
                    <tr key={r.id} className="border-b border-border bg-[#0d1117] hover:bg-surface-hover transition-colors">
                      <td className="px-4 py-3 font-mono text-muted">{String(r.id).padStart(3, "0")}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-white">{r.recipient}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider ${ac.text} ${ac.border} ${ac.bg}`}>
                          <Icon className="h-3 w-3" />
                          {AID_TYPES[r.type]?.label?.toUpperCase() || r.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {r.type === "money" ? fmtNPRm(r.amount) : `${r.amount} ${r.unit}`}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {r.district}, {r.province}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted">{r.date}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 ${st.dot}`} />
                          <span className={`text-[10px] font-mono font-bold ${st.text}`}>{st.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-white">{r.beneficiaries.toLocaleString()}</td>
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
      </div>
    </div>
  );
}
