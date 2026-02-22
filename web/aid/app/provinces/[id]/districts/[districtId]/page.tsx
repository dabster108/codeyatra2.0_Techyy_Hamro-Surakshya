"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Building2, ChevronRight, Users, AlertCircle, Wallet, TrendingUp, Search, Download } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { fiscalYearData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export default function DistrictPage() {
  const { id, districtId } = useParams();
  const router = useRouter();
  const { fiscalYear } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");

  const province = useMemo(() => fiscalYearData[fiscalYear].provinces[id as string], [fiscalYear, id]);
  const district = useMemo(() => province?.districts.find(d => d.id === districtId), [province, districtId]);

  if (!province || !district) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Building2 size={48} className="text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">District Not Found</h2>
        <button onClick={() => router.push("/")} className="text-[#003893] font-semibold hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryData = [
    { title: "Province Name", value: province.name, icon: Building2, color: "blue", desc: "Parent Province" },
    { title: "District Name", value: district.name, icon: Building2, color: "blue", desc: "Localized Jurisdiction" },
    { title: "Total Fund Received", value: formatCurrency(district.allocated), icon: Wallet, color: "blue", desc: "Received from Province" },
    { title: "Total Fund Used", value: formatCurrency(district.used), icon: TrendingUp, color: "accent", desc: "Actual expenditure reported" },
    { title: "Remaining Balance", value: formatCurrency(district.remaining), icon: AlertCircle, color: "yellow", desc: "Balance in district treasury" },
    { title: "Total Number of Wards", value: district.wards.length, icon: Users, color: "green", desc: "Wards under jurisdiction" },
  ];

  const filteredWards = district.wards.filter(w => 
    `Ward ${w.number}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header - Strictly Following Prompt */}
      <section className="border-b border-slate-300 pb-6">
        <h1 className="text-2xl font-bold text-slate-900">{district.name} District Transparency</h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{province.name}</p>
      </section>

      {/* Summary Row - 6 Cards for 6 Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryData.map((card) => (
          <div key={card.title} className="dashboard-card border border-slate-300 hover:border-slate-400 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className={cn(
                "p-2 rounded bg-slate-50",
                card.color === "blue" && "text-[#003893]",
                card.color === "green" && "text-emerald-600",
                card.color === "accent" && "text-[#DC143C]",
                card.color === "yellow" && "text-amber-600"
              )}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">{card.title}</p>
            <p className="text-xl font-bold text-slate-900">{card.value}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 italic text-[10px] text-slate-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Ward Table - Matching Screenshot Card Style */}
      <div className="dashboard-card border border-slate-300">
        <div className="px-4 py-3 border-b border-slate-300 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 uppercase">Ward Level Distribution ({district.name})</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input 
                type="text" 
                placeholder="Search Ward..." 
                className="pl-7 pr-2 py-1 bg-white border border-slate-300 rounded text-xs outline-none focus:border-[#003893]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => toast.info("Exporting Ward Report...")}
              className="px-3 py-1 bg-[#003893] text-white rounded text-[10px] font-bold uppercase tracking-wider"
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Ward Number</th>
                <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Total Fund Received</th>
                <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Total Fund Used</th>
                <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Remaining</th>
                <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">View Button</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWards.map((ward) => (
                <tr key={ward.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 font-bold text-slate-900 group-hover:text-[#003893]">Ward {ward.number}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">{formatCurrency(ward.allocated)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">{formatCurrency(ward.used)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(ward.remaining)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link 
                      href={`/provinces/${id}/districts/${districtId}/wards/${ward.id}`}
                      className="px-3 py-1 bg-[#003893] text-white rounded text-[10px] font-bold uppercase inline-block"
                    >
                      View Button
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredWards.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-xs italic">
                    No ward data available for this search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-300 flex items-center justify-between text-[10px] font-bold text-slate-500">
          <div>Verified by District Administration Office</div>
          <div className="flex gap-2 text-[10px]">
            <button className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50">Prev</button>
            <button className="px-2 py-0.5 bg-white border border-slate-300 rounded hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-slate-600 text-[11px] font-medium text-center">
        Every NPR allocated is tracked under Section 4(c) of the Disaster Management Act.
      </div>
    </div>
  );
}
