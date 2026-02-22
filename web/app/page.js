"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Shield,
  AlertTriangle,
  Brain,
  Phone,
  MapPin,
  Eye,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Activity,
  TrendingUp,
  Radio,
  MessageSquare,
  Landmark,
} from "lucide-react";
import EarthGlobe from "./components/EarthGlobe";

const modules = [
  {
    icon: Radio,
    title: "Real-Time Alerts",
    href: "/alerts",
    desc: "Live disaster feeds — floods, landslides, earthquakes, wildfires. Location-targeted warnings to all 77 districts.",
    tag: "LIVE",
    tagColor: "text-red-600 border-red-200 bg-red-50",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    href: "/predictions",
    desc: "ML engine analyzing weather, terrain & historical patterns. Local-level risk forecasts updated every 6 hours.",
    tag: "AI",
    tagColor: "text-purple-600 border-purple-200 bg-purple-50",
  },
  {
    icon: Eye,
    title: "Fund Transparency",
    href: "/transparency",
    desc: "Full audit trail of disaster budgets. Track every rupee from central government to province to beneficiary.",
    tag: "PUBLIC",
    tagColor: "text-emerald-600 border-emerald-200 bg-emerald-50",
  },
  {
    icon: Landmark,
    title: "Government Control",
    href: "/login",
    desc: "Authorized command dashboards for central government and province-level disaster budget allocation and aid dispatch.",
    tag: "SECURE",
    tagColor: "text-blue-600 border-blue-200 bg-blue-50",
  },
  {
    icon: Phone,
    title: "Emergency SOS",
    href: "/sos",
    desc: "One-press emergency broadcast with GPS coordinates. Direct line to Nepal Police, NDRRMA, and local authorities.",
    tag: "URGENT",
    tagColor: "text-red-600 border-red-200 bg-red-50",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    href: "/chatbot",
    desc: "Disaster-aware AI chatbot. Ask about safety protocols, aid status, evacuation routes, or emergency procedures.",
    tag: "GROQ",
    tagColor: "text-cyan-600 border-cyan-200 bg-cyan-50",
  },
];

