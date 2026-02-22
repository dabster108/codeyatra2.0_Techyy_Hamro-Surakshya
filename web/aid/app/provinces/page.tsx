"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Building2, MapPin, ArrowUpRight, BarChart3, ShieldCheck } from "lucide-react";
import { fiscalYearData } from "@/lib/data";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { useRelational } from "@/components/providers/relational-provider";
import { cn } from "@/lib/utils";

export default function ProvincesPage() {
  const { fiscalYear } = useDashboard();
  const { getProvinceFinancials } = useRelational();

  const provinces = useMemo(() => {
    return Object.values(fiscalYearData[fiscalYear].provinces);
  }, [fiscalYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Provinces</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Provincial Scale Monitoring & Asset Tracking</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] font-bold text-emerald-700 uppercase">
          <ShieldCheck size={12} />
          Active Transparency
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {provinces.map((province) => {
          const { used, remaining } = getProvinceFinancials(province.id);
          const displayUsed = used > 0 ? used : province.used;
          const displayRemaining = used > 0 ? remaining : province.remaining;
          const utilization = Math.round((displayUsed / (province.allocatedToDistricts || 1)) * 100);

          return (
            <div key={province.id} className="bg-white border border-slate-300 rounded overflow-hidden flex flex-col hover:border-[#003893] transition-all group">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-lg uppercase leading-tight">{province.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={10} className="text-[#DC143C]" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{province.totalDistricts} Districts under jurisdiction</span>
                  </div>
                </div>
                <Building2 className="text-slate-200 group-hover:text-[#003893]/20 transition-colors" size={32} />
              </div>
              
              <div className="p-4 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Allocated</p>
                    <p className="text-sm font-black text-slate-900 leading-none">{formatCurrency(province.allocatedToDistricts)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Used Funds</p>
                    <p className="text-sm font-black text-[#003893] leading-none">{formatCurrency(displayUsed)}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Remaining Balance</p>
                    <p className="text-[10px] font-black text-emerald-600">{formatCurrency(displayRemaining)}</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        utilization > 80 ? "bg-[#DC143C]" : utilization > 50 ? "bg-amber-500" : "bg-[#003893]"
                      )}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 text-right mt-1 uppercase">{utilization}% Capacity Reached</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200">
                <Link 
                  href={`/provinces/${province.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-700 uppercase hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                >
                  <BarChart3 size={12} />
                  Analyze Provincial Details
                  <ArrowUpRight size={10} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-[#003893]/5 border border-[#003893]/20 rounded text-[#003893] text-[10px] font-bold text-center uppercase tracking-widest">
        Full Administrative Asset Verification Layer - 2081 v2.4
      </div>
    </div>
  );
}
