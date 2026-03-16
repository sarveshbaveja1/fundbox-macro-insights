import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  subtext?: string;
  icon?: ReactNode;
  format?: "pct" | "bps" | "number" | "string" | "jobs";
  size?: "sm" | "md" | "lg";
}

function formatChange(change: number, format?: string): string {
  if (format === "pct") return `${change > 0 ? "+" : ""}${change.toFixed(1)}pp`;
  if (format === "jobs") {
    const k = Math.round(change / 1000);
    return `${k > 0 ? "+" : ""}${k}K`;
  }
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}`;
}

export default function MetricCard({
  label,
  value,
  change,
  changeLabel,
  subtext,
  icon,
  format,
  size = "md",
}: MetricCardProps) {
  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  const valueClass =
    size === "lg"
      ? "text-3xl"
      : size === "sm"
      ? "text-xl"
      : "text-2xl";

  return (
    <div className="card p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
          {label}
        </span>
        {icon && <span className="text-brand-muted">{icon}</span>}
      </div>

      <div className="flex items-end gap-3">
        <span
          className={`font-mono font-bold tracking-tight text-brand-dark ${valueClass}`}
          style={{ fontFamily: "var(--font-space-mono, monospace)" }}
        >
          {value}
        </span>

        {change !== undefined && change !== 0 && (
          <span
            className={`text-sm font-semibold mb-0.5 ${
              isPositiveChange
                ? "text-accent-red"
                : isNegativeChange
                ? "text-accent-green"
                : "text-brand-muted"
            }`}
          >
            {formatChange(change, format)}
          </span>
        )}
      </div>

      {(subtext || changeLabel) && (
        <p className="text-xs text-brand-muted leading-relaxed">
          {subtext || changeLabel}
        </p>
      )}
    </div>
  );
}
