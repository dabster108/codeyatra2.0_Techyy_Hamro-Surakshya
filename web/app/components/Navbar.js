"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield, Menu, X, LogIn, LogOut, ChevronDown,
  Radio, Brain, Eye, Phone, MessageSquare, Landmark, Building2, User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const publicLinks = [
  { href: "/alerts", label: "ALERTS", icon: Radio },
  { href: "/predictions", label: "PREDICTIONS", icon: Brain },
  { href: "/transparency", label: "TRANSPARENCY", icon: Eye },
  { href: "/chatbot", label: "ASSISTANT", icon: MessageSquare },
  { href: "/sos", label: "SOS", emergency: true, icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const navLinks = [...publicLinks];
  if (user?.role === "government") navLinks.splice(3, 0, { href: "/government", label: "GOV CMD", icon: Landmark });
  if (user?.role === "province") navLinks.splice(3, 0, { href: "/province", label: "PROV CMD", icon: Building2 });

  const handleLogout = () => { logout(); setProfileOpen(false); router.push("/"); };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[#0a0e17]/95 backdrop-blur-md">
      {/* System status strip */}
      <div className="border-b border-border bg-[#060910] px-4">
        <div className="mx-auto flex h-6 max-w-7xl items-center justify-between text-[10px] font-mono tracking-wider">
          <div className="flex items-center gap-4 text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-400 animate-[blink_2s_ease-in-out_infinite]" />
              SYS ONLINE
            </span>
            <span className="hidden sm:inline text-border">│</span>
            <span className="hidden sm:inline">NDRRMA FEED ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-muted">
            <span className="hidden sm:inline">NPT</span>
            <span className="font-bold text-emerald-400 tabular-nums">{time}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-400" />
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold tracking-[0.2em] text-white">HAMRO SURAKSHA</span>
            <span className="text-[8px] tracking-widest text-muted">COMMAND CENTER</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.emergency) {
              return (
                <Link key={link.href} href={link.href}
                  className="ml-1 flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold tracking-wider text-red-400 transition-colors hover:bg-red-500/20">
                  <Phone className="h-3 w-3" /> {link.label}
                </Link>
              );
            }
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider transition-colors ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="hidden items-center gap-2 border border-border px-3 py-1.5 text-[11px] font-mono text-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-400 sm:flex">
                    <span className={`h-2 w-2 ${
                      user.role === "government" ? "bg-blue-400" : user.role === "province" ? "bg-purple-400" : "bg-emerald-400"
                    }`} />
                    <span className="max-w-[100px] truncate uppercase tracking-wider">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 top-full z-50 mt-1 w-56 border border-border bg-[#0d1117] shadow-2xl">
                        <div className="border-b border-border px-4 py-3">
                          <div className="text-xs font-bold text-white">{user.name}</div>
                          <div className="text-[10px] font-mono text-muted">{user.email}</div>
                          <span className={`mt-1.5 inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                            user.role === "government" ? "border-blue-500/30 text-blue-400" :
                            user.role === "province" ? "border-purple-500/30 text-purple-400" : "border-emerald-500/30 text-emerald-400"
                          }`}>
                            {user.role === "province" ? user.province : user.role}
                          </span>
                        </div>
                        <div className="p-1">
                          {user.role === "government" && (
                            <Link href="/government" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-surface-hover">
                              <Landmark className="h-3.5 w-3.5 text-muted" /> Gov Dashboard
                            </Link>
                          )}
                          {user.role === "province" && (
                            <Link href="/province" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-surface-hover">
                              <Building2 className="h-3.5 w-3.5 text-muted" /> Province Dashboard
                            </Link>
                          )}
                          <Link href="/transparency" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-surface-hover">
                            <Eye className="h-3.5 w-3.5 text-muted" /> Transparency
                          </Link>
                          <button onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">
                            <LogOut className="h-3.5 w-3.5" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/login"
                  className="hidden items-center gap-1.5 border border-border px-3 py-1.5 text-[11px] font-bold tracking-wider text-muted transition-colors hover:border-emerald-500/40 hover:text-emerald-400 sm:flex">
                  <LogIn className="h-3.5 w-3.5" /> ACCESS
                </Link>
              )}
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted hover:text-foreground md:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="border-t border-border bg-[#0a0e17] px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 text-xs font-bold tracking-wider transition-colors ${
                  link.emergency ? "mt-2 border border-red-500/40 bg-red-500/10 text-center text-red-400"
                  : isActive ? "bg-emerald-500/10 text-emerald-400" : "text-muted hover:text-foreground"
                }`}>
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-mono text-muted">
                <span className="h-2 w-2 bg-emerald-400" />
                {user.name}
              </div>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="mt-1 block w-full border border-red-500/30 px-3 py-2.5 text-center text-xs font-bold tracking-wider text-red-400">
                LOGOUT
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="mt-2 block border border-border px-3 py-2.5 text-center text-xs font-bold tracking-wider text-muted hover:text-emerald-400">
              SECURE ACCESS
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
