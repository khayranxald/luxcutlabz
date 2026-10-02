import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LUXCUTLABZ Barbershop — Stay Sharp. Stay Lux.",
  description:
    "LUXCUTLABZ Barbershop: modern, premium barbershop experience. Book your cut online or via WhatsApp.",
  openGraph: {
    title: "LUXCUTLABZ Barbershop",
    description: "Stay Sharp. Stay Lux. Booking online atau via WhatsApp.",
    url: "https://luxcutlabz.com",
    siteName: "LUXCUTLABZ Barbershop",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}