"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Wallet, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { useDashboard } from "../providers/dashboard-provider";
import { useRelational } from "../providers/relational-provider";
import { fiscalYearData } from "@/lib/data";

interface SummaryCardProps {
  overrideData?: any[];
}

export function SummaryCards({ overrideData }: SummaryCardProps) {
  const { fiscalYear } = useDashboard();
  const { reliefDistributions, beneficiaries } = useRelational();
  const yearData = fiscalYearData[fiscalYear].national;

  const dynamicData = useMemo(() => {
    // Calculate session adjustments
    const sessionSpend = reliefDistributions.reduce((sum: number, d: any) => sum + d.amount, 0);
    const sessionBeneficiaries = beneficiaries.length;

    const totalBudget = yearData.totalBudget;
    const allocatedProvinces = yearData.allocatedProvinces; // This is baseline allocation
    const totalUsedExpenditure = yearData.usedExpenditure + sessionSpend;
    const currentRemaining = yearData.remainingFund - sessionSpend;
    const totalPeopleAffected = yearData.peopleAffected + sessionBeneficiaries;

    return [
      {
        title: "Total Disaster Fund Allocated",
        value: `NPR ${(totalBudget / 1000000000).toFixed(1)}B`,
        change: fiscalYear === "2081/82" ? "+2.5%" : "-1.2%",
        trend: fiscalYear === "2081/82" ? "up" : "down",
        icon: Wallet,
        color: "blue",
        used: Math.round((allocatedProvinces / totalBudget) * 100),
      },
      {
        title: "Total Fund Distributed",
        value: `NPR ${(allocatedProvinces / 1000000000).toFixed(1)}B`,
        change: "+12.0%",
        trend: "up",
        icon: CheckCircle2,
        color: "green",
        used: Math.round((totalUsedExpenditure / allocatedProvinces) * 100),
      },
      {
        title: "Total Fund Used",
        value: `NPR ${(totalUsedExpenditure / 1000000000).toFixed(1)}B`,
        change: "+5.4%",
        trend: "up",
        icon: TrendingUp,
        color: "accent",
        used: Math.round((totalUsedExpenditure / totalBudget) * 100),
      },
      {
        title: "Remaining Balance",
        value: `NPR ${(currentRemaining / 1000000).toFixed(1)}M`,
        change: "-1.2%",
        trend: "down",
        icon: AlertCircle,
        color: "yellow",
        used: 100 - Math.round((totalUsedExpenditure / totalBudget) * 100),
      },
      {
        title: "Total Disaster Events",
        value: yearData.totalEvents.toLocaleString(),
        change: "+8.2%",
        trend: "up",
        icon: AlertCircle,
        color: "accent",
        used: 100,
      },
      {
        title: "Total People Affected",
        value: totalPeopleAffected.toLocaleString(),
        change: "+12.4%",
        trend: "up",
        icon: Users,
        color: "blue",
        used: 100,
      }
    ];
  }, [fiscalYear, yearData, reliefDistributions, beneficiaries]);

  const displayCards = overrideData || dynamicData;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {displayCards.map((card) => (
        <div
          key={card.title}
          className="dashboard-card"
        >
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
          
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase">{card.title}</p>
            <p className="text-xl font-bold text-slate-900">{card.value}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Utilization</span>
            <span className="text-[10px] font-bold text-slate-900">{card.used}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
