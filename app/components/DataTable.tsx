interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
  caption?: string;
}

import React from "react";

function ChangeCell({ value }: { value: number }) {
  const cls =
    value > 0
      ? "text-accent-red font-semibold"
      : value < 0
      ? "text-accent-green font-semibold"
      : "text-brand-muted";
  const sign = value > 0 ? "+" : "";
  return <span className={cls}>{sign}{value.toFixed(2)}</span>;
}

export { ChangeCell };

export default function DataTable({ columns, rows, caption }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        {caption && (
          <caption className="text-left text-xs text-brand-muted mb-2 pb-2">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-surface-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-muted ${
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                    ? "text-center"
                    : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2.5 px-3 text-brand-dark ${
                    col.align === "right"
                      ? "text-right font-mono"
                      : col.align === "center"
                      ? "text-center font-mono"
                      : ""
                  }`}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
