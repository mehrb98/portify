import "server-only";
import { getEducation, getProfile, getTechnologies, isPlaceholder, type KV } from "@/lib/content";
import { db } from "@/lib/db";

export async function getNavCounts() {
  const [projects, companies, jobs, education, technologies] = await Promise.all([
    db.project.count(),
    db.company.count(),
    db.job.count(),
    db.education.count(),
    db.technology.count(),
  ]);
  return { projects, companies, jobs, education, technologies };
}
export type NavCounts = Awaited<ReturnType<typeof getNavCounts>>;

const BRACKETS = /\[[^\]]+\]/;
const hasBrackets = (v: string | null | undefined) => !!v && BRACKETS.test(v);

export type Todo = { what: string; where: string; href: string };

const PROJECT_FIELDS = [
  ["name", "name"],
  ["period", "period"],
  ["role", "role"],
  ["summary", "summary"],
  ["focus", "focus"],
  ["flow", "flow"],
  ["url", "link"],
] as const;

const PROFILE_FIELDS = [
  ["name", "name"],
  ["headline", "headline"],
  ["status", "status badge"],
  ["location", "location"],
  ["pitch", "pitch"],
  ["aboutTitle", "about title"],
] as const;

const list = (xs: string[]) => (xs.length <= 3 ? xs.join(", ") : `${xs.slice(0, 3).join(", ")} and ${xs.length - 3} more`);

/** Placeholders and gaps that still show on the site, each with the admin page that fixes it. */
export async function getTodos(): Promise<Todo[]> {
  const [companies, education, techs, profile, projects] = await Promise.all([
    db.company.findMany({ orderBy: { order: "asc" } }),
    getEducation(),
    getTechnologies(),
    getProfile(),
    db.project.findMany({ orderBy: [{ kind: "asc" }, { order: "asc" }] }),
  ]);
  const todos: Todo[] = [];

  const noCity = companies.filter((c) => isPlaceholder(c.city));
  if (noCity.length) {
    todos.push({
      what: noCity.length === 1 ? `City for ${noCity[0].shortName}` : `City for ${noCity.length} companies`,
      where: `Companies · ${list(noCity.map((c) => c.shortName))} · no city yet`,
      href: noCity.length === 1 ? `/admin/companies?id=${noCity[0].id}` : "/admin/companies",
    });
  }

  for (const e of education) {
    for (const d of e.details as KV[]) {
      if (hasBrackets(d.v)) {
        todos.push({ what: `${d.k} of the ${e.kind === "AUSBILDUNG" ? "Ausbildung" : e.title}`, where: `Education · ${e.school} · ${d.v}`, href: `/admin/education?edit=edu:${e.id}` });
      }
    }
  }

  const noPeriod = techs.filter((t) => t.showOnTimeline && !t.start);
  if (noPeriod.length) {
    todos.push({
      what: `Period for ${list(noPeriod.map((t) => t.name))}`,
      where: "Technologies · on the timeline but not used by any job",
      href: noPeriod.length === 1 ? `/admin/technologies?id=${noPeriod[0].id}` : "/admin/technologies?missing=1",
    });
  }

  if (!profile.cvUrl.trim()) {
    todos.push({ what: "CV file to download", where: "Settings · CV URL is empty, so the CV buttons are hidden", href: "/admin/settings#cv" });
  }

  const profileHits = PROFILE_FIELDS.filter(([k]) => hasBrackets(profile[k])).map(([, label]) => label);
  if (profileHits.length) todos.push({ what: "Placeholder in your profile", where: `Settings · ${profileHits.join(", ")}`, href: "/admin/settings" });

  for (const p of projects) {
    const hits: string[] = PROJECT_FIELDS.filter(([k]) => hasBrackets(p[k])).map(([, label]) => label);
    if (p.tags.some(hasBrackets)) hits.push("tags");
    if (Array.isArray(p.details) && (p.details as KV[]).some((d) => hasBrackets(d?.k) || hasBrackets(d?.v))) hits.push("case study");
    if (hits.length) todos.push({ what: `Placeholder in ${p.name}`, where: `Projects · ${hits.join(", ")}`, href: `/admin/projects?id=${p.id}` });
  }

  return todos;
}
