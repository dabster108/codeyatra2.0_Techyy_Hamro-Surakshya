import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Brain,
  LayoutDashboard,
  Phone,
  MapPin,
  Eye,
  Users,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Activity,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import EarthGlobe from "./components/EarthGlobe";
import AnimateOnView from "./components/AnimateOnView";

const modules = [
  {
    icon: AlertTriangle,
    title: "Real-Time Alerts",
    desc: "Live disaster alerts for floods, landslides, earthquakes, wildfires & extreme weather with location-based notifications.",
    href: "/alerts",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    desc: "Machine learning engine analyzing weather, terrain & historical data to forecast disaster risks before they happen.",
    href: "/predictions",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    desc: "Centralized command center for municipalities, police & disaster authorities with live monitoring.",
    href: "/admin",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Phone,
    title: "Emergency SOS",
    desc: "One-click emergency alert with GPS location sent to nearest authorities. Works offline via SMS.",
    href: "/sos",
    color: "text-red-600",
    bg: "bg-red-600/10",
  },
  {
    icon: MapPin,
    title: "Evacuation Finder",
    desc: "Locate nearest shelters, hospitals & police stations with safe evacuation routes during emergencies.",
    href: "/evacuate",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Eye,
    title: "Fund Transparency",
    desc: "Full public visibility into disaster relief budgets, fund distribution & rescue operation status.",
    href: "/transparency",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Volunteer & Relief",
    desc: "Register as volunteer, donate, track relief inventory & get assigned to disaster response tasks.",
    href: "/volunteer",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
];

const stats = [
  { value: "77", label: "Districts Covered" },
  { value: "24/7", label: "Real-Time Monitoring" },
  { value: "< 30s", label: "Alert Delivery" },
  { value: "100%", label: "Fund Transparency" },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #16a34a18 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Green soft wash top-right */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-green-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-green-50/80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[88vh] flex-col items-center gap-10 lg:flex-row lg:gap-0">
            {/* Left — Text */}
            <div className="flex flex-1 flex-col justify-center pt-16 lg:pt-0 lg:pr-12">
              {/* Live badge */}
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-semibold text-green-700 animate-fade-in-down delay-0">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                </span>
                Live Monitoring Active — 77 Districts
              </div>

              <h1 className="text-[2.8rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:text-6xl lg:text-[4rem] animate-slide-in-left delay-150">
                Hamro
                <br />
                <span className="text-green-600">Suraksha</span>
              </h1>
              <p className="mt-1 text-2xl font-medium tracking-wide text-gray-400 animate-slide-in-left delay-250">
                हाम्रो सुरक्षा
              </p>

              <p className="mt-6 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg animate-slide-in-left delay-350">
                Nepal&apos;s AI-powered disaster management platform —
                connecting citizens, governments &amp; emergency responders
                through real-time alerts, transparent relief funds, and
                one-click SOS.
              </p>

              {/* Feature pills */}
              <div className="mt-6 flex flex-wrap gap-2 animate-fade-in-up delay-450">
                {[
                  { icon: Activity, label: "Real-time alerts" },
                  { icon: Brain, label: "AI predictions" },
                  { icon: Eye, label: "Fund transparency" },
                  { icon: Phone, label: "Offline SOS" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    <Icon className="h-3.5 w-3.5 text-green-600" />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-3 animate-fade-in-up delay-550">
                <Link
                  href="/alerts"
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-green-200 transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-300"
                >
                  View Live Alerts
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sos"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:border-green-300 hover:text-green-700"
                >
                  <Phone className="h-4 w-4" />
                  Emergency SOS
                </Link>
              </div>

              {/* Mini stats row */}
              <div className="mt-10 flex flex-wrap gap-6 border-t border-gray-100 pt-8 animate-fade-in-up delay-650">
                {[
                  { val: "77", sub: "Districts" },
                  { val: "24/7", sub: "Monitoring" },
                  { val: "<30s", sub: "Alert speed" },
                  { val: "100%", sub: "Transparent" },
                ].map(({ val, sub }) => (
                  <div key={sub}>
                    <div className="text-2xl font-black text-gray-900">
                      {val}
                    </div>
                    <div className="text-xs text-gray-400">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Globe */}
            <div className="relative flex w-full items-center justify-center lg:w-[520px] lg:flex-none lg:self-stretch">
              {/* Floating alert cards */}
              <div className="pointer-events-none absolute left-0 top-1/4 z-10 hidden lg:block animate-float delay-0">
                <div className="w-48 rounded-xl border border-red-100 bg-white p-3 shadow-lg shadow-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Flood Alert
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Sunsari District
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-[72%] rounded-full bg-red-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-red-500">
                      72%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-1/3 right-0 z-10 hidden lg:block animate-float-alt delay-350">
                <div className="w-44 rounded-xl border border-green-100 bg-white p-3 shadow-lg shadow-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        SOS Resolved
                      </p>
                      <p className="text-[10px] text-gray-400">Makwanpur</p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] text-gray-400">
                    Response in 4 min 32s
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute right-4 top-1/4 z-10 hidden lg:block animate-float delay-650">
                <div className="w-40 rounded-xl border border-amber-100 bg-white p-3 shadow-lg shadow-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        AI Risk Score
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Pokhara Valley
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-base font-black text-amber-500">
                    58%
                  </p>
                </div>
              </div>

              {/* Globe */}
              <div className="h-[420px] w-full sm:h-[520px] lg:h-full animate-scale-in delay-250">
                <EarthGlobe />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin divider strip */}
      <div className="border-t border-gray-100" />

      {/* Modules Grid */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateOnView className="mb-12 flex flex-col items-start gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-green-600">
              Platform
            </span>
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              8 Integrated Systems
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-500">
              Each module solves a critical gap in Nepal&apos;s disaster
              management ecosystem — together forming a closed-loop response
              system.
            </p>
          </AnimateOnView>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod, i) => (
              <AnimateOnView key={mod.href} delay={i * 80}>
                <Link
                  href={mod.href}
                  className="group block rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:border-green-200 hover:bg-green-50/40 hover:shadow-md"
                >
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${mod.bg}`}
                  >
                    <mod.icon className={`h-5 w-5 ${mod.color}`} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-800 group-hover:text-green-700">
                    {mod.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                    {mod.desc}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-green-600 opacity-0 transition-all group-hover:opacity-100">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimateOnView className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-green-500">
              How it works
            </span>
            <h2 className="mt-2 text-3xl font-black text-white">
              Closed-Loop Response
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
              From AI prediction to recovery — every step connected.
            </p>
          </AnimateOnView>

          <AnimateOnView direction="scale">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-800 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: Brain,
                  title: "AI Predicts Risk",
                  desc: "Machine learning analyzes weather, terrain & historical data to forecast threats before they strike.",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
                {
                  step: "02",
                  icon: AlertTriangle,
                  title: "Alerts Dispatched",
                  desc: "Citizens get location-based warnings instantly. Incident reports flow into the authority dashboard.",
                  color: "text-amber-400",
                  bg: "bg-amber-500/10",
                },
                {
                  step: "03",
                  icon: Phone,
                  title: "SOS & Recovery",
                  desc: "Emergency SOS triggers rescue dispatch. Evacuation centers activate. Relief funds are tracked publicly.",
                  color: "text-green-400",
                  bg: "bg-green-500/10",
                },
              ].map((item, i) => (
                <div key={item.step} className="relative bg-gray-900 p-8">
                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-600">
                        {item.step}
                      </p>
                      <h3 className="mt-0.5 text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 sm:block">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 bg-gray-900">
                        <ArrowRight className="h-3 w-3 text-gray-500" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              {
                icon: Zap,
                title: "Speed",
                desc: "Alerts in under 30 seconds. Real-time monitoring across all 77 districts.",
                accent: "bg-yellow-50 text-yellow-600",
              },
              {
                icon: Lock,
                title: "Transparency",
                desc: "Every rupee of disaster relief funds tracked and publicly visible.",
                accent: "bg-green-50 text-green-600",
              },
              {
                icon: Globe,
                title: "Accessibility",
                desc: "Offline SMS fallback. Nepali language support. Built for rural Nepal.",
                accent: "bg-blue-50 text-blue-600",
              },
            ].map((v, i) => (
              <AnimateOnView
                key={v.title}
                delay={i * 140}
                className="px-8 py-10 first:pl-0 last:pr-0"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${v.accent}`}
                >
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {v.desc}
                </p>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 px-4 py-20 sm:px-6 lg:px-8">
        <AnimateOnView
          className="mx-auto max-w-3xl text-center"
          direction="scale"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">
            <Shield className="h-3.5 w-3.5" />
            Hamro Suraksha
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Stay Safe. Stay Informed.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-green-100">
            Join Nepali citizens, volunteers &amp; governments using Hamro
            Suraksha for real-time disaster awareness and transparent relief
            operations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-green-700 shadow-lg transition-all hover:bg-green-50"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-7 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              <Users className="h-4 w-4" />
              Become a Volunteer
            </Link>
          </div>
        </AnimateOnView>
      </section>
    </div>
  );
}
