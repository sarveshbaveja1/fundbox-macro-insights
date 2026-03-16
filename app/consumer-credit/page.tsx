"use client";

import { getMacroData, getConsumerReports, formatPct } from "../lib/data";
import ReportCard from "../components/ReportCard";
import { AlertTriangle, Info } from "lucide-react";

export default function ConsumerCredit() {
  const data = getMacroData();
  const reports = getConsumerReports();
  const cc = data.consumerCredit;
  const kShape = data.kShapedEconomy;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
          Consumer Credit Trends
        </p>
        <h1 className="text-3xl font-bold text-brand-dark">
          Consumer Credit &amp; Lending Stress
        </h1>
        <p className="mt-2 text-brand-muted text-sm">
          Delinquency rates, credit migration risk, BNPL phantom debt, and structural bifurcation.
        </p>
      </div>

      <div className="space-y-8">
        {/* Credit card */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            Credit Card Delinquency
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <StatBox
              label="90+ DPD — 2026 Forecast"
              value="2.57%"
              badge="TransUnion"
              color="red"
            />
            <StatBox
              label="Subprime Origination Share"
              value={formatPct(cc.subprimeOriginationShare.q3_2025)}
              badge="Q3 2025"
              color="red"
            />
            <StatBox
              label="Subprime Share — 2022 Peak"
              value={formatPct(cc.subprimeOriginationShare.q1_2022)}
              badge="Q1 2022"
              color="neutral"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InsightBox
              icon={<AlertTriangle className="w-4 h-4 text-accent-orange" />}
              title="Vintage Deterioration"
              text="2025 credit card vintage delinquencies are tracking the 2022 vintage — the worst-performing in six years. No improvement expected in 2026."
            />
            <InsightBox
              icon={<Info className="w-4 h-4 text-brand-blue" />}
              title="Score Inflation Unwinding"
              text="Pandemic-era forbearance inflated scores. As effects unwind, borrowers are migrating back to their true risk tier. 2021–22 originations may be 50+ bps riskier than originated score suggests."
            />
          </div>
        </section>

        {/* BNPL */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            BNPL — The Hidden Leverage Layer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <StatBox label="Late Payments — 2025" value={formatPct(cc.bnplLatePayment2025.value)} color="red" />
            <StatBox label="Late Payments — 2024" value={formatPct(cc.bnplLatePayment2025.prior2024)} color="neutral" />
            <StatBox label="Late Payments — 2023" value={formatPct(cc.bnplLatePayment2025.prior2023)} color="neutral" />
            <StatBox label="Gen Z Late Rate" value={formatPct(cc.bnplLatePayment2025.genZRate)} color="red" />
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Phantom debt risk:</strong> BNPL balances are largely unreported to credit bureaus. A borrower at 660 may have 2–3 BNPL obligations masking their real debt service burden. Score-based underwriting systematically understates true leverage for a material segment of the borrower population.
            </p>
          </div>
        </section>

        {/* Student Loans */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            Student Loan Delinquencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
            <StatBox label="Delinquency Rate" value={`${cc.studentLoanDQPct.value}%+`} badge="3× pre-pandemic" color="red" />
            <StatBox label="Balance 90+ DPD" value={formatPct(cc.studentLoanDQPct.balanceDQPct)} color="red" />
            <StatBox label="Pre-Pandemic DQ Rate" value={formatPct(cc.studentLoanDQPct.preParidemic)} color="neutral" />
          </div>
          <InsightBox
            icon={<AlertTriangle className="w-4 h-4 text-accent-red" />}
            title="Cascading Impact on Small Business Owners"
            text={cc.studentLoanDQPct.note + " Average credit score drop post-default: 63 points (can reach 175 points for 780+ score borrowers). Small business owners whose personal credit deteriorates are more likely to draw on business credit lines for personal obligations."}
          />
        </section>

        {/* Auto */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            Auto Loan Stress
          </h2>
          <InsightBox
            icon={<Info className="w-4 h-4 text-brand-blue" />}
            title="Sustained Elevated Delinquencies (3 Years)"
            text="Auto loan DQs have been elevated since 2022 but are stabilizing. Average monthly payments remain at historic highs because vehicle prices have not normalized post-pandemic. For multi-product borrowers, high auto payments reduce capacity for other obligations — increasing default correlation risk across product types."
          />
        </section>

        {/* K-Shaped Economy */}
        <section className="card p-6 bg-gradient-to-br from-brand-dark to-blue-900 text-white">
          <h2 className="text-lg font-semibold text-white mb-2">
            The K-Shaped Economy
          </h2>
          <p className="text-sm text-white/60 mb-6">
            The post-pandemic recovery has been deeply bifurcated — and the gap is widening.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <KShapeBox
              label="Top 10% spending share"
              value={formatPct(kShape.top10PctSpendingShare.value)}
              sub="up from ~35% in the 1990s"
            />
            <KShapeBox
              label="Top 1% net worth"
              value={formatPct(kShape.top1PctNetWorthShare)}
              sub="~$48.4T"
            />
            <KShapeBox
              label="Bottom 50% net worth"
              value={formatPct(kShape.bottom50PctNetWorthShare)}
              sub="~$3.8T"
            />
            <KShapeBox
              label="Low-income wage growth"
              value={formatPct(kShape.wageTrends.lowIncomeQ1_Dec2025)}
              sub={`vs. ${formatPct(kShape.wageTrends.highIncomeQ4_Dec2025)} high-income`}
              alert
            />
          </div>
          <p className="text-sm text-white/70 leading-relaxed border-t border-white/20 pt-4">
            <strong className="text-white">First time in 15 years:</strong>{" "}
            {kShape.wageTrends.note}. The natural inequality-correction mechanism is gone.
            Headline GDP looks fine because the top 10% drives half of spending — but
            Fundbox&apos;s borrower segment lives in the bottom half of the K.
          </p>
        </section>

        {/* Reports */}
        {reports.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-brand-dark mb-4">
              Report Syntheses — Consumer Credit
            </h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  badge,
  color,
}: {
  label: string;
  value: string;
  badge?: string;
  color: "red" | "green" | "neutral";
}) {
  const valueClass =
    color === "red"
      ? "text-accent-red"
      : color === "green"
      ? "text-accent-green"
      : "text-brand-dark";

  return (
    <div className="p-3 bg-surface-muted rounded-lg border border-surface-border">
      {badge && (
        <span className="text-xs text-brand-blue font-semibold bg-brand-light px-1.5 py-0.5 rounded mb-1.5 inline-block">
          {badge}
        </span>
      )}
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
        {label}
      </p>
      <p
        className={`font-mono font-bold text-xl ${valueClass}`}
        style={{ fontFamily: "monospace" }}
      >
        {value}
      </p>
    </div>
  );
}

function InsightBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="p-4 bg-surface-muted rounded-lg border border-surface-border">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-semibold text-sm text-brand-dark">{title}</span>
      </div>
      <p className="text-sm text-brand-muted leading-relaxed">{text}</p>
    </div>
  );
}

function KShapeBox({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="p-3 bg-white/10 rounded-lg">
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p
        className={`font-mono font-bold text-xl ${alert ? "text-accent-orange" : "text-white"}`}
        style={{ fontFamily: "monospace" }}
      >
        {value}
      </p>
      <p className="text-xs text-white/50 mt-0.5">{sub}</p>
    </div>
  );
}
