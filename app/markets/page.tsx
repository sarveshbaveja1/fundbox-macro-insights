import { getMacroData, formatPct } from "../lib/data";
import { Info, TrendingUp, TrendingDown } from "lucide-react";

function ChangeCell({
  value,
  suffix = "pp",
}: {
  value: number;
  suffix?: string;
}) {
  const sign = value > 0 ? "+" : "";
  const cls =
    value === 0
      ? "text-brand-muted"
      : value > 0
      ? "text-accent-red font-semibold"
      : "text-accent-green font-semibold";
  return (
    <span className={cls}>
      {sign}
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function Markets() {
  const data = getMacroData();
  const recession = data.recession;
  const gdp = data.gdp;

  const avgRecession = recession.average.current;
  const riskLevel =
    avgRecession >= 40 ? "High" : avgRecession >= 25 ? "Elevated" : "Moderate";
  const riskColor =
    avgRecession >= 40
      ? "text-accent-red"
      : avgRecession >= 25
      ? "text-accent-orange"
      : "text-accent-green";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
          Betting Market Trends
        </p>
        <h1 className="text-3xl font-bold text-brand-dark">
          Recession Odds &amp; Market Forecasts
        </h1>
        <p className="mt-2 text-brand-muted text-sm">
          Prediction market probabilities and institutional GDP forecasts — not investment advice.
        </p>
      </div>

      <div className="space-y-8">
        {/* Recession Probability Highlight */}
        <section className="card p-6 bg-brand-dark text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
            Consensus Recession Probability — Before 2027
          </p>
          <div className="flex items-end gap-6 mb-6">
            <div>
              <p
                className={`font-mono font-bold text-6xl ${riskColor}`}
                style={{ fontFamily: "monospace" }}
              >
                {avgRecession}%
              </p>
              <p className="text-white/50 text-sm mt-1">Average across sources</p>
            </div>
            <div className="mb-2">
              <span
                className={`text-lg font-semibold px-3 py-1 rounded-lg ${
                  avgRecession >= 40
                    ? "bg-red-900/50 text-red-300"
                    : avgRecession >= 25
                    ? "bg-amber-900/50 text-amber-300"
                    : "bg-green-900/50 text-green-300"
                }`}
              >
                {riskLevel} Risk
              </span>
              <p className={`text-sm mt-2 ${riskColor}`}>
                +{recession.average.change}pp WoW
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs text-white/40 mb-1">Prior week avg</p>
              <p className="font-mono font-bold text-white/80 text-xl" style={{ fontFamily: "monospace" }}>
                {recession.average.prior}%
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">WoW change</p>
              <p className={`font-mono font-bold text-xl ${riskColor}`} style={{ fontFamily: "monospace" }}>
                +{recession.average.change}pp
              </p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Sources</p>
              <p className="text-white/80 text-sm">Kalshi, Polymarket, Goldman</p>
            </div>
          </div>
        </section>

        {/* Source breakdown */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            Recession Probability — By Source
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Source
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Date
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Current
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Prior Week
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    WoW Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {recession.sources.map((s) => (
                  <tr
                    key={s.name}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50"
                  >
                    <td className="py-3 px-3 font-medium text-brand-dark">
                      <div className="flex items-center gap-2">
                        {s.change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-accent-red" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-accent-green" />
                        )}
                        {s.name}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-brand-muted">{s.date}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className="font-mono font-bold text-brand-dark"
                        style={{ fontFamily: "monospace" }}
                      >
                        {s.probability}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-brand-muted">
                      {s.prior !== undefined ? `${s.prior}%` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <ChangeCell value={s.change} suffix="pp" />
                    </td>
                  </tr>
                ))}
                <tr className="bg-brand-light">
                  <td className="py-2.5 px-3 font-semibold text-brand-dark">Average</td>
                  <td className="py-2.5 px-3 text-brand-muted">—</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-dark">
                    {recession.average.current}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-brand-muted">
                    {recession.average.prior}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <ChangeCell value={recession.average.change} suffix="pp" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* GDP Forecasts */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-brand-dark mb-4">
            GDP Growth Predictions — {gdp.quarter}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Source
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Date
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    GDP Growth
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Prior
                  </th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {gdp.sources.map((s) => (
                  <tr
                    key={s.name}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50"
                  >
                    <td className="py-2.5 px-3 font-medium text-brand-dark">{s.name}</td>
                    <td className="py-2.5 px-3 text-brand-muted">{s.date}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-mono font-bold text-brand-dark" style={{ fontFamily: "monospace" }}>
                        {formatPct(s.growth)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-brand-muted">
                      {formatPct(s.prior)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      <ChangeCell value={s.change} suffix="pp" />
                    </td>
                  </tr>
                ))}
                <tr className="bg-brand-light">
                  <td className="py-2.5 px-3 font-semibold text-brand-dark">Average</td>
                  <td className="py-2.5 px-3 text-brand-muted">—</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-brand-dark">
                    {formatPct(gdp.average.current)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-brand-muted">
                    {formatPct(gdp.average.prior)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <ChangeCell value={gdp.average.change} suffix="pp" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Explainer */}
        <section className="card p-6 bg-surface-muted">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-brand-dark mb-2">
                About Prediction Markets vs. Institutional Forecasts
              </h3>
              <div className="space-y-2 text-sm text-brand-muted leading-relaxed">
                <p>
                  <strong className="text-brand-dark">Kalshi and Polymarket</strong> are real-money prediction markets where traders buy and sell contracts tied to whether a recession will occur. Prices reflect the aggregated beliefs of market participants with money at stake.
                </p>
                <p>
                  <strong className="text-brand-dark">Goldman Sachs</strong> represents institutional economic forecasting — based on proprietary macro models and research teams.
                </p>
                <p>
                  Both types of forecasts are imprecise. They are most useful as <em>relative indicators</em> — tracking directional change week-over-week matters more than the absolute number. A sustained rise in probabilities across all three sources is a stronger signal than any single data point.
                </p>
                <p className="text-xs text-brand-muted pt-2 border-t border-surface-border mt-3">
                  This data is for informational purposes only and does not constitute investment advice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
