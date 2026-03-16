"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/economy", label: "Economic Indicators" },
  { href: "/consumer-credit", label: "Consumer Credit" },
  { href: "/small-business", label: "Small Business" },
  { href: "/markets", label: "Betting Markets" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-brand-dark border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/fundbox-logo-white.svg"
              alt="Fundbox"
              width={120}
              height={28}
              priority
            />
            <span className="text-white/40 text-sm font-medium hidden sm:block">
              Macro Insights
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-blue text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile nav — simple scrollable row */}
          <nav className="flex md:hidden items-center gap-1 overflow-x-auto">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-brand-blue text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
