"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Building2 } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { fiscalYearData } from "@/lib/data";
import { ProvinceSummaryCards } from "@/components/province/summary-cards";
import { DistrictTable } from "@/components/province/district-table-relational";
import { BeneficiaryRegistration } from "@/components/dashboard/beneficiary-registration";
import { useRelational } from "@/components/providers/relational-provider";

export default function ProvinceDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const { fiscalYear } = useDashboard();
  const { getProvinceFinancials } = useRelational();

  const province = useMemo(() => {
    return fiscalYearData[fiscalYear].provinces[id as string];
  }, [fiscalYear, id]);

  const { used, remaining } = getProvinceFinancials(id as string);
  
  // Dynamic updates for dashboard
  const displayUsed = used > 0 ? used : (province?.used || 0);
  const displayRemaining = used > 0 ? remaining : (province?.remaining || 0);

  if (!province) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Building2 size={48} className="text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">Province Not Found</h2>
        <button 
          onClick={() => router.push("/")}
          className="text-[#003893] font-semibold hover:underline"
        >
          Return to National Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Province Header */}
      <section className="border-b border-slate-300 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{province.name}</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Provincial Relational Dashboard</p>
        </div>
        <BeneficiaryRegistration defaultProvinceId={id as string} />
      </section>

      {/* Section 1: Summary Cards */}
      <ProvinceSummaryCards 
        provinceName={province.name}
        data={{
          received: province.receivedFromNDRRMA,
          allocated: province.allocatedToDistricts,
          used: displayUsed,
          remaining: displayRemaining,
          utilization: Math.round((displayUsed / (province.allocatedToDistricts || 1)) * 100),
          totalDistricts: province.districts.length
        }} 
      />

      {/* Section 2: District Table (Relational Hierarchy) */}
      <div className="pt-2">
        <DistrictTable 
          provinceId={id as string}
          districts={province.districts} 
        />
      </div>

      {/* Accountability Statement */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-slate-600 text-xs text-center border-t-4 border-t-[#003893]">
        Relational Tracking System Version 2.0 - Active Audit Trail
      </div>
    </div>
  );
}
