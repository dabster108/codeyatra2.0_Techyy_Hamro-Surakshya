import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { DashboardProvider } from "@/components/providers/dashboard-provider";
import { RelationalProvider } from "@/components/providers/relational-provider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hamro Surakshya - Disaster Management Fund Tracking",
  description: "Professional government-grade disaster management dashboard for Nepal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased bg-[#f8fafc]`}>
        <DashboardProvider>
          <RelationalProvider>
            <Toaster position="top-right" richColors />
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                  {children}
                </main>
              </div>
            </div>
          </RelationalProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}
