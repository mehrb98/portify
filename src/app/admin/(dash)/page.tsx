import Link from "next/link";
import { SectionToggles } from "@/components/admin/section-toggles";
import { IconAlert, IconCheck } from "@/components/admin/icons";
import { Page, TopBar } from "@/components/admin/topbar";
import { Card, cx } from "@/components/admin/ui";
import { getTodos } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { getProfile, getTechnologies } from "@/lib/content";
import { db } from "@/lib/db";

export default async function OverviewPage() {
  await requireAdmin();
  const [projectsByKind, drafts, companies, jobs, currentJobs, education, techs, certs, todos, profile] = await Promise.all([
    db.project.groupBy({ by: ["kind"], _count: true }),
    db.project.count({ where: { status: "DRAFT" } }),
    db.company.findMany({ orderBy: { order: "asc" }, select: { shortName: true } }),
    db.job.count(),
    db.job.count({ where: { end: null } }),
    db.education.findMany({ orderBy: { order: "asc" }, select: { title: true, kind: true } }),
    getTechnologies(),
    db.certificate.groupBy({ by: ["kind"], _count: true }),
    getTodos(),
    getProfile(),
  ]);
  const work = projectsByKind.find((p) => p.kind === "WORK")?._count ?? 0;
  const side = projectsByKind.find((p) => p.kind === "SIDE")?._count ?? 0;
  const recognition = certs.find((c) => c.kind === "RECOGNITION")?._count ?? 0;
  const courses = certs.find((c) => c.kind === "COURSE")?._count ?? 0;
  const noPeriod = techs.filter((t) => !t.start).length;

  const stats = [
    { label: "Projects", n: work + side, sub: `${work} work, ${side} side projects`, href: "/admin/projects" },
    { label: "Companies", n: companies.length, sub: companies.map((c) => c.shortName).join(", ") || "none yet", href: "/admin/companies" },
    { label: "Jobs", n: jobs, sub: `${currentJobs} current`, href: "/admin/jobs" },
    { label: "Education", n: education.length, sub: education.map((e) => (e.kind === "AUSBILDUNG" ? "Ausbildung" : e.title)).join(", ") || "none yet", href: "/admin/education" },
    { label: "Technologies", n: techs.length, sub: `${noPeriod} without a period`, href: "/admin/technologies" },
    { label: "Certificates", n: recognition + courses, sub: `${recognition} recognition, ${courses} courses`, href: "/admin/education#certificates" },
  ];

  return (
    <Page>
      <TopBar crumb="Admin" title="Overview" />
      <div className="flex flex-col gap-6 px-4 py-7 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 rounded-xl border border-rule bg-paper px-[18px] py-3.5">
          <span className={cx("size-2 rounded-full", drafts ? "bg-warn" : "bg-ok")} aria-hidden />
          <span className="text-sm">
            {drafts ? (
              <>
                <strong className="font-semibold">
                  {drafts} project{drafts > 1 ? "s" : ""} in draft.
                </strong>{" "}
                <span className="text-ink-2">Drafts and hidden projects stay off the live site until you set them to Published.</span>
              </>
            ) : (
              <>
                <strong className="font-semibold">No drafts.</strong> <span className="text-ink-2">Saved changes go live on the site right away.</span>
              </>
            )}
          </span>
          {drafts ? (
            <Link href="/admin/projects" className="ml-auto text-[13px] font-medium text-signal hover:underline">
              Review projects
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-rule bg-surface px-[18px] py-4 text-ink hover:border-ink-3">
              <span className="font-mono text-xs text-ink-3">{s.label}</span>
              <span className="text-3xl font-semibold tracking-[-0.03em]">{s.n}</span>
              <span className="truncate text-[12.5px] text-ink-2" title={s.sub}>
                {s.sub}
              </span>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Card id="todo" title="Needs your input" sub="placeholders still on the site">
            {todos.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-4 text-sm text-ink-2">
                <span className="text-ok">
                  <IconCheck />
                </span>
                Nothing left to fill in.
              </div>
            ) : (
              <ul>
                {todos.map((t) => (
                  <li key={t.what + t.href} className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-3 border-b border-rule-2 px-5 py-3.5 last:border-b-0">
                    <span className="flex text-warn">
                      <IconAlert />
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium">{t.what}</span>
                      <span className="truncate font-mono text-xs text-ink-3" title={t.where}>
                        {t.where}
                      </span>
                    </div>
                    <Link href={t.href} className="text-[13px] font-medium text-signal hover:underline">
                      Fill in<span className="sr-only">: {t.what}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card id="sections" title="Site sections" sub="shown on the public page">
            <SectionToggles sections={profile.sections} />
          </Card>
        </div>
      </div>
    </Page>
  );
}
