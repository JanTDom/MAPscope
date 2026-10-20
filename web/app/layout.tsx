import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAPscope — Radar Ryzyka Właścicielskiego i Komunikacyjnego",
  description:
    "System Monitoringu, Wczesnego Ostrzegania i Analizy Ryzyka dla Ministerstwa Aktywów Państwowych oraz Wszystkich Spółek z Udziałem Skarbu Państwa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="antialiased min-h-screen bg-[#06090e] text-[#f3f6f9]">
        {children}
      </body>
    </html>
  );
}
