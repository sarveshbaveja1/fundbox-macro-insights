import Link from "next/link";
import { TrendingUp, Users, Briefcase, BarChart2, ArrowRight, Calendar } from "lucide-react";
import { getMacroData, formatPct, formatJobs } from "./lib/data";

export default function Dashboard() {
  const data = getMacroData();
  const lastUpdated = data._meta.lastUpdated;

  const recessionAvg = data.recession.average.current;
  const recessionChange = data.recession.average.change;
  const gdpAvg = data.gdp.average.current;
  const cpiYoY = data.inflation.sources.find((s) => s.metric === "Core CPI YoY");
  const jobs = data.jobs;
  const fed = data.fedFundsRate;

  const recessionColor =
    recessionAvg >= 40
      ? "text-accent-red"
      : recessionAvg >= 25
      ? "text-accent-orange"
      : "text-accent-green";

  const sections = [
    {
      href: "/economy",
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Economic Indicators",
      description:
        "GDP forecasts, inflation (CPI/PCE), jobs data, Fed funds rate, personal savings rate, and consumer sentiment.",
      metrics: [
        { label: "GDP Q1 (avg)", value: `${gdpAvg}%` },
        { label: "Core CPI YoY", value: cpiYoY ? formatPct(cpiYoY.current) : "—" },
      ],
    },
    {
      href: "/consumer-credit",
      icon: <Users className="w-5 h-5" />,
      title: "Consumer Credit Trends",
      description:
        "Credit card delinquency vintages, auto loan stress, student loan defaults, BNPL phantom debt, and K-shaped economy dynamics.",
      metrics: [
        { label: "CC 90+ DPD (2026F)", value: "2.57%" },
        { label: "BNPL late payments", value: "42%" },
      ],
    },
    {
      href: "/small-business",
      icon: <Briefcase className="w-5 h-5" />,
      title: "Small Business Credit",
      description:
        "SMB lending standards, charge-off rates, Experian SBI, tariff impact, and adverse selection risk.",
      metrics: [
        {
          label: "Experian SBI",
          value: `${data.smallBusinessIndicators.experianSmallBusinessIndex.value}`,
        },
        {
          label: "Avg tariff rate",
          value: `${data.smallBusinessIndicators.tariffAvgRate.current}%`,
        },
      ],
    },
    {
      href: "/markets",
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Betting Market Trends",
      description:
        "Prediction market recession probabilities from Kalshi, Polymarket, and Goldman Sachs vs. institutional GDP forecasts.",
      metrics: [
        { label: "Recession probability (avg)", value: `${recessionAvg}%` },
        { label: "WoW change", value: `+${recessionChange}pp` },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">
            Lending Industry Macro Insights
          </h1>
          <p className="mt-2 text-brand-muted text-sm">
            For risk managers at banks and fintech lenders. Data updated daily.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-brand-muted bg-white border border-surface-border rounded-lg px-3 py-2">
          <Calendar className="w-3.5 h-3.5" />
          Last updated: {lastUpdated}
        </div>
      </div>

      {/* Top KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        <KpiTile label="GDP Q1 Forecast" value={`${gdpAvg}%`} sub={`Atlanta Fed: ${data.gdp.sources[0].growth}%`} />
        <KpiTile
          label="Core CPI YoY"
          value={cpiYoY ? formatPct(cpiYoY.current) : "—"}
          sub={`as of ${cpiYoY?.date ?? ""}`}
        />
        <KpiTile
          label="Unemployment"
          value={formatPct(jobs.unemploymentRate.value)}
          sub={`${jobs.unemploymentRate.change > 0 ? "+" : ""}${jobs.unemploymentRate.change.toFixed(2)}pp MoM`}
          changeSign={jobs.unemploymentRate.change > 0 ? "bad" : "good"}
        />
        <KpiTile
          label="Fed Funds Rate"
          value={fed.current}
          sub={`Market: ${fed.marketImpliedCuts2026} cuts in 2026`}
        />
        <div className="card p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Recession Odds
          </span>
          <span
            className={`font-mono font-bold text-2xl tracking-tight ${recessionColor}`}
            style={{ fontFamily: "monospace" }}
          >
            {recessionAvg}%
          </span>
          <span className="text-xs text-brand-muted">
            avg · +{recessionChange}pp WoW
          </span>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-brand-light text-brand-blue">{s.icon}</div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-blue transition-colors mt-2" />
            </div>
            <h2 className="font-semibold text-brand-dark text-lg mb-1">{s.title}</h2>
            <p className="text-sm text-brand-muted leading-relaxed mb-4">
              {s.description}
            </p>
            <div className="flex gap-6 pt-3 border-t border-surface-border">
              {s.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-xs text-brand-muted">{m.label}</p>
                  <p
                    className="font-mono font-bold text-brand-dark text-base"
                    style={{ fontFamily: "monospace" }}
                  >
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Context banner */}
      <div className="mt-8 p-5 rounded-xl bg-brand-dark text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
          Week Ending {lastUpdated} — Key Context
        </p>
        <p className="text-sm leading-relaxed text-white/80">
          Recession odds rose to{" "}
          <strong className="text-white">{recessionAvg}%</strong> (avg of Kalshi,
          Polymarket, Goldman) following a weak February jobs report (payrolls:{" "}
          <strong className="text-white">{formatJobs(jobs.payrolls.value)}</strong>) and
          elevated oil prices from Hormuz disruption. Core CPI YoY at{" "}
          <strong className="text-white">
            {cpiYoY ? formatPct(cpiYoY.current) : "—"}
          </strong>{" "}
          remains within estimates. Atlanta Fed GDP nowcast at{" "}
          <strong className="text-white">{data.gdp.sources[0].growth}%</strong> for Q1
          2026.
        </p>
      </div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  sub,
  changeSign,
}: {
  label: string;
  value: string;
  sub?: string;
  changeSign?: "good" | "bad";
}) {
  return (
    <div className="card p-4 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
        {label}
      </span>
      <span
        className="font-mono font-bold text-2xl tracking-tight text-brand-dark"
        style={{ fontFamily: "monospace" }}
      >
        {value}
      </span>
      {sub && (
        <span
          className={`text-xs ${
            changeSign === "bad"
              ? "text-accent-red"
              : changeSign === "good"
              ? "text-accent-green"
              : "text-brand-muted"
          }`}
        >
          {sub}
        </span>
      )}
    </div>
  );
}
