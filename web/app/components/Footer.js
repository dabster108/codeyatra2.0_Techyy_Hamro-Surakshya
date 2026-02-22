"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Hamro Suraksha
            </h3>
            <p className="mt-2 text-sm text-muted">
              Nepal&apos;s unified disaster management and public safety
              platform. Connecting citizens, governments, and emergency
              authorities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/alerts", label: "Disaster Alerts" },
                { href: "/predictions", label: "Risk Predictions" },
                { href: "/evacuate", label: "Evacuation Centers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-green-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/transparency", label: "Fund Transparency" },
                { href: "/volunteer", label: "Volunteer" },
                { href: "/admin", label: "Admin Dashboard" },
                { href: "/sos", label: "Emergency SOS" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-green-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Emergency Contacts
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>Nepal Police: <span className="font-medium text-foreground">100</span></li>
              <li>Fire Brigade: <span className="font-medium text-foreground">101</span></li>
              <li>Ambulance: <span className="font-medium text-foreground">102</span></li>
              <li>NDRRMA: <span className="font-medium text-foreground">1155</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          <p>
            © {new Date().getFullYear()} Hamro Suraksha. Built for Himalayan Hackathon 🇳🇵
          </p>
        </div>
      </div>
    </footer>
  );
}
