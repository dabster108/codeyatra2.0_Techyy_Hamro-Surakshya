"use client";

import {
  Phone, Shield, AlertTriangle, Radio,
  Siren, Navigation, PhoneCall, Link
  Phone,
  Shield,
  AlertTriangle,
  Radio,
  Siren,
  Navigation,
  PhoneCall,
  Link,
} from "lucide-react";

const EMERGENCY_NUMBERS = [
  { name: "Nepal Police", number: "100", desc: "Law enforcement & general emergencies", icon: Shield, color: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50", iconBg: "bg-blue-100" },
  { name: "Fire Brigade", number: "101", desc: "Fire & hazardous incidents", icon: Siren, color: "text-orange-600", border: "border-orange-200", bg: "bg-orange-50", iconBg: "bg-orange-100" },
  { name: "Ambulance", number: "102", desc: "Medical emergencies & rescue", icon: Phone, color: "text-red-600", border: "border-red-200", bg: "bg-red-50", iconBg: "bg-red-100" },
  { name: "NDRRMA", number: "1155", desc: "National Disaster Risk Reduction & Management Authority", icon: Radio, color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
  { name: "Traffic Police", number: "103", desc: "Road accidents & traffic emergencies", icon: Navigation, color: "text-cyan-600", border: "border-cyan-200", bg: "bg-cyan-50", iconBg: "bg-cyan-100" },
  { name: "Armed Police", number: "104", desc: "Armed intervention & counter-terrorism", icon: Shield, color: "text-purple-600", border: "border-purple-200", bg: "bg-purple-50", iconBg: "bg-purple-100" },
  { name: "Child Helpline", number: "1098", desc: "Child abuse & protection services", icon: PhoneCall, color: "text-pink-600", border: "border-pink-200", bg: "bg-pink-50", iconBg: "bg-pink-100" },
  { name: "Nepal Red Cross", number: "01-4270650", desc: "Disaster relief & humanitarian aid", icon: AlertTriangle, color: "text-rose-600", border: "border-rose-200", bg: "bg-rose-50", iconBg: "bg-rose-100" },
  {
    name: "Nepal Police",
    number: "100",
    desc: "Law enforcement & general emergencies",
    icon: Shield,
    color: "text-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    name: "Fire Brigade",
    number: "101",
    desc: "Fire & hazardous incidents",
    icon: Siren,
    color: "text-orange-600",
    border: "border-orange-200",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
  },
  {
    name: "Ambulance",
    number: "102",
    desc: "Medical emergencies & rescue",
    icon: Phone,
    color: "text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
  },
  {
    name: "NDRRMA",
    number: "1155",
    desc: "National Disaster Risk Reduction & Management Authority",
    icon: Radio,
    color: "text-emerald-600",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
  },
  {
    name: "Traffic Police",
    number: "103",
    desc: "Road accidents & traffic emergencies",
    icon: Navigation,
    color: "text-cyan-600",
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
  },
  {
    name: "Armed Police",
    number: "104",
    desc: "Armed intervention & counter-terrorism",
    icon: Shield,
    color: "text-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    name: "Child Helpline",
    number: "1098",
    desc: "Child abuse & protection services",
    icon: PhoneCall,
    color: "text-pink-600",
    border: "border-pink-200",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
  },
  {
    name: "Nepal Red Cross",
    number: "01-4270650",
    desc: "Disaster relief & humanitarian aid",
    icon: AlertTriangle,
    color: "text-rose-600",
    border: "border-rose-200",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
];

export default function SOSPage() {
  return (
    <div className="min-h-screen bg-background cmd-grid">
      {/* Top bar */}
      <div className="border-b border-red-500/30 bg-red-500/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Siren className="h-4 w-4 text-red-400" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-400">
              EMERGENCY RESPONSE SYSTEM
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up-fade">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 border border-red-200">
              <PhoneCall className="h-4 w-4 text-red-600" />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-600">
              DIRECTORY
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-muted">{currentTime}</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 ${location ? "bg-emerald-400" : "bg-red-400 animate-pulse"}`} />
              <span className="text-[10px] font-mono text-muted">
                {location ? "GPS LOCKED" : locError || "ACQUIRING GPS..."}
              </span>
            </div>
          </div>
        </div>
      </div>
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl tracking-tight mb-4">
            Emergency <span className="text-red-500">Numbers</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Verified emergency contact numbers for Nepal. Tap any card to call
            directly from your device.
          </p>
        </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">

          {/* Left — Emergency numbers */}
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500">DIRECTORY</span>
              <h1 className="mt-1 text-2xl font-black text-white">Emergency Numbers</h1>
              <p className="mt-1 text-sm text-muted">Verified emergency contact numbers for Nepal. Tap to call directly.</p>
            </div>

            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
              {EMERGENCY_NUMBERS.map((item) => (
                <a key={item.number} href={`tel:${item.number}`}
                  className="group flex items-start gap-4 bg-[#0d1117] p-5 transition-all hover:bg-surface-hover">
                  <div className={`flex h-10 w-10 flex-none items-center justify-center border ${item.border} ${item.bg}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    </div>
                    <p className="mt-0.5 text-lg font-black font-mono text-white group-hover:text-emerald-400 transition-colors">
                      {item.number}
                    </p>
                    <p className="mt-1 text-[11px] text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Additional info */}
            <div className="mt-6 border border-border bg-[#0d1117] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Important Guidelines</h3>
              <ul className="mt-3 space-y-2 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none bg-emerald-500" />
                  Stay calm and clearly state your emergency type and location
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none bg-emerald-500" />
                  Keep your phone charged and GPS enabled during emergencies
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none bg-emerald-500" />
                  If you cannot call, send SMS with your location to 1155
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none bg-emerald-500" />
                  Follow evacuation instructions from local authorities immediately
                </li>
              </ul>
            </div>
          </div>

          {/* Right — SOS Button */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-[#0d1117] p-6">
              <div className="mb-6 text-center">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-400">EMERGENCY BROADCAST</span>
                <h2 className="mt-1 text-lg font-black text-white">One-Press SOS</h2>
                <p className="mt-1 text-xs text-muted">
                  Sends GPS coordinates and emergency broadcast to all responders
                </p>
              </div>

              {/* SOS Button */}
              <div className="flex justify-center py-8">
                <button onClick={handleSOS}
                  className={`group relative flex h-48 w-48 items-center justify-center border-2 transition-all
                    ${sosActive
                      ? "animate-pulse border-red-500 bg-red-600 text-white"
                      : countdown !== null
                        ? "border-amber-500 bg-amber-600/20 text-amber-400"
                        : "border-red-500/40 bg-red-500/10 text-red-400 hover:border-red-500 hover:bg-red-500/20"
                    }`}
                >
                  {/* Pulse ring */}
                  {(sosActive || countdown !== null) && (
                    <span className="absolute inset-0 border-2 border-red-500 animate-ping opacity-20" />
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <Siren className={`h-12 w-12 ${sosActive ? "animate-bounce" : ""}`} />
                    {sosActive ? (
                      <>
                        <span className="text-xl font-black tracking-wider">ACTIVE</span>
                        <span className="text-[10px] font-mono">TAP TO CANCEL</span>
                      </>
                    ) : countdown !== null ? (
                      <>
                        <span className="text-4xl font-black font-mono">{countdown}</span>
                        <span className="text-[10px] font-mono">TAP TO CANCEL</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-black tracking-wider">SOS</span>
                        <span className="text-[10px] font-mono">PRESS & HOLD</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Status indicators */}
              <div className="space-y-3 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted" />
                    <span className="text-xs text-muted">GPS Location</span>
                  </div>
                  {location ? (
                    <span className="font-mono text-xs text-emerald-400">
                      {location.lat}°N, {location.lng}°E
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-amber-400">{locError || "Acquiring..."}</span>
                  )}
        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-slide-up-fade delay-100">
          {EMERGENCY_NUMBERS.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className={`group relative flex items-center p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:${item.border}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div
                  className={`flex h-14 w-14 flex-none items-center justify-center rounded-xl border ${item.border} ${item.bg} group-hover:shadow-sm transition-all duration-500`}
                >
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Signal className="h-3.5 w-3.5 text-muted" />
                    <span className="text-xs text-muted">Network</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-emerald-400" />
                    <span className="font-mono text-xs text-emerald-400">ONLINE</span>
                  </div>
                <div className="ml-5 flex-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    <span className="text-xs text-muted">System Time</span>
                  </div>
                  <span className="font-mono text-xs text-gray-400">{currentTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted" />
                    <span className="text-xs text-muted">SOS Status</span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${sosActive ? "text-red-400" : "text-muted"}`}>
                    {sosActive ? "BROADCASTING" : countdown !== null ? `COUNTDOWN: ${countdown}s` : "STANDBY"}
                <div className="flex flex-col items-end pl-4">
                  <span
                    className={`text-xl font-black font-mono tracking-tight transition-colors duration-500 ${item.color}`}
                  >
                    {item.number}
                  </span>
                </div>
              </div>

              {/* Active SOS panel */}
              {sosActive && (
                <div className="mt-5 border border-red-500/30 bg-red-500/5 p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <span className="h-2 w-2 animate-pulse bg-red-500" />
                    <span className="text-xs font-bold">EMERGENCY BROADCAST ACTIVE</span>
                  </div>
                  <p className="mt-2 text-[11px] text-red-300/70">
                    Your GPS coordinates have been transmitted to nearest emergency responders.
                    Stay in your current location if safe. Help is on the way.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-red-400">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Broadcast ID: SOS-{Date.now().toString(36).toUpperCase()}
                  <div className="mt-1 flex items-center gap-1 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      TAP TO CALL
                    </span>
                    <Link className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick access */}
            <div className="mt-4 grid grid-cols-2 gap-px bg-border">
              <a href="tel:100" className="flex items-center gap-2 bg-[#0d1117] p-4 transition-all hover:bg-surface-hover">
                <Shield className="h-4 w-4 text-blue-400" />
                <div>
                  <span className="block text-[10px] text-muted">POLICE</span>
                  <span className="font-mono text-sm font-bold text-white">100</span>
                </div>
              </a>
              <a href="tel:1155" className="flex items-center gap-2 bg-[#0d1117] p-4 transition-all hover:bg-surface-hover">
                <Radio className="h-4 w-4 text-emerald-400" />
                <div>
                  <span className="block text-[10px] text-muted">NDRRMA</span>
                  <span className="font-mono text-sm font-bold text-white">1155</span>
                </div>
              </a>
            </div>
          </div>
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}
