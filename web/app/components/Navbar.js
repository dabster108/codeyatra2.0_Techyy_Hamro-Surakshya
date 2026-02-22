"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/alerts", label: "Alerts" },
  { href: "/predictions", label: "Predictions" },
  { href: "/transparency", label: "Transparency" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/sos", label: "SOS", highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-foreground">
              Hamro Suraksha
            </span>
            <span className="text-[10px] leading-none text-muted">
              हाम्रो सुरक्षा
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ml-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-muted transition-colors hover:bg-surface-hover hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500" />
          </button>

          <Link
            href="/admin"
            className="hidden rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-green-500 hover:text-green-600 sm:block"
          >
            Admin
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted hover:bg-surface-hover md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  link.highlight
                    ? "mt-2 bg-green-600 text-center text-white"
                    : isActive
                    ? "bg-green-50 text-green-700"
                    : "text-muted hover:bg-surface-hover"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-lg border border-border px-3 py-2.5 text-center text-sm font-medium text-muted hover:border-green-500 hover:text-green-600"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
