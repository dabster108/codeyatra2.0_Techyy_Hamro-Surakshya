"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid,
  Box, 
  FileText, 
  ShieldCheck, 
  Users, 
  History, 
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/overview", icon: LayoutGrid },
  { name: "Provinces", href: "/provinces", icon: Box },
  { name: "Beneficiaries", href: "/beneficiaries", icon: Users },
  { name: "Activity Log", href: "/activity-log", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div 
      className={cn(
        "flex flex-col h-screen border-r border-slate-300 w-64 bg-[#003893] text-white"
      )}
    >
      <div className="flex items-center h-16 px-6 border-b border-white/20">
        <span className="text-sm font-bold uppercase tracking-widest">Hamro Surakshya</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-none",
                isActive 
                  ? "bg-white text-[#003893]" 
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20 bg-black/10">
        <div className="flex items-center p-2">
          <div className="w-8 h-8 bg-[#DC143C] flex items-center justify-center font-bold text-xs">
            ADM
          </div>
          <div className="ml-3">
            <p className="text-[10px] font-bold uppercase tracking-tighter text-white/60">Logged in as</p>
            <p className="text-[10px] font-bold uppercase tracking-tight">NDRRMA Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
