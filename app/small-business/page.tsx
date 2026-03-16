"use client";

import { getMacroData, getSmallBusinessReports, formatPct } from "../lib/data";
import ReportCard from "../components/ReportCard";
import { AlertTriangle, TrendingDown, Info } from "lucide-react";

export default function SmallBusiness() {
  const data = getMacroData();
  const reports = getSmallBusinessReports();
  const sbi = data.smallBusinessIndicators;

  const sbiExpanding = sbi.experianSmallBusinessIndex.value > 40;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
          Small Business Credit Trends
        </p>
        <h1 className="text-3xl font-bold text-brand-dark">
          Small Business Lending &amp; Credit Risk
        </h1>
        <p className="mt-2 text-brand-muted text-sm">
          SMB credit health, lending standards, tariff impact, and adverse selection dynamics.
        </p>
      </div>

      <div className="space-y-8">
        {/* Leading Indicators */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            Small Business Health Indicators
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-surface-muted rounded-lg border border-surface-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                Experian SBI
              </p>
              <p
                className={`font-mono font-bold text-2xl ${sbiExpanding ? "text-accent-green" : "text-accent-red"}`}
                style={{ fontFamily: "monospace" }}
              >
                {sbi.experianSmallBusinessIndex.value}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded font-semibold mt-1 inline-block ${
                  sbiExpanding
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {sbiExpanding ? "Expanding (>40)" : "Retreating (<40)"}
              </span>
              <p className="text-xs text-brand-muted mt-1">{sbi.experianSmallBusinessIndex.note}</p>
            </div>

            <div className="p-4 bg-surface-muted rounded-lg border border-surface-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                NFIB Optimism Index
              </p>
              <p
                className="font-mono font-bold text-2xl text-brand-dark"
                style={{ fontFamily: "monospace" }}
              >
                {sbi.nfibOptimismIndex.value}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                52-yr avg: {sbi.nfibOptimismIndex.average52yr}
              </p>
            </div>

            <div className="p-4 bg-surface-muted rounded-lg border border-surface-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                Bank Tightening (SLOOS)
              </p>
              <p
                className="font-mono font-bold text-2xl text-accent-red"
                style={{ fontFamily: "monospace" }}
              >
                {sbi.bankTighteningPct.q3}%
              </p>
              <p className="text-xs text-brand-muted mt-1">
                Q1 was {sbi.bankTighteningPct.q1}% — pace moderated but still tightening
              </p>
            </div>

            <div className="p-4 bg-surface-muted rounded-lg border border-surface-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
                Subprime Orig. Share
              </p>
              <p
                className="font-mono font-bold text-2xl text-accent-red"
                style={{ fontFamily: "monospace" }}
              >
                {formatPct(data.consumerCredit.subprimeOriginationShare.q3_2025)}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                Down from {formatPct(data.consumerCredit.subprimeOriginationShare.q1_2022)} in Q1 2022
              </p>
            </div>
          </div>
        </section>

        {/* Tariff Impact */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            Tariff Shock — Direct SMB Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-1">
                Current Avg Tariff Rate
              </p>
              <p className="font-mono font-bold text-3xl text-red-600" style={{ fontFamily: "monospace" }}>
                {sbi.tariffAvgRate.current}%
              </p>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-1">
                If All Announced
              </p>
              <p className="font-mono font-bold text-3xl text-red-600" style={{ fontFamily: "monospace" }}>
                {sbi.tariffAvgRate.ifAllAnnounced}%
              </p>
              <p className="text-xs text-red-500 mt-1">{sbi.tariffAvgRate.note}</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
                Avg Monthly Cost / Small Biz
              </p>
              <p className="font-mono font-bold text-3xl text-amber-600" style={{ fontFamily: "monospace" }}>
                ${(sbi.tariffSmallBizMonthlyCost / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-amber-600 mt-1">Since April 2025</p>
            </div>
          </div>
          <InsightBox
            icon={<TrendingDown className="w-4 h-4 text-accent-red" />}
            title="Industry Concentration Risk"
            text="Businesses serving lower-income consumers (discount retail, food service, personal services) face a double hit: customers spending less AND input costs rising from tariffs. This margin squeeze typically precedes defaults by 3–6 months — making it a leading indicator worth monitoring."
          />
        </section>

        {/* Adverse Selection */}
        <section className="card p-6 border-l-4 border-l-accent-red">
          <h2 className="text-lg font-semibold text-brand-dark mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-red" />
            Adverse Selection — Critical Risk Signal
          </h2>
          <p className="text-sm text-brand-muted mb-4 leading-relaxed">
            With banks pulling subprime origination share from <strong className="text-brand-dark">{formatPct(data.consumerCredit.subprimeOriginationShare.q1_2022)}</strong> to <strong className="text-brand-dark">{formatPct(data.consumerCredit.subprimeOriginationShare.q3_2025)}</strong>, displaced borrowers are seeking alternative lenders. These applicants were rejected for a reason.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InsightBox
              icon={<Info className="w-4 h-4 text-brand-blue" />}
              title="Volume as a Warning Signal"
              text="Volume growth at alternative lenders in this environment is not a positive indicator — it may represent a structural shift in applicant quality driven by bank pullback, not organic growth."
            />
            <InsightBox
              icon={<Info className="w-4 h-4 text-accent-orange" />}
              title="Credit Scores Are Lagging"
              text="Between pandemic score inflation, BNPL phantom debt, and student loan reporting gaps, score-based underwriting is less reliable than at any point in the last decade. Cash flow and bank transaction data are better real-time indicators."
            />
          </div>
        </section>

        {/* Reports */}
        {reports.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-brand-dark mb-4">
              Report Syntheses — Small Business Credit
            </h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </section>
        )}

        {reports.length === 0 && (
          <section className="card p-8 text-center text-brand-muted">
            <p className="text-sm">
              No SMB report syntheses yet. Add entries to{" "}
              <code className="text-xs bg-surface-muted px-1.5 py-0.5 rounded">
                data/2os-reports.json
              </code>{" "}
              or{" "}
              <code className="text-xs bg-surface-muted px-1.5 py-0.5 rounded">
                data/transunion-reports.json
              </code>{" "}
              with <code className="text-xs bg-surface-muted px-1.5 py-0.5 rounded">&quot;category&quot;: &quot;small-business&quot;</code>.
            </p>
          </section>
        )}
      </div>
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
