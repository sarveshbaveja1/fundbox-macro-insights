import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Fundbox Macro Insights | Lending Industry Trends",
  description:
    "Macro economic trends for the lending industry — economic indicators, consumer credit, small business lending, and market signals. Powered by Fundbox.",
  openGraph: {
    title: "Fundbox Macro Insights",
    description: "Lending industry macro trends for risk managers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-brand-dark text-white/50 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/fundbox-logo-white.svg" alt="Fundbox" className="h-6 opacity-70" />
              <span className="text-sm">Macro Insights</span>
            </div>
            <p className="text-xs text-center">
              For informational purposes only. Not investment advice.
              Data sourced from FRED, BLS, Atlanta Fed, and public market data.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
