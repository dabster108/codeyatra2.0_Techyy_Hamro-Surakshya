"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#060910]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white">HAMRO SURAKSHA</h3>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Nepal&apos;s national disaster command center. AI-powered alerts,
              transparent fund tracking, emergency response coordination.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-3">Operations</h4>
            <ul className="space-y-1.5">
              {[
                { href: "/alerts", label: "Disaster Alerts" },
                { href: "/predictions", label: "Risk Predictions" },
                { href: "/sos", label: "Emergency SOS" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-gray-400 transition-colors hover:text-emerald-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-3">Administration</h4>
            <ul className="space-y-1.5">
              {[
                { href: "/transparency", label: "Fund Transparency" },
                { href: "/chatbot", label: "AI Assistant" },
                { href: "/login", label: "Secure Access" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-gray-400 transition-colors hover:text-emerald-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-3">Emergency Lines</h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="text-gray-400">Nepal Police <span className="text-red-400 font-bold">100</span></li>
              <li className="text-gray-400">Fire Brigade <span className="text-red-400 font-bold">101</span></li>
              <li className="text-gray-400">Ambulance <span className="text-red-400 font-bold">102</span></li>
              <li className="text-gray-400">NDRRMA <span className="text-red-400 font-bold">1155</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-5 flex items-center justify-between text-[10px] font-mono text-muted">
          <span>© {new Date().getFullYear()} HAMRO SURAKSHA — GOVT OF NEPAL</span>
          <span>HIMALAYAN HACKATHON 2026</span>
        </div>
      </div>
    </footer>
  );
}
