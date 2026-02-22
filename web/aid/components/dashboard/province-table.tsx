"use client";

import { useState, useMemo } from "react";
import { Search, Download, ChevronUp, ChevronDown, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDashboard } from "../providers/dashboard-provider";
import { useRelational } from "../providers/relational-provider";
import { fiscalYearData } from "@/lib/data";

export function ProvinceTable() {
  const { fiscalYear } = useDashboard();
  const { getProvinceFinancials } = useRelational();
  const yearData = fiscalYearData[fiscalYear].provinces;
  
  const data = useMemo(() => {
    return Object.keys(yearData).map(id => {
      const p = yearData[id];
      const financials = getProvinceFinancials(id);
      return {
        id,
        name: p.name,
        allocated: p.allocatedToDistricts,
        used: financials.used,
        remaining: financials.remaining,
        pct: Math.round((financials.used / p.allocatedToDistricts) * 100)
      };
    });
  }, [fiscalYear, yearData, getProvinceFinancials]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key as keyof typeof a];
    const bValue = b[key as keyof typeof b];
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  }).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="dashboard-card border border-slate-300">
      <div className="px-4 py-3 border-b border-slate-300 flex items-center justify-between bg-slate-50">
        <h3 className="text-sm font-bold text-slate-800 uppercase">Provincial Fund Allocation</h3>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search..." 
            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs outline-none shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="px-3 py-1 bg-[#003893] text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-sm hover:bg-[#002d75] transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-700" onClick={() => handleSort("name")}>Province Name</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Total Fund Received</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Total Fund Used</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Remaining</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((row) => (
              <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <Link 
                    href={`/provinces/${row.id}`}
                    className="font-bold text-slate-900 text-sm hover:text-[#003893] transition-colors"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs font-bold text-slate-600">{formatCurrency(row.allocated)}</td>
                <td className="px-4 py-3 text-xs font-bold text-slate-600">{formatCurrency(row.used)}</td>
                <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(row.remaining)}</td>
                <td className="px-4 py-3 text-right">
                  <Link 
                    href={`/provinces/${row.id}`}
                    className="inline-block px-3 py-1 bg-[#003893] text-white rounded text-[10px] font-bold uppercase shadow-sm hover:translate-y-[-1px] transition-all"
                  >
                    Analyze
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-300 flex items-center justify-between text-[10px] font-bold text-slate-500">
        <div>Verified National Registry System</div>
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">Prev</button>
          <button className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
