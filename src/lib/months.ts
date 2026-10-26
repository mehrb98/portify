// Month helpers. Dates are stored as "YYYY-MM"; null end means "now".

export type Month = { y: number; m: number }; // m is 1..12

export function parseMonth(s: string): Month {
  const [y, m] = s.split("-").map(Number);
  return { y, m };
}

export function currentMonth(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Months from a to b, counting both ends (08/2025 to 09/2025 is 2). */
export function monthSpan(a: string, b: string): number {
  const x = parseMonth(a);
  const y = parseMonth(b);
  return (y.y - x.y) * 12 + (y.m - x.m) + 1;
}

/** Month index of s relative to origin (origin itself is 0). */
export function monthIndex(origin: string, s: string): number {
  return monthSpan(origin, s) - 1;
}

export function addMonths(s: string, n: number): string {
  const { y, m } = parseMonth(s);
  const t = y * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}

/** "08/2025" */
export function formatMonth(s: string): string {
  const { y, m } = parseMonth(s);
  return `${String(m).padStart(2, "0")}/${y}`;
}

/** "08/25" */
export function formatShort(s: string): string {
  const { y, m } = parseMonth(s);
  return `${String(m).padStart(2, "0")}/${String(y).slice(2)}`;
}

/** "08/2025 to now" */
export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} to ${end ? formatMonth(end) : "now"}`;
}

/** "1 yr 2 mos" */
export function formatDuration(start: string, end: string | null, now = currentMonth()): string {
  const total = monthSpan(start, end ?? now);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

export const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
