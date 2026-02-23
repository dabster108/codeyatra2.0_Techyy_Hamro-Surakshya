"use client";

import {
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
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl tracking-tight mb-4">
            Emergency <span className="text-red-500">Numbers</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Verified emergency contact numbers for Nepal. Tap any card to call
            directly from your device.
          </p>
        </div>

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

                <div className="ml-5 flex-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex flex-col items-end pl-4">
                  <span
                    className={`text-xl font-black font-mono tracking-tight transition-colors duration-500 ${item.color}`}
                  >
                    {item.number}
                  </span>
                  <div className="mt-1 flex items-center gap-1 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      TAP TO CALL
                    </span>
                    <Link className="h-3 w-3 text-slate-400" />
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
