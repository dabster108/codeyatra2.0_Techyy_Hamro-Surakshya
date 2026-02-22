"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
      <Link href="/" className="hover:text-[#003893] transition-colors flex items-center gap-1.5">
        <Home size={14} />
        Portal
      </Link>
      <ChevronRight size={12} className="text-slate-300" />
      <span className={paths.length === 0 ? "text-[#003893]" : ""}>National Dashboard</span>
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight size={12} className="text-slate-300" />
            <Link 
              href={href} 
              className={isLast ? "text-[#003893]" : "hover:text-[#003893] transition-colors"}
            >
              {path === "provinces" ? "Provinces" : 
               path === "districts" ? "Districts" :
               path === "wards" ? "Wards" :
               path.replace("-", " ")}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
