import "server-only";
import { TECH_CATEGORIES } from "@/lib/content";
import { db } from "@/lib/db";
import { currentMonth } from "@/lib/months";

/** Everything the job editor needs, as plain serializable data. */
export async function getJobEditorData(id: string | null) {
  const [job, companies, technologies] = await Promise.all([
    id ? db.job.findUnique({ where: { id }, include: { company: true, technologies: { select: { technologyId: true } } } }) : null,
    db.company.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, shortName: true, city: true } }),
    db.technology.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], select: { id: true, name: true, category: true } }),
  ]);
  const linkedProjects = job
    ? await db.project.findMany({ where: { companyId: job.companyId }, orderBy: [{ kind: "asc" }, { order: "asc" }], select: { id: true, name: true, status: true } })
    : [];
  const categories = [...TECH_CATEGORIES, ...new Set(technologies.map((t) => t.category).filter((c) => !TECH_CATEGORIES.includes(c)))];
  return {
    job: job
      ? {
          id: job.id,
          companyId: job.companyId,
          role: job.role,
          start: job.start,
          end: job.end,
          bullets: job.bullets,
          technologyIds: job.technologies.map((t) => t.technologyId),
          version: job.updatedAt.getTime(),
        }
      : null,
    companies,
    techGroups: categories
      .map((c) => ({ category: c, items: technologies.filter((t) => t.category === c).map((t) => ({ id: t.id, name: t.name })) }))
      .filter((g) => g.items.length),
    linkedProjects,
    now: currentMonth(),
  };
}
export type JobEditorData = Awaited<ReturnType<typeof getJobEditorData>>;
