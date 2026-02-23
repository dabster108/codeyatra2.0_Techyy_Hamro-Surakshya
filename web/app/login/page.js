"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Shield, User, Landmark, MapPin, Lock, ChevronDown,
  ArrowRight, Eye, Radio,
} from "lucide-react";

const ROLE_CARDS = [
  { key: "user", icon: User, label: "CITIZEN", desc: "Public dashboard — view alerts, predictions, and relief transparency", color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
  { key: "government", icon: Landmark, label: "CENTRAL GOV", desc: "Ministry of Home Affairs — national budget allocation and disaster command", color: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50", iconBg: "bg-blue-100" },
  { key: "province", icon: MapPin, label: "PROVINCE GOV", desc: "Province administration — district management and local aid distribution", color: "text-amber-600", border: "border-amber-200", bg: "bg-amber-50", iconBg: "bg-amber-100" },
];

const PROVINCE_LOGINS = [
  { key: "koshi", label: "Koshi Province" },
  { key: "madhesh", label: "Madhesh Province" },
  { key: "bagmati", label: "Bagmati Province" },
  { key: "gandaki", label: "Gandaki Province" },
  { key: "lumbini", label: "Lumbini Province" },
  { key: "karnali", label: "Karnali Province" },
  { key: "sudurpashchim", label: "Sudurpashchim Province" },
];

export default function LoginPage() {
  const { user, login, loading, USERS } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("koshi");
  const [signingIn, setSigningIn] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "government") router.push("/government");
      else if (user.role === "province") router.push("/province");
      else router.push("/");
    }
  }, [user, loading, router]);

  const handleLogin = () => {
    const key = selectedRole === "province" ? selectedProvince : selectedRole;
    setSigningIn(true);
    setTimeout(() => {
      const u = login(key);
      if (u) {
        if (u.role === "government") router.push("/government");
        else if (u.role === "province") router.push("/province");
        else router.push("/");
      }
      setSigningIn(false);
    }, 600);
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <div className="text-center animate-pulse">
        <div className="mx-auto h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-mono font-bold tracking-widest text-slate-500">AUTHENTICATING ACCESS...</p>
      </div>
    </div>
  );

  if (user) return null;

  const demoUser = selectedRole
    ? USERS[selectedRole === "province" ? selectedProvince : selectedRole]
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center items-center px-4 py-16">
      <div className="w-full max-w-lg mb-8 animate-slide-up-fade">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-100 border border-emerald-200 mb-5 shadow-sm">
            <Lock className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System <span className="text-emerald-500">Authentication</span></h1>
          <p className="mt-3 text-sm font-medium text-slate-500">Select your authorization level to enter the command center</p>
        </div>

        {/* Role selection */}
        <div className="space-y-3 mb-6 animate-slide-up-fade delay-300">
          {ROLE_CARDS.map((role) => (
            <button key={role.key} onClick={() => setSelectedRole(role.key)}
              className={`w-full text-left rounded-2xl border transition-all duration-500 p-5 ${
                selectedRole === role.key
                  ? `${role.border} ${role.bg} shadow-md scale-[1.02]`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl border transition-colors ${
                  selectedRole === role.key ? `${role.border} ${role.iconBg}` : "border-gray-100 bg-gray-50"
                }`}>
                  <role.icon className={`h-5 w-5 ${selectedRole === role.key ? role.color : "text-slate-400"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-bold ${selectedRole === role.key ? "text-gray-900" : "text-gray-700"}`}>
                      {role.label}
                    </span>
                    {selectedRole === role.key && (
                      <span className={`h-2 w-2 rounded-full ${role.color.replace("text-", "bg-")} animate-pulse`} />
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed pr-2">{role.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Province selector */}
        {selectedRole === "province" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-6 shadow-sm animate-slide-up-fade delay-400">
            <div className="flex items-center gap-2 mb-3">
               <MapPin className="h-4 w-4 text-amber-600" />
               <label className="text-sm font-mono font-bold tracking-widest text-amber-700">
                 SELECT JURISDICTION
               </label>
            </div>
            <div className="relative">
              <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full appearance-none rounded-xl border border-amber-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-gray-800 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer">
                {PROVINCE_LOGINS.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-600/50" />
            </div>
          </div>
        )}

        {/* Demo credentials */}
        {demoUser && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-8 shadow-sm animate-slide-up-fade delay-400">
            <div className="flex items-center gap-2 mb-4 PB-1 border-b border-gray-100 pb-3">
               <Shield className="h-4 w-4 text-emerald-500" />
               <span className="text-xs font-mono font-bold tracking-widest text-emerald-600">DEMO CREDENTIALS LOADED</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-slate-400 mb-1.5 ml-1">AUTHORIZED EMAIL</label>
                <input readOnly value={demoUser.email}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono font-semibold text-emerald-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest text-slate-400 mb-1.5 ml-1">ACCESS TOKEN</label>
                <input readOnly value="••••••••" type="password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono font-semibold text-emerald-600 focus:outline-none tracking-widest" />
              </div>
              <div className="flex items-center gap-2 pt-2 px-1 text-xs font-medium text-slate-500">
                <Eye className="h-3.5 w-3.5 text-emerald-500" />
                <span>Demo mode active. One-click authentication enabled.</span>
              </div>
            </div>
          </div>
        )}

        {/* Login button */}
        <button onClick={handleLogin} disabled={!selectedRole || signingIn}
          className="group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-8 py-4 text-sm font-bold text-white transition-all duration-500 hover:bg-gray-800 disabled:opacity-50 hover:shadow-lg disabled:hover:shadow-none animate-slide-up-fade delay-500 outline-none focus:ring-4 focus:ring-gray-200">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 opacity-60" />
          {signingIn ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span className="tracking-widest font-mono">AUTHENTICATING...</span>
            </>
          ) : (
            <>
              <span className="tracking-wider">ENTER COMMAND CENTER</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-emerald-400" />
            </>
          )}
        </button>

      </div>
      
      {/* Footer Tag */}
      <div className="fixed bottom-6 text-center animate-slide-up-fade delay-700">
        <p className="text-xs font-mono font-bold tracking-[0.2em] text-slate-400">
          HAMRO SURAKSHA — RESTRICTED ACCESS
        </p>
      </div>
    </div>
  );
}
