import { getMacroData, formatPct } from "../lib/data";
import { Calendar, Info } from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-brand-dark mb-4 flex items-center gap-2">
      {children}
    </h2>
  );
}

function ChangeCell({ value, suffix = "pp", invert = false }: { value: number; suffix?: string; invert?: boolean }) {
  const sign = value > 0 ? "+" : "";
  const cls =
    value === 0
      ? "text-brand-muted"
      : (value > 0) !== invert
      ? "text-accent-red font-semibold"
      : "text-accent-green font-semibold";
  return <span className={cls}>{sign}{value.toFixed(2)}{suffix}</span>;
}

export default function Economy() {
  const data = getMacroData();
  const lastUpdated = data._meta.lastUpdated;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
            Economic Indicators
          </p>
          <h1 className="text-3xl font-bold text-brand-dark">
            Macro Economic Dashboard
          </h1>
          <p className="mt-2 text-brand-muted text-sm">
            GDP forecasts, inflation, jobs, Fed rates, and consumer conditions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-brand-muted bg-white border border-surface-border rounded-lg px-3 py-2">
          <Calendar className="w-3.5 h-3.5" />
          Updated: {lastUpdated}
        </div>
      </div>

      <div className="space-y-8">
        {/* GDP */}
        <section className="card p-6">
          <SectionTitle>GDP Forecasts — {data.gdp.quarter}</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Source</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Date</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Growth</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Prior</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Change</th>
                </tr>
              </thead>
              <tbody>
                {data.gdp.sources.map((s) => (
                  <tr key={s.name} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                    <td className="py-2.5 px-3 font-medium text-brand-dark">{s.name}</td>
                    <td className="py-2.5 px-3 text-brand-muted">{s.date}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-dark">{s.growth}%</td>
                    <td className="py-2.5 px-3 text-right font-mono text-brand-muted">{s.prior}%</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <ChangeCell value={s.change} suffix="pp" />
                    </td>
                  </tr>
                ))}
                <tr className="bg-brand-light">
                  <td className="py-2.5 px-3 font-semibold text-brand-dark">Average</td>
                  <td className="py-2.5 px-3 text-brand-muted">—</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-dark">{data.gdp.average.current}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-brand-muted">{data.gdp.average.prior}%</td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <ChangeCell value={data.gdp.average.change} suffix="pp" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Inflation */}
        <section className="card p-6">
          <SectionTitle>Inflation Forecasts</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Metric</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Month</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Current</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Prior</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">Change</th>
                </tr>
              </thead>
              <tbody>
                {data.inflation.sources.map((s, i) => (
                  <tr key={i} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                    <td className="py-2.5 px-3 font-medium text-brand-dark">{s.metric}</td>
                    <td className="py-2.5 px-3 text-brand-muted">{s.month}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-dark">{formatPct(s.current, 2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-brand-muted">{formatPct(s.prior, 2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <ChangeCell value={s.change} suffix="pp" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-brand-muted flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Source: Cleveland Fed Nowcasting
          </p>
        </section>

        {/* Jobs */}
        <section className="card p-6">
          <SectionTitle>Jobs Report — February 2026</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatBox
              label="Payrolls"
              value={`${data.jobs.payrolls.value > 0 ? "+" : ""}${Math.round(data.jobs.payrolls.value / 1000)}K`}
              changeColor={data.jobs.payrolls.value < 0 ? "red" : "green"}
              note={data.jobs.payrolls.note}
            />
            <StatBox
              label="Unemployment Rate"
              value={formatPct(data.jobs.unemploymentRate.value)}
              changeColor={data.jobs.unemploymentRate.change > 0 ? "red" : "green"}
              note={`Prior: ${formatPct(data.jobs.unemploymentRate.prior)}`}
            />
            <StatBox
              label="Avg Hourly Earnings MoM"
              value={formatPct(data.jobs.avgHourlyEarningsMoM.value, 1)}
              changeColor="neutral"
              note={`Prior: ${formatPct(data.jobs.avgHourlyEarningsMoM.prior, 1)}`}
            />
            <StatBox
              label="ADP Private Payrolls"
              value={`+${Math.round(data.jobs.adpPrivate.value / 1000)}K`}
              changeColor="neutral"
              note={`Date: ${data.jobs.adpPrivate.date}`}
            />
          </div>
          <div className="p-4 bg-surface-muted rounded-lg border border-surface-border">
            <p className="text-sm text-brand-muted leading-relaxed">
              <strong className="text-brand-dark">Context:</strong> Payrolls unexpectedly fell by 92K (market expected +50K). December revised down 65K; January down 4K. ~30K of February loss tied to a temporary workers&apos; strike. Unemployment rate rose to 4.4%. Average hourly earnings +3.8% YoY, 0.1pp above forecast. Initial jobless claims: {data.jobs.initialJoblessClaims.value.toLocaleString()} (week ending {data.jobs.initialJoblessClaims.weekEnding}).
            </p>
          </div>
        </section>

        {/* Fed */}
        <section className="card p-6">
          <SectionTitle>Federal Reserve</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <StatBox label="Fed Funds Rate" value={data.fedFundsRate.current} changeColor="neutral" />
            <StatBox label="Last FOMC Meeting" value={data.fedFundsRate.lastMeeting} changeColor="neutral" />
            <StatBox label="Market-Implied Cuts (2026)" value={`${data.fedFundsRate.marketImpliedCuts2026} cuts`} changeColor="neutral" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-3">
              Goldman Sachs Rate Cut Forecast
            </p>
            <div className="flex flex-wrap gap-3">
              {data.fedFundsRate.goldmanCutForecast.map((cut) => (
                <div
                  key={cut.meeting}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-light rounded-lg"
                >
                  <span className="text-sm font-medium text-brand-dark">{cut.meeting}</span>
                  <span className="text-sm font-mono font-bold text-brand-blue">{cut.targetRange}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Consumer Conditions */}
        <section className="card p-6">
          <SectionTitle>Consumer Conditions</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatBox
              label="Conference Board Confidence"
              value={`${data.consumerSentiment.conferenceBoardConfidence.value}`}
              changeColor="red"
              note={data.consumerSentiment.conferenceBoardConfidence.note}
            />
            <StatBox
              label="U. of Michigan Sentiment"
              value={`${data.consumerSentiment.umichSentiment.value}`}
              changeColor="red"
              note={data.consumerSentiment.umichSentiment.note}
            />
            <StatBox
              label="Personal Savings Rate"
              value={formatPct(data.personalSavingsRate.value)}
              changeColor="red"
              note={`Long-run avg: ${formatPct(data.personalSavingsRate.longRunAverage)}`}
            />
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Warning signal:</strong> Conference Board Confidence at 84.5 is the lowest since May 2014. Personal savings rate at 3.5% is half the long-run average — exhausted pandemic-era buffers leave no cushion for shocks.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  changeColor,
  note,
}: {
  label: string;
  value: string;
  changeColor: "red" | "green" | "neutral";
  note?: string;
}) {
  const valueClass =
    changeColor === "red"
      ? "text-accent-red"
      : changeColor === "green"
      ? "text-accent-green"
      : "text-brand-dark";

  return (
    <div className="p-3 bg-surface-muted rounded-lg border border-surface-border">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1">
        {label}
      </p>
      <p
        className={`font-mono font-bold text-xl ${valueClass}`}
        style={{ fontFamily: "monospace" }}
      >
        {value}
      </p>
      {note && <p className="text-xs text-brand-muted mt-1 leading-relaxed">{note}</p>}
    </div>
  );
}