const stats = [
  { value: "77", label: "DISTRICTS" },
  { value: "24/7", label: "MONITORING" },
  { value: "<30s", label: "ALERT SPEED" },
  { value: "100%", label: "TRANSPARENCY" },
];

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    const elements = document.querySelectorAll(
      ".reveal, .reveal-up, .reveal-left, .reveal-right",
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen text-gray-900 bg-white" ref={containerRef}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[88vh] flex-col items-center gap-8 lg:flex-row lg:gap-0">
            {/* Left */}
            <div className="flex flex-1 flex-col justify-center pt-12 lg:pt-0 lg:pr-12">
              <div className="animate-fade-in-up mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest text-emerald-700 shadow-sm transition-all hover:bg-emerald-100">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                LIVE MONITORING — 77 DISTRICTS ONLINE
              </div>

              <h1 className="animate-slide-up-fade delay-100 text-5xl font-black leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                HAMRO
                <br />
                <span className="text-emerald-400">SURAKSHA</span>
              </h1>
              <p className="animate-slide-up-fade delay-200 mt-2 text-lg font-medium tracking-[0.3em] text-slate-500 font-mono">
                हाम्रो सुरक्षा
              </p>

              <p className="animate-slide-up-fade delay-300 mt-6 max-w-lg text-sm leading-relaxed text-slate-600">
                Nepal&apos;s national disaster management command center —
                AI-powered risk predictions, real-time emergency alerts,
                transparent relief fund tracking, and one-press SOS for every
                citizen.
              </p>

              {/* Feature tags */}
              <div className="animate-slide-up-fade delay-400 mt-6 flex flex-wrap gap-2">
                {[
                  { icon: Activity, label: "REAL-TIME FEEDS" },
                  { icon: Brain, label: "AI PREDICTIONS" },
                  { icon: Eye, label: "FUND TRACKING" },
                  { icon: Phone, label: "OFFLINE SOS" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-slate-600 shadow-sm hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                  >
                    <Icon className="h-3 w-3 text-emerald-500" /> {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="animate-slide-up-fade delay-500 mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/alerts"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-xs font-bold tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
                >
                  VIEW LIVE ALERTS <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sos"
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-xs font-bold tracking-wider text-red-600 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-100 hover:border-red-300"
                >
                  <Phone className="h-4 w-4" /> EMERGENCY SOS
                </Link>
              </div>

              {/* Stats */}
              <div className="animate-fade-in delay-500 mt-12 flex flex-wrap gap-8 border-t border-gray-200 pt-8">
                {stats.map(({ value, label }) => (
                  <div key={label} className="group cursor-default">
                    <div className="text-2xl font-black font-mono text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {value}
                    </div>
                    <div className="text-[10px] font-mono tracking-widest text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Globe */}
            <div className="relative flex w-full items-center justify-center lg:w-[520px] lg:flex-none lg:self-stretch animate-fade-in delay-200">
              {/* Floating cards */}
              <div className="pointer-events-none absolute left-0 top-1/4 z-10 hidden lg:block animate-slide-up-fade delay-300">
                <div className="w-48 rounded-xl border border-red-100 bg-white/95 backdrop-blur-md p-3 shadow-lg shadow-red-500/5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-900">
                        FLOOD ALERT
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Sunsari District
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-red-500/20">
                      <div className="h-full w-[72%] rounded-full bg-red-500" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-red-400">
                      72%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-1/3 right-0 z-10 hidden lg:block animate-slide-up-fade delay-400">
                <div className="w-44 rounded-xl border border-emerald-100 bg-white/95 backdrop-blur-md p-3 shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10">
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-900">
                        SOS RESOLVED
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Makwanpur
                      </p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[9px] font-mono text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block">
                    Response: 4m 32s
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute right-4 top-1/4 z-10 hidden lg:block animate-slide-up-fade delay-500">
                <div className="w-40 rounded-xl border border-amber-100 bg-white/95 backdrop-blur-md p-3 shadow-lg shadow-amber-500/5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/10">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-900">
                        AI RISK
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Pokhara Valley
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-base font-black font-mono text-amber-400">
                    58%
                  </p>
                </div>
              </div>

              {/* EarthGlobe renders well on dark background */}
              <div className="h-[420px] w-full sm:h-[520px] lg:h-full drop-shadow-2xl">
                <EarthGlobe />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8 border-y border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-7xl reveal-up">
          <div className="mb-12 text-center sm:text-left">
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-700">
              SYSTEMS
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Integrated Command Modules
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
              Six interconnected systems forming a complete disaster response
              pipeline. Designed for speed, reliability, and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod, idx) => (
              <Link
                key={mod.href}
                href={mod.href}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-300 ${
                  idx % 3 === 0
                    ? "reveal-left delay-100"
                    : idx % 3 === 1
                      ? "reveal-up delay-300"
                      : "reveal-right delay-500"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-lg bg-slate-100 p-2.5 transition-colors group-hover:bg-emerald-50">
                    <mod.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest ${mod.tagColor}`}
                  >
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-emerald-700">
                  {mod.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {mod.desc}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider text-emerald-700 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  ENTER MODULE <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol / Pipeline */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center reveal-up">
            <span className="inline-block rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-500">
              PROTOCOL
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Response Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Brain,
                title: "AI Risk Detection",
                desc: "ML models analyze weather, terrain, soil moisture & seismic data to predict disaster risk at local level.",
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20",
              },
              {
                step: "02",
                icon: AlertTriangle,
                title: "Alert Dispatch",
                desc: "Location-targeted warnings pushed to citizens. Incident data flows into government command dashboards.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20",
              },
              {
                step: "03",
                icon: Phone,
                title: "Emergency & Recovery",
                desc: "SOS triggers rescue dispatch. Shelters activate. Relief funds tracked from allocation to beneficiary.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`relative rounded-2xl border border-gray-200 bg-white p-8 shadow-md hover:shadow-lg hover:border-emerald-200 transition-all ${i === 0 ? "reveal-left" : i === 1 ? "reveal-up delay-300" : "reveal-right delay-500"}`}
              >
                <span className="absolute -top-4 left-8 rounded-full bg-white border border-gray-200 px-2 text-xs font-mono font-bold text-slate-500">
                  Step {item.step}
                </span>
                <div
                  className={`mt-2 inline-flex rounded-xl ${item.bg} border ${item.border} p-3`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-gray-100 bg-gray-50 px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Speed",
                desc: "Alerts in under 30 seconds. 24/7 monitoring across all 77 districts.",
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: Lock,
                title: "Transparency",
                desc: "Every rupee of disaster relief tracked transparently and publicly auditable.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Globe,
                title: "Accessibility",
                desc: "Offline SMS fallback. Nepali language support. Designed for rural Nepal.",
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
            ].map((v, i) => (
              <div
                key={v.title}
                className={`flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-lg hover:border-emerald-200 transition-all ${i === 0 ? "reveal-left" : i === 1 ? "reveal-up delay-300" : "reveal-right delay-500"}`}
              >
                <div className={`rounded-full ${v.bg} p-4 mb-4`}>
                  <v.icon className={`h-6 w-6 ${v.color}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-[250px]">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-gray-50 px-6 py-16 text-center shadow-xl sm:px-16 reveal relative overflow-hidden transition-all duration-300 hover:shadow-gray-200 hover:border-emerald-200">
          {/* Subtle background decoration */}

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest text-slate-500">
              <Shield className="h-3 w-3 text-emerald-400" /> HAMRO SURAKSHA
            </div>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl lg:text-5xl">
              Stay Safe.{" "}
              <span className="text-emerald-600">Stay Informed.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base text-slate-600">
              Connecting citizens, volunteers &amp; government through real-time
              disaster awareness and transparent relief operations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/alerts"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold tracking-wider text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
              >
                ENTER COMMAND CENTER <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/chatbot"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold tracking-wider text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" /> AI
                ASSISTANT
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
