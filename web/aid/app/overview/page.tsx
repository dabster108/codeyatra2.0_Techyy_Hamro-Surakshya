"use client";

import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ProvinceTable } from "@/components/dashboard/province-table";
import { ShieldCheck } from "lucide-react";
import { BeneficiaryRegistration } from "@/components/dashboard/beneficiary-registration";

export default function OverviewPage() {
  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">National Overview</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Active Transparency Monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-[#003893] uppercase">
            <ShieldCheck size={12} />
            Verified Registry
          </div>
          <BeneficiaryRegistration />
        </div>
      </div>

      {/* Top Level Cards */}
      <SummaryCards />

      {/* Main Table Section */}
      <div className="pt-4">
        <ProvinceTable />
      </div>
    </div>
  );
}
