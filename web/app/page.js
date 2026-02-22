import Link from "next/link";
import {
  Shield, AlertTriangle, Brain, Phone, MapPin, Eye,
  ArrowRight, Zap, Globe, Lock, Activity, TrendingUp,
  Radio, MessageSquare, Landmark,
} from "lucide-react";
import EarthGlobe from "./components/EarthGlobe";

const modules = [
  {
    icon: Radio, title: "Real-Time Alerts", href: "/alerts",
    desc: "Live disaster feeds — floods, landslides, earthquakes, wildfires. Location-targeted warnings to all 77 districts.",
    tag: "LIVE", tagColor: "text-red-400 border-red-500/30",
  },
  {
    icon: Brain, title: "AI Predictions", href: "/predictions",
    desc: "ML engine analyzing weather, terrain & historical patterns. Local-level risk forecasts updated every 6 hours.",
    tag: "AI", tagColor: "text-purple-400 border-purple-500/30",
  },
  {
    icon: Eye, title: "Fund Transparency", href: "/transparency",
    desc: "Full audit trail of disaster budgets. Track every rupee from central government to province to beneficiary.",
    tag: "PUBLIC", tagColor: "text-emerald-400 border-emerald-500/30",
  },
  {
    icon: Landmark, title: "Government Control", href: "/login",
    desc: "Authorized command dashboards for central government and province-level disaster budget allocation and aid dispatch.",
    tag: "SECURE", tagColor: "text-blue-400 border-blue-500/30",
  },
  {
    icon: Phone, title: "Emergency SOS", href: "/sos",
    desc: "One-press emergency broadcast with GPS coordinates. Direct line to Nepal Police, NDRRMA, and local authorities.",
    tag: "URGENT", tagColor: "text-red-400 border-red-500/30",
  },
  {
    icon: MessageSquare, title: "AI Assistant", href: "/chatbot",
    desc: "Disaster-aware AI chatbot. Ask about safety protocols, aid status, evacuation routes, or emergency procedures.",
    tag: "GROQ", tagColor: "text-cyan-400 border-cyan-500/30",
  },
];

const stats = [
  { value: "77", label: "DISTRICTS" },
  { value: "24/7", label: "MONITORING" },
  { value: "<30s", label: "ALERT SPEED" },
  { value: "100%", label: "TRANSPARENCY" },
];

