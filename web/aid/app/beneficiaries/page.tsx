"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Database, 
  CheckCircle2,
  MapPin,
  CreditCard
} from "lucide-react";
import { useRelational } from "@/components/providers/relational-provider";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { BeneficiaryRegistration } from "@/components/dashboard/beneficiary-registration";

export default function BeneficiariesPage() {
  const { fiscalYear } = useDashboard();
  const { beneficiaries, reliefDistributions } = useRelational();

  // Search/Filter State
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => 
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.citizenshipNumber.includes(searchTerm)
    );
  }, [beneficiaries, searchTerm]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) return `NPR ${(amount / 1_000_000_000).toFixed(2)}B`;
    if (amount >= 1_000_000) return `NPR ${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `NPR ${(amount / 1_000).toFixed(2)}K`;
    return `NPR ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Beneficiaries</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Consolidated National Relief Registry</p>
        </div>
        <BeneficiaryRegistration />
      </div>

      {/* Registry Tools */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search Registry by Name or Citizenship..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded text-xs font-bold outline-none focus:border-[#003893] shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">TOTAL RECORDS: {filteredBeneficiaries.length}</span>
          <div className="h-4 w-[1px] bg-slate-200" />
          <Database size={16} className="text-slate-300" />
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-300 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Beneficiary Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Name & ID</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Location Details</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Relief Status</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">Assigned Officer</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBeneficiaries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                      <Users size={48} />
                      <p className="text-xs font-bold uppercase italic">No records found in the relief database.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBeneficiaries.map((b) => {
                const dist = reliefDistributions.find(d => d.beneficiaryId === b.id);
                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4">
                      <p className="font-black text-slate-900 text-sm leading-tight">{b.fullName}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <CreditCard size={10} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500">{b.citizenshipNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#003893] uppercase">
                        <MapPin size={12} className="text-[#DC143C]" />
                        {b.provinceId.toUpperCase()} / {b.districtId.toUpperCase().replace(/-/g, " ")}
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Ward No. {b.wardNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      {dist ? (
                        <div className="space-y-1">
                          <p className="text-xs font-black text-emerald-600 leading-none">{formatCurrency(dist.amount)}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded border border-emerald-100 uppercase">
                              {dist.disasterType}
                            </span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">{dist.reliefType}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500 uppercase italic">Awaiting Allocation</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                          {dist?.officerName?.charAt(0) || "O"}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-700 uppercase leading-none">{dist?.officerName || "ADMIN"}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">ID: {dist?.officerId || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-900 uppercase">
                          <CheckCircle2 size={10} className="text-emerald-500" />
                          RECORDED
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
