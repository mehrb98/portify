import type { Metadata } from "next";
import Link from "next/link";
import { MoveButtons } from "@/components/admin/controls";
import { IconPlus } from "@/components/admin/icons";
import { NewLink, Page, TopBar } from "@/components/admin/topbar";
import { Card } from "@/components/admin/ui";
import { moveJob } from "@/lib/admin/actions/jobs";
import { requireAdmin } from "@/lib/auth";
import { getJobs } from "@/lib/content";
import { formatDuration, formatPeriod } from "@/lib/months";

export const metadata: Metadata = { title: "Jobs" };

export default async function JobsPage() {
  await requireAdmin();
  const jobs = await getJobs();
  return (
    <Page>
      <TopBar
        crumb="Admin / Content"
        title="Jobs"
        actions={
          <NewLink href="/admin/jobs/new">
            <IconPlus />
            New job
          </NewLink>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-6 sm:px-8">
        <Card>
          <div role="table" aria-label="Jobs" className="flex flex-col">
            <div role="row" className="grid h-9 grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_170px_70px_64px_60px] items-center gap-3 rounded-t-[14px] border-b border-rule bg-paper px-4 font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">
              <span role="columnheader">Role</span>
              <span role="columnheader">Company</span>
              <span role="columnheader">Period</span>
              <span role="columnheader">Techs</span>
              <span role="columnheader">Order</span>
              <span role="columnheader">
                <span className="sr-only">Actions</span>
              </span>
            </div>
            {jobs.length === 0 ? <p className="px-4 py-8 text-center text-sm text-ink-3">No jobs yet.</p> : null}
            {jobs.map((j, i) => (
              <div role="row" key={j.id} className="grid min-h-14 grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_170px_70px_64px_60px] items-center gap-3 border-b border-rule-2 px-4 py-2 last:border-b-0">
                <span role="cell" className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  <span className="truncate">{j.role}</span>
                  {j.end === null ? <span className="rounded bg-soft px-1.5 py-0.5 font-mono text-[10px] text-signal">current</span> : null}
                </span>
                <span role="cell" className="truncate text-[13px] text-ink-2">
                  {j.company.name}
                </span>
                <span role="cell" className="flex flex-col font-mono text-xs text-ink-2">
                  {formatPeriod(j.start, j.end)}
                  <span className="text-ink-3">{formatDuration(j.start, j.end)}</span>
                </span>
                <span role="cell" className="font-mono text-xs text-ink-2">
                  {j.technologies.length}
                </span>
                <span role="cell">
                  <MoveButtons up={moveJob.bind(null, j.id, "up")} down={moveJob.bind(null, j.id, "down")} first={i === 0} last={i === jobs.length - 1} label={`${j.role} at ${j.company.shortName}`} />
                </span>
                <span role="cell" className="text-right">
                  <Link href={`/admin/jobs/${j.id}`} className="text-[13px] font-medium text-signal hover:underline">
                    Edit<span className="sr-only">: {j.role} at {j.company.shortName}</span>
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </Card>
        <p className="font-mono text-xs text-ink-3">The experience section and the stack timeline both read from these jobs. Order sets the order on the site.</p>
      </div>
    </Page>
  );
}