export default function Home() {
  return (
    <div className="bg-background cmd-grid">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[88vh] flex-col items-center gap-8 lg:flex-row lg:gap-0">

            {/* Left */}
            <div className="flex flex-1 flex-col justify-center pt-16 lg:pt-0 lg:pr-12">
              <div className="mb-5 inline-flex w-fit items-center gap-2 border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-emerald-500" />
                </span>
                LIVE MONITORING — 77 DISTRICTS ONLINE
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                HAMRO<br />
                <span className="text-emerald-400">SURAKSHA</span>
              </h1>
              <p className="mt-1 text-lg font-medium tracking-[0.3em] text-muted font-mono">
                हाम्रो सुरक्षा
              </p>

              <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-400">
                Nepal&apos;s national disaster management command center — AI-powered risk predictions,
                real-time emergency alerts, transparent relief fund tracking, and one-press SOS for every citizen.
              </p>

              {/* Feature tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { icon: Activity, label: "REAL-TIME FEEDS" },
                  { icon: Brain, label: "AI PREDICTIONS" },
                  { icon: Eye, label: "FUND TRACKING" },
                  { icon: Phone, label: "OFFLINE SOS" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 border border-border bg-surface px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-muted">
                    <Icon className="h-3 w-3 text-emerald-500" /> {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/alerts"
                  className="inline-flex items-center gap-2 bg-emerald-600 px-6 py-3 text-xs font-bold tracking-wider text-white transition-all hover:bg-emerald-500">
                  VIEW LIVE ALERTS <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/sos"
                  className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-6 py-3 text-xs font-bold tracking-wider text-red-400 transition-all hover:bg-red-500/20">
                  <Phone className="h-4 w-4" /> EMERGENCY SOS
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap gap-8 border-t border-border pt-8">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black font-mono text-white">{value}</div>
                    <div className="text-[10px] font-mono tracking-widest text-muted">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Globe */}
            <div className="relative flex w-full items-center justify-center lg:w-[520px] lg:flex-none lg:self-stretch">
              {/* Floating cards */}
              <div className="pointer-events-none absolute left-0 top-1/4 z-10 hidden lg:block">
                <div className="w-48 border border-red-500/30 bg-[#0d1117]/90 backdrop-blur p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center bg-red-500/10">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-white">FLOOD ALERT</p>
                      <p className="text-[9px] text-muted font-mono">Sunsari District</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-1 flex-1 bg-gray-800"><div className="h-full w-[72%] bg-red-500" /></div>
                    <span className="text-[9px] font-mono font-bold text-red-400">72%</span>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-1/3 right-0 z-10 hidden lg:block">
                <div className="w-44 border border-emerald-500/30 bg-[#0d1117]/90 backdrop-blur p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center bg-emerald-500/10">
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-white">SOS RESOLVED</p>
                      <p className="text-[9px] text-muted font-mono">Makwanpur</p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[9px] font-mono text-emerald-400">Response: 4m 32s</p>
                </div>
              </div>

              <div className="pointer-events-none absolute right-4 top-1/4 z-10 hidden lg:block">
                <div className="w-40 border border-amber-500/30 bg-[#0d1117]/90 backdrop-blur p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center bg-amber-500/10">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-white">AI RISK</p>
                      <p className="text-[9px] text-muted font-mono">Pokhara Valley</p>
                    </div>
                  </div>
                  <p className="mt-1 text-base font-black font-mono text-amber-400">58%</p>
                </div>
              </div>

              <div className="h-[420px] w-full sm:h-[520px] lg:h-full">
                <EarthGlobe />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Modules Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500">SYSTEMS</span>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Integrated Command Modules
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Six interconnected systems forming a complete disaster response pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Link key={mod.href} href={mod.href}
                className="group bg-[#0d1117] p-6 transition-all hover:bg-surface-hover">
                <div className="flex items-center justify-between mb-3">
                  <mod.icon className="h-5 w-5 text-emerald-500" />
                  <span className={`border px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest ${mod.tagColor}`}>
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{mod.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{mod.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-mono tracking-wider text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  ENTER <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-500">PROTOCOL</span>
            <h2 className="mt-1 text-2xl font-black text-white">Response Pipeline</h2>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
            {[
              { step: "01", icon: Brain, title: "AI Risk Detection", desc: "ML models analyze weather, terrain, soil moisture & seismic data to predict disaster risk at local level.", color: "text-purple-400" },
              { step: "02", icon: AlertTriangle, title: "Alert Dispatch", desc: "Location-targeted warnings pushed to citizens. Incident data flows into government command dashboards.", color: "text-amber-400" },
              { step: "03", icon: Phone, title: "Emergency & Recovery", desc: "SOS triggers rescue dispatch. Shelters activate. Relief funds tracked from allocation to beneficiary.", color: "text-emerald-400" },
            ].map((item, i) => (
              <div key={item.step} className="relative bg-[#0d1117] p-8">
                <span className="text-[10px] font-mono font-bold text-muted">{item.step}</span>
                <div className="mt-3 flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
            {[
              { icon: Zap, title: "Speed", desc: "Alerts in under 30 seconds. 24/7 monitoring across all 77 districts.", color: "text-amber-400" },
              { icon: Lock, title: "Transparency", desc: "Every rupee of disaster relief tracked on-chain and publicly auditable.", color: "text-emerald-400" },
              { icon: Globe, title: "Accessibility", desc: "Offline SMS fallback. Nepali language support. Designed for rural Nepal.", color: "text-cyan-400" },
            ].map((v) => (
              <div key={v.title} className="bg-[#0d1117] p-8">
                <v.icon className={`h-5 w-5 ${v.color}`} />
                <h3 className="mt-3 text-sm font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-emerald-500/20 bg-emerald-500/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-emerald-500/30 px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-emerald-400">
            <Shield className="h-3 w-3" /> HAMRO SURAKSHA
          </div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            Stay Safe. Stay Informed.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted">
            Connecting citizens, volunteers &amp; government through real-time disaster awareness and transparent relief operations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/alerts" className="inline-flex items-center gap-2 bg-emerald-600 px-7 py-3 text-xs font-bold tracking-wider text-white hover:bg-emerald-500">
              ENTER COMMAND CENTER <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/chatbot" className="inline-flex items-center gap-2 border border-border px-7 py-3 text-xs font-bold tracking-wider text-gray-300 hover:bg-surface-hover">
              <MessageSquare className="h-4 w-4" /> AI ASSISTANT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
