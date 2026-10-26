import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyForm } from "@/components/admin/company-form";
import { IconBriefcase, IconBuilding, IconPlus } from "@/components/admin/icons";
import { NewLink, Page, TopBar } from "@/components/admin/topbar";
import { Card, cx, initials } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { isPlaceholder } from "@/lib/content";
import { db } from "@/lib/db";
import { formatPeriod } from "@/lib/months";

export const metadata: Metadata = { title: "Companies" };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export default async function CompaniesPage({ searchParams }: PageProps<"/admin/companies">) {
  await requireAdmin();
  const sp = await searchParams;
  const id = one(sp.id);
  const isNew = one(sp.new) === "1";
  const [companies, jobs] = await Promise.all([
    db.company.findMany({ orderBy: { order: "asc" }, include: { jobs: { select: { start: true, end: true } }, _count: { select: { projects: true } } } }),
    db.job.findMany({ orderBy: [{ order: "asc" }, { start: "desc" }], include: { company: { select: { name: true } } } }),
  ]);
  if (id && !companies.some((c) => c.id === id)) notFound();
  const nextOrder = companies.reduce((m, c) => Math.max(m, c.order), -1) + 1;

  const span = (js: { start: string; end: string | null }[]) => {
    if (!js.length) return null;
    const start = js.map((j) => j.start).sort()[0];
    const end = js.some((j) => j.end === null) ? null : js.map((j) => j.end!).sort().at(-1)!;
    return formatPeriod(start, end);
  };

  return (
    <Page>
      <TopBar
        crumb="Admin / Content"
        title="Companies and jobs"
        actions={
          <NewLink href="/admin/companies?new=1">
            <IconPlus />
            Add company
          </NewLink>
        }
      />
      <div className="grid gap-6 px-4 py-6 sm:px-8 xl:grid-cols-2">
        <Card
          id="companies"
          title="Companies"
          icon={<IconBuilding />}
          action={
            <Link href="/admin/companies?new=1" className="inline-flex items-center gap-1 text-[13px] font-medium text-signal hover:underline">
              <IconPlus size={14} />
              Add
            </Link>
          }
        >
          {isNew ? (
            <div className="border-b border-rule-2 bg-paper/60 px-5 py-4">
              <CompanyForm company={null} nextOrder={nextOrder} />
            </div>
          ) : null}
          <ul>
            {companies.map((c) => {
              const editing = c.id === id;
              const period = span(c.jobs);
              const missingCity = isPlaceholder(c.city);
              return (
                <li key={c.id} className={cx("border-b border-rule-2", editing && "bg-paper/60")}>
                  <div className="grid grid-cols-[40px_minmax(0,1fr)_auto_auto] items-center gap-3.5 px-5 py-3.5">
                    <span className="flex size-10 items-center justify-center rounded-[10px] bg-chip font-mono text-xs font-medium">{initials(c.name)}</span>
                    <div className="flex min-w-0 flex-col gap-[3px]">
                      <span className="truncate text-[14.5px] font-semibold">{c.name}</span>
                      <span className="truncate font-mono text-xs text-ink-3">
                        {[plural(c.jobs.length, "job"), plural(c._count.projects, "project"), period].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                    <span className={cx("font-mono text-xs", missingCity ? "text-warn" : "text-ink-2")}>{missingCity ? "[City]" : c.city}</span>
                    {editing ? (
                      <Link href="/admin/companies" className="text-[13px] font-medium text-ink-3 hover:text-ink">
                        Close
                      </Link>
                    ) : (
                      <Link href={`/admin/companies?id=${c.id}`} className="text-[13px] font-medium text-signal hover:underline">
                        Edit<span className="sr-only">: {c.name}</span>
                      </Link>
                    )}
                  </div>
                  {editing ? (
                    <div className="px-5 pb-5">
                      <CompanyForm
                        company={{ id: c.id, name: c.name, shortName: c.shortName, city: c.city ?? "", order: c.order, jobs: c.jobs.length, projects: c._count.projects }}
                        nextOrder={nextOrder}
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {companies.length === 0 ? <p className="px-5 py-6 text-sm text-ink-3">No companies yet.</p> : null}
          <p className="px-5 py-3.5 text-[12.5px] leading-normal text-ink-3">
            A company holds the name and city once. Jobs and projects pick it from this list. A company can&apos;t be deleted while a job uses it.
          </p>
        </Card>

        <Card
          id="jobs"
          title="Jobs"
          icon={<IconBriefcase />}
          action={
            <Link href="/admin/jobs/new" className="inline-flex items-center gap-1 text-[13px] font-medium text-signal hover:underline">
              <IconPlus size={14} />
              Add
            </Link>
          }
          className="self-start"
        >
          <ul>
            {jobs.map((j) => (
              <li key={j.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-rule-2 px-5 py-3 last:border-b-0">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{j.role}</span>
                  <span className="truncate text-[13px] text-ink-2">{j.company.name}</span>
                </div>
                <span className="font-mono text-xs text-ink-3">{formatPeriod(j.start, j.end)}</span>
                <Link href={`/admin/jobs/${j.id}`} className="text-[13px] font-medium text-signal hover:underline">
                  Edit<span className="sr-only">: {j.role} at {j.company.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          {jobs.length === 0 ? <p className="px-5 py-6 text-sm text-ink-3">No jobs yet.</p> : null}
        </Card>
      </div>
    </Page>
  );
}
