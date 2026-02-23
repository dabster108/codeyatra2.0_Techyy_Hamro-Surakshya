"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone,
  Shield,
  AlertTriangle,
  Radio,
  Siren,
  Navigation,
  PhoneCall,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EMERGENCY_NUMBERS = [
  { name: "Nepal Police", number: "100", desc: "Law enforcement & emergencies", icon: Shield, color: "text-blue-600", border: "border-blue-200", bg: "bg-blue-50" },
  { name: "Fire Brigade", number: "101", desc: "Fire & hazardous incidents", icon: Siren, color: "text-orange-600", border: "border-orange-200", bg: "bg-orange-50" },
  { name: "Ambulance", number: "102", desc: "Medical emergencies", icon: Phone, color: "text-red-600", border: "border-red-200", bg: "bg-red-50" },
  { name: "NDRRMA", number: "1155", desc: "Disaster management", icon: Radio, color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" },
  { name: "Traffic Police", number: "103", desc: "Road accidents", icon: Navigation, color: "text-cyan-600", border: "border-cyan-200", bg: "bg-cyan-50" },
  { name: "Armed Police", number: "104", desc: "Armed intervention", icon: Shield, color: "text-purple-600", border: "border-purple-200", bg: "bg-purple-50" },
  { name: "Child Helpline", number: "1098", desc: "Child protection", icon: PhoneCall, color: "text-pink-600", border: "border-pink-200", bg: "bg-pink-50" },
  { name: "Nepal Red Cross", number: "01-4270650", desc: "Humanitarian aid", icon: AlertTriangle, color: "text-rose-600", border: "border-rose-200", bg: "bg-rose-50" },
];

export default function SOSPage() {
  const { user } = useAuth();
  const [phase, setPhase] = useState("idle"); // idle | counting | sending | sent | error
  const [countdown, setCountdown] = useState(3);
  const [location, setLocation] = useState(null);
  const [sentId, setSentId] = useState(null);
  const timerRef = useRef(null);

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const startSOS = () => {
    setPhase("counting");
    setCountdown(3);

    let c = 3;
    timerRef.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timerRef.current);
        sendSOS();
      }
    }, 1000);
  };

  const cancelSOS = () => {
    clearInterval(timerRef.current);
    setPhase("idle");
    setCountdown(3);
  };

  const sendSOS = async () => {
    setPhase("sending");

    let loc = location;
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
        );
        loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
      } catch {}
    }

    try {
      const res = await fetch("http://localhost:8005/sos/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: user?.name || "Unknown Citizen",
          contact_number: user?.email || "N/A",
          gps_lat: loc?.lat || null,
          gps_long: loc?.lng || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSentId(data.request_id);
        setPhase("sent");
      } else {
        setPhase("error");
      }
    } catch {
      setPhase("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-600">
              EMERGENCY
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl tracking-tight">
            SOS <span className="text-red-500">Emergency</span>
          </h1>
        </div>

        {/* Side by side: SOS button | Emergency numbers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT SIDE — SOS Button */}
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-200 bg-red-50/30 p-8 lg:p-12 min-h-[500px]">
            <p className="text-sm text-slate-500 max-w-xs text-center mb-8">
              Press the button to send your name & location to authorities immediately.
            </p>

            {/* The SOS Button */}
            <div className="mb-6">
              {phase === "idle" && (
                <button
                  onClick={startSOS}
                  className="relative h-48 w-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_60px_rgba(239,68,68,0.4)] hover:shadow-[0_0_80px_rgba(239,68,68,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center"
                >
                  <Siren className="h-14 w-14 mb-2" />
                  <span className="text-2xl font-black tracking-tight">SOS</span>
                  <span className="text-[10px] font-bold tracking-widest opacity-80 mt-1">TAP FOR HELP</span>
                </button>
              )}

              {phase === "counting" && (
                <button
                  onClick={cancelSOS}
                  className="relative h-48 w-48 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_0_80px_rgba(239,68,68,0.6)] animate-pulse flex flex-col items-center justify-center"
                >
                  <span className="text-7xl font-black">{countdown}</span>
                  <span className="text-xs font-bold tracking-widest opacity-80 mt-2">TAP TO CANCEL</span>
                </button>
              )}

              {phase === "sending" && (
                <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-[0_0_60px_rgba(245,158,11,0.4)] flex flex-col items-center justify-center">
                  <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3" />
                  <span className="text-sm font-bold tracking-widest">SENDING...</span>
                </div>
              )}

              {phase === "sent" && (
                <div className="relative h-48 w-48 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-[0_0_60px_rgba(34,197,94,0.4)] flex flex-col items-center justify-center">
                  <CheckCircle2 className="h-14 w-14 mb-2" />
                  <span className="text-lg font-black">SENT!</span>
                  <span className="text-[10px] font-bold tracking-widest opacity-80 mt-1">HELP IS COMING</span>
                </div>
              )}

              {phase === "error" && (
                <button
                  onClick={() => setPhase("idle")}
                  className="relative h-48 w-48 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-white shadow-[0_0_60px_rgba(107,114,128,0.4)] flex flex-col items-center justify-center"
                >
                  <AlertTriangle className="h-14 w-14 mb-2" />
                  <span className="text-sm font-bold">FAILED</span>
                  <span className="text-[10px] font-bold tracking-widest opacity-80 mt-1">TAP TO RETRY</span>
                </button>
              )}
            </div>

            {/* Status info */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {location ? (
                  <span className="text-green-600 font-semibold">Location detected</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Getting location...</span>
                )}
              </div>
              {user && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold">{user.name}</span>
                </div>
              )}
            </div>

            {phase === "sent" && (
              <div className="mt-6 w-full max-w-sm bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                <p className="font-bold mb-1">Emergency alert sent!</p>
                <p className="text-green-600">Authorities have been notified. Stay safe.</p>
                <button
                  onClick={() => { setPhase("idle"); setSentId(null); }}
                  className="mt-3 text-xs font-bold text-green-700 underline"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE — Emergency Numbers */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <PhoneCall className="h-4 w-4 text-red-600" />
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-red-600">DIRECTORY</span>
              <span className="ml-1 text-lg font-black text-gray-900">Emergency Numbers</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {EMERGENCY_NUMBERS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    className={`group flex items-center p-4 rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:${item.border}`}
                  >
                    <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg border ${item.border} ${item.bg}`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                    </div>
                    <span className={`text-base font-black font-mono ${item.color} ml-2`}>{item.number}</span>
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}