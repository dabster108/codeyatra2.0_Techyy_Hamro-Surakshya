import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Brain,
  FileText,
  LayoutDashboard,
  Phone,
  MapPin,
  Eye,
  Users,
  ArrowRight,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

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
    icon: FileText,
    title: "Citizen Reporting",
    desc: "Report incidents with photos, videos & GPS location. Track response status from submission to resolution.",
    href: "/report",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
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
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary/80">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+\")"}} />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              <span>Nepal&apos;s Smart Disaster Management Platform</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Hamro Suraksha
              <span className="mt-2 block text-2xl font-medium text-white/70 sm:text-3xl">
                हाम्रो सुरक्षा
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              A unified platform connecting citizens, local governments &
              emergency authorities through AI-powered alerts, real-time
              reporting & full financial transparency of disaster relief.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/alerts"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
              >
                View Live Alerts
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Emergency SOS
                <Phone className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            8 Integrated Systems
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Each module solves a critical gap in Nepal&apos;s disaster management
            ecosystem — together they form a closed-loop response system.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${mod.bg}`}
              >
                <mod.icon className={`h-6 w-6 ${mod.color}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary">
                {mod.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {mod.desc}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground">
            How Everything Connects
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted">
            A closed-loop disaster response ecosystem — from prediction to
            recovery.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: Brain,
                title: "AI Predicts Risk",
                desc: "Machine learning analyzes weather, terrain & historical data to forecast threats.",
              },
              {
                step: "02",
                icon: AlertTriangle,
                title: "Alerts Dispatched",
                desc: "Citizens receive location-based warnings. Reports flow into the dashboard.",
              },
              {
                step: "03",
                icon: Phone,
                title: "SOS & Rescue",
                desc: "Emergency alerts trigger response teams. Evacuation centers activate.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border p-6"
              >
                <span className="text-5xl font-black text-primary/10">
                  {item.step}
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Speed",
              desc: "Alerts delivered in under 30 seconds. Real-time monitoring across all 77 districts.",
            },
            {
              icon: Lock,
              title: "Transparency",
              desc: "Every rupee of disaster relief funds tracked and publicly visible.",
            },
            {
              icon: Globe,
              title: "Accessibility",
              desc: "Works offline via SMS. Supports Nepali language. Built for rural connectivity.",
            },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Stay Safe. Stay Informed.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join thousands of Nepali citizens using Hamro Suraksha for real-time
            disaster awareness and community safety.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all hover:bg-gray-100"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
