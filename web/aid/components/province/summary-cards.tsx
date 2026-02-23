"use client";

import { Wallet, CheckCircle2, TrendingUp, AlertCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProvinceSummaryCardsProps {
  provinceName: string;
  data: {
    received: number;
    allocated: number;
    used: number;
    remaining: number;
    utilization: number;
    totalDistricts: number;
  };
}

export function ProvinceSummaryCards({ data, provinceName }: ProvinceSummaryCardsProps) {
  const formatNPR = (amount: number) => {
    if (amount >= 1_000_000_000) return `NPR ${(amount / 1_000_000_000).toFixed(2)}B`;
    if (amount >= 1_000_000) return `NPR ${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `NPR ${(amount / 1_000).toFixed(2)}K`;
    return `NPR ${amount.toLocaleString()}`;
  };

  const cards = [
    {
      title: "Province Name",
      value: provinceName,
      icon: Building2,
      color: "blue",
      description: "Administrative Level"
    },
    {
      title: "Total Fund Received",
      value: formatNPR(data.received),
      icon: Building2,
      color: "blue",
      description: "Received from NDRRMA"
    },
    {
      title: "Total Fund Used",
      value: formatNPR(data.used),
      icon: TrendingUp,
      color: "accent",
      description: "Actual expenditure reported"
    },
    {
      title: "Remaining Balance",
      value: formatNPR(data.remaining),
      icon: AlertCircle,
      color: "yellow",
      description: "Balance in provincial treasury"
    },
    {
      title: "Total Number of Districts",
      value: data.totalDistricts,
      icon: CheckCircle2,
      color: "green",
      description: "Districts under jurisdiction"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
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
            <p className="text-xs font-bold text-slate-500 uppercase">{card.title}</p>
            <p className="text-xl font-bold text-slate-900">{card.value}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 italic text-[10px] text-slate-400 font-medium">
            {card.description}
          </div>
        </div>
      ))}
    </div>
  );
}
