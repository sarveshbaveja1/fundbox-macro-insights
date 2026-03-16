import macroData from "../../data/macro.json";
import transunionReports from "../../data/transunion-reports.json";
import osReports from "../../data/2os-reports.json";

export type MacroData = typeof macroData;
export type Report = (typeof transunionReports)[0];

export function getMacroData(): MacroData {
  return macroData;
}

export function getConsumerReports(): Report[] {
  const tu = transunionReports.filter((r) => r.category === "consumer");
  const os = osReports.filter((r) => r.category === "consumer");
  return [...tu, ...os].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getSmallBusinessReports(): Report[] {
  const tu = transunionReports.filter((r) => r.category === "small-business");
  const os = osReports.filter((r) => r.category === "small-business");
  return [...tu, ...os].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatJobs(value: number): string {
  const k = Math.round(value / 1000);
  return `${k > 0 ? "+" : ""}${k}K`;
}

export function changeClass(
  change: number,
  invertColors = false
): string {
  if (change === 0) return "text-brand-muted";
  const positive = change > 0;
  const isGood = invertColors ? !positive : positive;
  return isGood ? "text-accent-green font-semibold" : "text-accent-red font-semibold";
}

export function signedPct(value: number, decimals = 1): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}pp`;
}
