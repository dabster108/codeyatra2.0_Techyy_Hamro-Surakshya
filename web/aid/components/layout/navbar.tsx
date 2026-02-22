"use client";

import { Bell, Search, User, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";
import { Breadcrumbs } from "./breadcrumb";
import { useDashboard } from "../providers/dashboard-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { fiscalYear, setFiscalYear, availableYears } = useDashboard();
  const [isYearOpen, setIsYearOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-300 flex items-center px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Breadcrumbs />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 relative">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Fiscal Year:</span>
            <button 
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-bold text-[#003893]"
            >
              {fiscalYear}
            </button>

            {isYearOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-300 rounded shadow-sm z-50">
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setFiscalYear(year);
                      setIsYearOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-xs font-bold hover:bg-slate-50",
                      fiscalYear === year ? "text-[#003893]" : "text-slate-600"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200" />
          
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
              <User size={14} />
            </div>
            <span className="text-xs font-bold uppercase">National Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
