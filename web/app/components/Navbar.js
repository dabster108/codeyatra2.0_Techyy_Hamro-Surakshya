"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
  Radio,
  Brain,
  Eye,
  Phone,
  MessageSquare,
  Landmark,
  Building2,
  User,
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
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const navLinks = [...publicLinks];
  if (user?.role === "government") {
    navLinks.splice(3, 0, {
      href: "/government",
      label: "GOV CMD",
      icon: Landmark,
    });
    // Redirect SOS to government SOS dashboard
    const sosIdx = navLinks.findIndex((l) => l.label === "SOS");
    if (sosIdx !== -1) navLinks[sosIdx] = { ...navLinks[sosIdx], href: "/government/sos" };
  }
  if (user?.role === "province") {
    navLinks.splice(3, 0, {
      href: "/province",
      label: "PROV CMD",
      icon: Building2,
    });
    // Redirect SOS to province SOS dashboard
    const sosIdx = navLinks.findIndex((l) => l.label === "SOS");
    if (sosIdx !== -1) navLinks[sosIdx] = { ...navLinks[sosIdx], href: "/province/sos" };
  }

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-col w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* System status strip removed as requested */}

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0 transition-transform hover:scale-105"
        >
          <div className="rounded-md bg-slate-100 p-1.5">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-[0.15em] text-slate-900">
              HAMRO SURAKSHA
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-500 mt-0.5">
              COMMAND CENTER
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.emergency) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ml-2 flex flex-shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold tracking-wider text-red-600 shadow-sm transition-all hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5"
                >
                  <Phone className="h-3.5 w-3.5" /> {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3.5 py-1.5 text-xs font-bold tracking-wider transition-all hover:bg-slate-100 hover:text-slate-900 flex-shrink-0 ${
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-500"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-0 h-0.5 w-full bg-slate-900 rounded-t-md" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Nav / Profile */}
        <div className="flex items-center justify-end gap-3 flex-shrink-0 relative">
          {!loading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="hidden items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-mono text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 sm:flex"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.role === "government"
                          ? "bg-blue-500"
                          : user.role === "province"
                            ? "bg-purple-500"
                            : "bg-emerald-500"
                      }`}
                    />
                    <span className="max-w-[100px] font-semibold truncate uppercase tracking-wider">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl animate-fade-in-up">
                        <div className="border-b border-gray-100 px-4 py-3 bg-slate-50 rounded-t-xl">
                          <div className="text-sm font-bold text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-xs font-mono text-slate-500">
                            {user.email}
                          </div>
                          <span
                            className={`mt-2 inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                              user.role === "government"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : user.role === "province"
                                  ? "border-purple-200 bg-purple-50 text-purple-700"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {user.role === "province"
                              ? user.province
                              : user.role}
                          </span>
                        </div>
                        <div className="p-2">
                          {user.role === "government" && (
                            <Link
                              href="/government"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Landmark className="h-4 w-4 text-slate-400" />{" "}
                              Gov Dashboard
                            </Link>
                          )}
                          {user.role === "province" && (
                            <Link
                              href="/province"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                              <Building2 className="h-4 w-4 text-slate-400" />{" "}
                              Province Dashboard
                            </Link>
                          )}
                          <Link
                            href="/transparency"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye className="h-4 w-4 text-slate-400" />{" "}
                            Transparency
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden items-center gap-1.5 rounded-md bg-slate-900 px-4 py-1.5 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg sm:flex"
                >
                  <LogIn className="h-4 w-4" /> ACCESS
                </Link>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drop-down Nav */}
      {mobileOpen && (
        <div className="w-full border-t border-gray-100 bg-white px-4 pb-4 pt-2 shadow-inner md:hidden flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-md px-3 py-3 text-sm font-bold tracking-wider transition-colors ${
                  link.emergency
                    ? "mt-2 bg-red-50 text-red-600 border border-red-100 justify-center"
                    : isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user ? (
            <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-center gap-2 rounded-md bg-slate-50 px-3 py-2.5 text-xs font-mono font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {user.name}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold tracking-wider text-red-600 transition-colors hover:bg-red-100"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex justify-center rounded-md bg-slate-900 px-3 py-3 text-sm font-bold tracking-wider text-white shadow-md transition-colors hover:bg-slate-800"
            >
              SECURE ACCESS
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
