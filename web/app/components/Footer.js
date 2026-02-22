"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white shadow-inner">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-md bg-slate-100 p-1.5">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold tracking-[0.15em] text-slate-900">
                HAMRO SURAKSHA
              </h3>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              Nepal&apos;s national disaster command center. AI-powered alerts,
              transparent fund tracking, emergency response coordination for all
              77 districts.
            </p>
          </div>

          {/* Operations */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Operations
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/alerts", label: "Disaster Alerts" },
                { href: "/predictions", label: "Risk Predictions" },
                { href: "/sos", label: "Emergency SOS" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Administration */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Administration
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/transparency", label: "Fund Transparency" },
                { href: "/chatbot", label: "AI Assistant" },
                { href: "/login", label: "Secure Access" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Lines */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Emergency Lines
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              {[
                { name: "Nepal Police", number: "100" },
                { name: "Fire Brigade", number: "101" },
                { name: "Ambulance", number: "102" },
                { name: "NDRRMA", number: "1155" },
              ].map((item) => (
                <li
                  key={item.number}
                  className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
                >
                  <span className="text-slate-500">{item.name}</span>
                  <a
                    href={`tel:${item.number}`}
                    className="rounded border border-red-200 bg-red-50 px-2 py-0.5 font-bold text-red-600 transition-colors hover:bg-red-100"
                  >
                    {item.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-[10px] font-mono text-slate-400 sm:flex-row">
          <span>
            © {new Date().getFullYear()} HAMRO SURAKSHA — GOVT OF NEPAL
          </span>
          <span>HIMALAYAN HACKATHON 2026</span>
        </div>
      </div>
    </footer>
  );
}
