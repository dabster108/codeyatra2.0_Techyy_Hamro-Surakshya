"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Wallet,
  Users,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useDashboard } from "../providers/dashboard-provider";
import { useRelational } from "../providers/relational-provider";
import { fiscalYearData } from "@/lib/data";

interface SummaryCardProps {
  overrideData?: any[];
}

export function SummaryCards({ overrideData }: SummaryCardProps) {
  const { fiscalYear } = useDashboard();
  const {
    reliefDistributions,
    beneficiaries,
    analytics,
    apiLoading,
    refreshApi,
  } = useRelational();
  const yearData = fiscalYearData[fiscalYear].national;

  const dynamicData = useMemo(() => {
    // Use live Supabase analytics if available, else fall back to hardcoded data
    const totalAllocated = analytics
      ? analytics.total_allocated
      : yearData.totalBudget;
    const totalDistrib = analytics
      ? analytics.total_distributed
      : yearData.usedExpenditure;
    const totalRemaining = analytics
      ? analytics.remaining
      : yearData.remainingFund;
    const utilization = analytics ? analytics.utilization_percent : 0;
    const totalRecords = analytics
      ? analytics.total_records
      : beneficiaries.length;

    // Local session additions (not yet synced if backend offline)
    const sessionSpend = analytics
      ? 0
      : reliefDistributions.reduce((sum: number, d: any) => sum + d.amount, 0);
    const sessionBeneficiaries = analytics ? 0 : beneficiaries.length;

    const usedExpenditure = totalDistrib + sessionSpend;
    const currentRemaining = totalRemaining - sessionSpend;
    const peopleTotal = yearData.peopleAffected + sessionBeneficiaries;

    return [
      {
        title: "Total Disaster Fund Allocated",
        value: `NPR ${(totalAllocated / 1_000_000_000).toFixed(1)}B`,
        change: fiscalYear === "2081/82" ? "+2.5%" : "-1.2%",
        trend: fiscalYear === "2081/82" ? "up" : "down",
        icon: Wallet,
        color: "blue",
        used: Math.round((usedExpenditure / totalAllocated) * 100) || 0,
        live: !!analytics,
      },
      {
        title: "Total Fund Distributed",
        value: `NPR ${(usedExpenditure / 1_000_000_000).toFixed(2)}B`,
        change: "+12.0%",
        trend: "up",
        icon: CheckCircle2,
        color: "green",
        used: totalAllocated
          ? Math.round((usedExpenditure / totalAllocated) * 100)
          : 0,
        live: !!analytics,
      },
      {
        title: "Utilization Rate",
        value: `${analytics ? utilization.toFixed(1) : Math.round((usedExpenditure / totalAllocated) * 100) || 0}%`,
        change: "+5.4%",
        trend: "up",
        icon: TrendingUp,
        color: "accent",
        used: analytics
          ? Math.round(utilization)
          : Math.round((usedExpenditure / totalAllocated) * 100) || 0,
        live: !!analytics,
      },
      {
        title: "Remaining Balance",
        value: `NPR ${(currentRemaining / 1_000_000).toFixed(1)}M`,
        change: "-1.2%",
        trend: "down",
        icon: AlertCircle,
        color: "yellow",
        used: totalAllocated
          ? 100 - Math.round((usedExpenditure / totalAllocated) * 100)
          : 100,
        live: !!analytics,
      },
      {
        title: "Total Disaster Events",
        value: yearData.totalEvents.toLocaleString(),
        change: "+8.2%",
        trend: "up",
        icon: AlertCircle,
        color: "accent",
        used: 100,
        live: false,
      },
      {
        title: "Total Records",
        value: (totalRecords + sessionBeneficiaries).toLocaleString(),
        change: "+12.4%",
        trend: "up",
        icon: Users,
        color: "blue",
        used: 100,
        live: !!analytics,
      },
    ];
  }, [fiscalYear, yearData, reliefDistributions, beneficiaries, analytics]);

  const displayCards = overrideData || dynamicData;

  return (
    <div className="space-y-3">
      {/* Live status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              analytics ? "bg-emerald-500 animate-pulse" : "bg-slate-300",
            )}
          />
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            {analytics
              ? "Live Supabase Data"
              : apiLoading
                ? "Connecting to backend…"
                : "Offline — showing cached data"}
          </span>
        </div>
        <button
          onClick={refreshApi}
          disabled={apiLoading}
          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-[#003893] uppercase transition-colors disabled:opacity-40"
        >
          <RefreshCw size={11} className={apiLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {displayCards.map((card) => (
          <div key={card.title} className="dashboard-card relative">
            {card.live && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-emerald-600 uppercase">
                  Live
                </span>
              </div>
            )}
            <div className="flex justify-between items-start mb-2">
              <div
                className={cn(
                  "p-2 rounded bg-slate-50",
                  card.color === "blue" && "text-[#003893]",
                  card.color === "green" && "text-emerald-600",
                  card.color === "accent" && "text-[#DC143C]",
                  card.color === "yellow" && "text-amber-600",
                )}
              >
                <card.icon size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                {card.title}
              </p>
              <p className="text-xl font-bold text-slate-900">{card.value}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Utilization
              </span>
              <span className="text-[10px] font-bold text-slate-900">
                {card.used}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
