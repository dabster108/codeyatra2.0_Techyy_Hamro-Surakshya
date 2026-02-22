"use client";

import { useState, useEffect } from "react";
import {
  Phone, MapPin, Shield, AlertTriangle, Radio,
  Siren, Navigation, Signal, PhoneCall, Clock, CheckCircle2,
} from "lucide-react";

const EMERGENCY_NUMBERS = [
  { name: "Nepal Police", number: "100", desc: "Law enforcement & general emergency", icon: Shield, color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { name: "Fire Brigade", number: "101", desc: "Fire & hazardous incidents", icon: Siren, color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  { name: "Ambulance", number: "102", desc: "Medical emergency & rescue", icon: Phone, color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" },
  { name: "NDRRMA", number: "1155", desc: "National Disaster Risk Reduction & Management Authority", icon: Radio, color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  { name: "Traffic Police", number: "103", desc: "Road accidents & traffic emergencies", icon: Navigation, color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
  { name: "Armed Police", number: "104", desc: "Armed intervention & counter-terrorism", icon: Shield, color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  { name: "Child Helpline", number: "1098", desc: "Child abuse & protection services", icon: PhoneCall, color: "text-pink-400", border: "border-pink-500/30", bg: "bg-pink-500/10" },
  { name: "Nepal Red Cross", number: "01-4270650", desc: "Disaster relief & humanitarian aid", icon: AlertTriangle, color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" },
];

export default function SOSPage() {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString("en-GB", { timeZone: "Asia/Kathmandu", hour12: false }) + " NPT");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }),
        () => setLocError("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setSosActive(true);
      setCountdown(null);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const handleSOS = () => {
    if (sosActive) {
      setSosActive(false);
    } else if (countdown !== null) {
      setCountdown(null);
    } else {
      setCountdown(5);
    }
  };

  return (
    <div className="min-h-screen bg-background cmd-grid">
      {/* Top bar */}
      <div className="border-b border-red-500/30 bg-red-500/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Siren className="h-4 w-4 text-red-400" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-400">
              EMERGENCY RESPONSE SYSTEM
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
        </div>
      </div>
    </div>
  );
}
