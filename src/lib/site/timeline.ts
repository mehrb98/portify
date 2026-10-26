// Builds the stack timeline from month ranges: positions are percentages of the axis.
import type { JobWithRelations, TechWithPeriod } from "@/lib/content";
import { TIMELINE_GROUPS, TOOLKIT_GROUPS } from "@/lib/content";
import { addMonths, formatShort, monthIndex, monthSpan } from "@/lib/months";

export type Span = { left: number; width: number };
export type TimelineRow = Span & {
  id: string;
  name: string;
  /** desktop bar label, e.g. "09/22 to 02/24, Quimron" */
  label: string;
  /** mobile label, e.g. "since 09/22" */
  short: string;
  state: "live" | "old" | "tbd";
};
export type TimelineGroup = { name: string; rows: TimelineRow[] };
export type Timeline = {
  ticks: { label: string; left: number }[];
  now: number;
  employers: (Span & { id: string; name: string })[];
  ausbildung: (Span & { label: string }) | null;
  groups: TimelineGroup[];
  toolkit: { name: string; items: string[] }[];
};

type Education = { kind: string; title: string; school: string; startYear: number; endYear: number | null };

export function buildTimeline(
  jobs: JobWithRelations[],
  technologies: TechWithPeriod[],
  education: Education[],
  now: string,
): Timeline {
  const earliest = jobs.map((j) => j.start).sort()[0] ?? now;
  const origin = addMonths(earliest, -2);
  const last = `${now.slice(0, 4)}-12`;
  const total = monthSpan(origin, last); // months on the axis
  const pct = (months: number) => (Math.max(0, Math.min(total, months)) / total) * 100;
  const nowIdx = monthIndex(origin, now);

  /** start..end (inclusive months); a null end runs to the current month. */
  const span = (start: string, end: string | null): Span => {
    const a = Math.max(0, monthIndex(origin, start));
    const b = end ? monthIndex(origin, end) + 1 : nowIdx;
    return { left: pct(a), width: pct(Math.max(b, a + 1)) - pct(a) };
  };

  const ticks: Timeline["ticks"] = [];
  for (let y = Number(origin.slice(0, 4)) + 1; y <= Number(last.slice(0, 4)); y++) {
    ticks.push({ label: String(y), left: pct(monthIndex(origin, `${y}-01`)) });
  }

  const employers = [...jobs]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((j) => ({ id: j.id, name: j.company.shortName, ...span(j.start, j.end) }));

  const aus = education.find((e) => e.kind === "AUSBILDUNG");
  const ausbildung = aus
    ? {
        label: `${aus.title}, ${aus.school} (${aus.startYear} to ${aus.endYear ?? "now"})`,
        ...span(`${aus.startYear}-01`, aus.endYear ? `${aus.endYear}-12` : null),
      }
    : null;

  const groups = TIMELINE_GROUPS.map((name) => ({
    name,
    rows: technologies
      .filter((t) => t.showOnTimeline && t.category === name)
      .map((t): TimelineRow => {
        if (!t.start) {
          return {
            id: t.id,
            name: t.name,
            label: "[period]: not tied to a CV role yet",
            short: "[period]",
            state: "tbd",
            left: 0,
            width: pct(nowIdx),
          };
        }
        const end = t.current ? null : t.end;
        const period = `${formatShort(t.start)} to ${end ? formatShort(end) : "now"}`;
        const where = t.usedAt.length === 1 ? `, ${t.usedAt[0]}` : "";
        return {
          id: t.id,
          name: t.name,
          label: period + where,
          short: end ? period : `since ${formatShort(t.start)}`,
          state: end ? "old" : "live",
          ...span(t.start, end),
        };
      }),
  })).filter((g) => g.rows.length > 0);

  const toolkit = TOOLKIT_GROUPS.map((name) => ({
    name,
    items: technologies.filter((t) => t.toolkitGroup === name).map((t) => t.name),
  })).filter((g) => g.items.length > 0);

  return { ticks, now: pct(nowIdx), employers, ausbildung, groups, toolkit };
}
