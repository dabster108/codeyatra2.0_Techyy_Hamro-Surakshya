"use client";

import { useState } from "react";
import { Search, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { District } from "@/lib/data";
import { useRelational } from "@/components/providers/relational-provider";

interface DistrictTableProps {
  provinceId: string;
  districts: District[];
}

export function DistrictTable({ provinceId, districts }: DistrictTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { getDistrictFinancials } = useRelational();

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) return `NPR ${(amount / 1_000_000_000).toFixed(2)}B`;
    if (amount >= 1_000_000) return `NPR ${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `NPR ${(amount / 1_000).toFixed(2)}K`;
    return `NPR ${amount.toLocaleString()}`;
  };

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-card border border-slate-300">
      <div className="px-4 py-3 border-b border-slate-300 flex items-center justify-between bg-slate-50">
        <h3 className="text-sm font-bold text-slate-800 uppercase">District Fund Tracking</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input 
              type="text" 
              placeholder="Search District..." 
              className="pl-7 pr-2 py-1 bg-white border border-slate-300 rounded text-xs outline-none focus:border-[#003893]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-3 py-1 bg-[#003893] text-white rounded text-[10px] font-bold uppercase tracking-wider">
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">District Name</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Total Fund Allocated</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Total Fund Used</th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Remaining Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredDistricts.map((d) => {
              const { used, remaining } = getDistrictFinancials(d.id);
              // Use mock data if no relational data exists yet for demo purposes
              const displayUsed = used > 0 ? used : d.used;
              const displayRemaining = used > 0 ? remaining : d.remaining;

              return (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">{formatCurrency(d.allocated)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">{formatCurrency(displayUsed)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(displayRemaining)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
