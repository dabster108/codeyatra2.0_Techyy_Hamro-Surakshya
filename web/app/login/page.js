"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Shield, User, Landmark, MapPin, Lock, ChevronDown,
  ArrowRight, Eye, Radio,
} from "lucide-react";

const ROLE_CARDS = [
  { key: "user", icon: User, label: "CITIZEN", desc: "Public dashboard — view alerts, predictions, and relief transparency", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  { key: "government", icon: Landmark, label: "CENTRAL GOV", desc: "Ministry of Home Affairs — national budget allocation and disaster command", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
  { key: "province", icon: MapPin, label: "PROVINCE GOV", desc: "Province administration — district management and local aid distribution", color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5" },
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-6 w-6 border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="mt-3 text-xs font-mono text-muted">AUTHENTICATING...</p>
      </div>
    </div>
  );

  if (user) return null;

  const demoUser = selectedRole
    ? USERS[selectedRole === "province" ? selectedProvince : selectedRole]
    : null;

  return (
    <div className="min-h-screen bg-background cmd-grid flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-emerald-400 mb-4">
            <Lock className="h-3 w-3" /> SECURE ACCESS
          </div>
          <h1 className="text-2xl font-black text-white">System Authentication</h1>
          <p className="mt-2 text-sm text-muted">Select your access level to enter the command center</p>
        </div>

        {/* Role selection */}
        <div className="space-y-3 mb-6">
          {ROLE_CARDS.map((role) => (
            <button key={role.key} onClick={() => setSelectedRole(role.key)}
              className={`w-full text-left border transition-all p-4 ${
                selectedRole === role.key
                  ? `${role.border} ${role.bg}`
                  : "border-border bg-[#0d1117] hover:bg-surface-hover"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center border ${
                  selectedRole === role.key ? role.border : "border-border"
                }`}>
                  <role.icon className={`h-5 w-5 ${selectedRole === role.key ? role.color : "text-muted"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${selectedRole === role.key ? "text-white" : "text-gray-300"}`}>
                      {role.label}
                    </span>
                    {selectedRole === role.key && (
                      <span className={`h-1.5 w-1.5 ${role.color.replace("text-", "bg-")}`} />
                    )}
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">{role.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Province selector */}
        {selectedRole === "province" && (
          <div className="border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
            <label className="block text-[10px] font-mono font-bold tracking-widest text-amber-400 mb-2">
              SELECT PROVINCE
            </label>
            <div className="relative">
              <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full appearance-none border border-border bg-surface px-3 py-2.5 pr-8 text-sm text-white focus:border-amber-500/50 focus:outline-none">
                {PROVINCE_LOGINS.map((p) => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        )}

        {/* Demo credentials */}
        {demoUser && (
          <div className="border border-border bg-[#0d1117] p-4 mb-6">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted">DEMO CREDENTIALS</span>
            <div className="mt-3 space-y-2">
              <div>
                <label className="block text-[10px] font-mono text-muted mb-1">EMAIL</label>
                <input readOnly value={demoUser.email}
                  className="w-full border border-border bg-surface px-3 py-2 text-xs font-mono text-emerald-400" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-muted mb-1">PASSWORD</label>
                <input readOnly value="••••••••" type="password"
                  className="w-full border border-border bg-surface px-3 py-2 text-xs font-mono text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted">
                <Eye className="h-3 w-3" />
                <span>Demo mode — no real credentials required</span>
              </div>
            </div>
          </div>
        )}

        {/* Login button */}
        <button onClick={handleLogin} disabled={!selectedRole || signingIn}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 py-3 text-sm font-bold tracking-wider text-white transition-all hover:bg-emerald-500 disabled:opacity-30">
          {signingIn ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
              AUTHENTICATING...
            </>
          ) : (
            <>
              ENTER SYSTEM <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[10px] font-mono text-muted/50">
          HAMRO SURAKSHA — AUTHORIZED ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
