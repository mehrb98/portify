import "server-only";
import { db } from "./db";
import { currentMonth } from "./months";

export type KV = { k: string; v: string };
export type Metric = { n: string; l: string };
export type Strength = { t: string; d: string };
export type Sections = Record<SectionKey, boolean>;

export const SECTION_KEYS = ["about", "stack", "experience", "projects", "sideProjects", "architecture", "education"] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About",
  stack: "Stack timeline",
  experience: "Experience",
  projects: "Projects",
  sideProjects: "Side projects",
  architecture: "Architecture",
  education: "Education",
};

export const TIMELINE_GROUPS = ["Languages", "Frontend", "Backend", "Data", "Integrations and AI", "Mobile"];
export const TOOLKIT_GROUPS = ["Core", "AI", "Frontend", "Also familiar"];
export const TECH_CATEGORIES = ["Languages", "Frontend", "Backend", "Data", "Integrations and AI", "Mobile", "AI", "Tools"];

export async function getProfile() {
  const p = await db.profile.findUniqueOrThrow({ where: { id: 1 } });
  return {
    ...p,
    facts: p.facts as KV[],
    metrics: p.metrics as Metric[],
    strengths: p.strengths as Strength[],
    sections: { ...Object.fromEntries(SECTION_KEYS.map((k) => [k, true])), ...(p.sections as Partial<Sections>) } as Sections,
  };
}
export type Profile = Awaited<ReturnType<typeof getProfile>>;

export async function getJobs() {
  const jobs = await db.job.findMany({
    orderBy: [{ order: "asc" }, { start: "desc" }],
    include: { company: true, technologies: { include: { technology: true } } },
  });
  return jobs.map((j) => ({
    ...j,
    technologies: j.technologies.map((t) => t.technology).sort((a, b) => a.order - b.order),
  }));
}
export type JobWithRelations = Awaited<ReturnType<typeof getJobs>>[number];

/**
 * Technologies with the period derived from the jobs that use them:
 * start = earliest job start, end = latest job end (null when a current job uses it).
 */
export async function getTechnologies() {
  const techs = await db.technology.findMany({
    orderBy: { order: "asc" },
    include: { jobs: { include: { job: { include: { company: true } } } } },
  });
  return techs.map((t) => {
    const jobs = t.jobs.map((x) => x.job).sort((a, b) => a.start.localeCompare(b.start));
    const start = jobs.length ? jobs[0].start : null;
    const current = jobs.some((j) => j.end === null);
    const end = jobs.length && !current ? jobs.map((j) => j.end!).sort().at(-1)! : null;
    return {
      id: t.id,
      name: t.name,
      category: t.category,
      toolkitGroup: t.toolkitGroup,
      showOnTimeline: t.showOnTimeline,
      order: t.order,
      start,
      end,
      current,
      usedAt: [...new Set(jobs.map((j) => j.company.shortName))],
      jobIds: jobs.map((j) => j.id),
    };
  });
}
export type TechWithPeriod = Awaited<ReturnType<typeof getTechnologies>>[number];

export async function getProjects(opts: { publishedOnly?: boolean } = {}) {
  return db.project.findMany({
    where: opts.publishedOnly ? { status: "PUBLISHED" } : undefined,
    orderBy: [{ kind: "asc" }, { order: "asc" }],
    include: { company: true },
  });
}
export type ProjectWithCompany = Awaited<ReturnType<typeof getProjects>>[number];

export async function getEducation() {
  const rows = await db.education.findMany({ orderBy: { order: "asc" } });
  return rows.map((e) => ({ ...e, details: e.details as KV[] }));
}

export async function getCertificates() {
  return db.certificate.findMany({ orderBy: { order: "asc" } });
}

export async function getMilestones() {
  return db.milestone.findMany({ orderBy: { order: "asc" } });
}

export async function getCompanies() {
  return db.company.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { jobs: true, projects: true } } } });
}

/** Everything the public page needs, in one call. */
export async function getSiteContent() {
  const [profile, jobs, technologies, projects, education, certificates, milestones] = await Promise.all([
    getProfile(),
    getJobs(),
    getTechnologies(),
    getProjects({ publishedOnly: true }),
    getEducation(),
    getCertificates(),
    getMilestones(),
  ]);
  return { profile, jobs, technologies, projects, education, certificates, milestones, now: currentMonth() };
}
export type SiteContent = Awaited<ReturnType<typeof getSiteContent>>;

/** A value still written as a [placeholder]. */
export function isPlaceholder(v: string | null | undefined) {
  return !v || /\[[^\]]+\]/.test(v);
}
