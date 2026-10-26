"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteJob, saveJob } from "@/lib/admin/actions/jobs";
import type { JobEditorData } from "@/lib/admin/jobs";
import { MONTH_RE, formatDuration, formatPeriod } from "@/lib/months";
import { ConfirmDelete, FormMessage, ListEditor, SubmitButton, useAdminForm } from "./form-kit";
import { IconFolder } from "./icons";
import { Page, TopBar } from "./topbar";
import { SelectField, StatusPill, TextField, btn, cx } from "./ui";

export function JobEditor({ job, companies, techGroups, linkedProjects, now }: JobEditorData) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveJob.bind(null, job?.id ?? null));
  const savedCompany = companies.find((c) => c.id === job?.companyId);
  const title = job ? `${job.role} at ${savedCompany?.shortName ?? "?"}` : "New job";

  return (
    <Page>
      <TopBar
        crumb="Admin / Jobs"
        title={title}
        actions={
          <>
            <Link href="/admin/jobs" className={btn.secondary}>
              {job ? "Back to jobs" : "Cancel"}
            </Link>
            <SubmitButton pending={pending} form="job-form">
              {job ? "Save job" : "Create job"}
            </SubmitButton>
          </>
        }
      />
      <form
        id="job-form"
        action={formAction}
        onSubmit={onSubmit}
        noValidate
        className="grid flex-1 gap-7 px-4 py-6 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px]"
      >
        <JobFields key={`${job?.version ?? 0}-${state.savedAt ?? 0}`} job={job} companies={companies} techGroups={techGroups} linkedProjects={linkedProjects} now={now} errors={errors} state={state} />
      </form>
      {job ? (
        <div className="px-4 pb-10 sm:px-8">
          <div className="max-w-xl border-t border-rule-2 pt-5">
            <ConfirmDelete action={deleteJob.bind(null, job.id)} label="Delete job" question={`Delete ${title}? Its technology links go with it.`} className="items-start" />
          </div>
        </div>
      ) : null}
    </Page>
  );
}

function JobFields({
  job,
  companies,
  techGroups,
  linkedProjects,
  now,
  errors,
  state,
}: JobEditorData & { errors: Record<string, string[] | undefined>; state: Parameters<typeof FormMessage>[0]["state"] }) {
  const [companyId, setCompanyId] = useState(job?.companyId ?? "");
  const [role, setRole] = useState(job?.role ?? "");
  const [start, setStart] = useState(job?.start ?? "");
  const [current, setCurrent] = useState(job ? job.end === null : false);
  const [end, setEnd] = useState(job?.end ?? "");
  const company = companies.find((c) => c.id === companyId);
  const validStart = MONTH_RE.test(start);
  const validEnd = current || MONTH_RE.test(end);
  const selected = new Set(job?.technologyIds ?? []);

  return (
    <>
      <div className="flex min-w-0 flex-col gap-5">
        <FormMessage state={state} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="companyId"
            label="Company"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            options={[{ value: "", label: "Pick a company" }, ...companies.map((c) => ({ value: c.id, label: c.name }))]}
            error={errors.companyId}
            hint={
              <>
                From <Link href="/admin/companies" className="text-signal hover:underline">Companies</Link>.
              </>
            }
          />
          <TextField id="role" label="Role" value={role} onChange={(e) => setRole(e.target.value)} required error={errors.role} />
        </div>
        <div className="grid items-start gap-4 sm:grid-cols-[170px_170px_minmax(0,1fr)]">
          <TextField id="start" label="Start" type="month" mono value={start} onChange={(e) => setStart(e.target.value)} placeholder="2025-08" required error={errors.start} />
          {current ? (
            <TextField id="end" label="End" mono value="now" disabled readOnly name="_end_display" />
          ) : (
            <TextField id="end" label="End" type="month" mono value={end} onChange={(e) => setEnd(e.target.value)} placeholder="2025-07" error={errors.end} />
          )}
          <label className="flex h-10 cursor-pointer items-center gap-2.5 text-sm sm:mt-[26px]">
            <input type="checkbox" name="current" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="size-[18px] cursor-pointer accent-signal" />
            I work here now
            {current && validStart ? <span className="font-mono text-xs text-ink-3">duration shows as {formatDuration(start, null, now)}</span> : null}
          </label>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium">Location</span>
          {company ? (
            company.city ? (
              <span className="text-sm text-ink-2">
                {company.city} <span className="font-mono text-xs text-ink-3">· from the company,</span>{" "}
                <Link href={`/admin/companies?id=${company.id}`} className="text-[13px] text-signal hover:underline">
                  edit
                </Link>
              </span>
            ) : (
              <span className="text-[12.5px] text-warn">
                {company.shortName} has no city yet.{" "}
                <Link href={`/admin/companies?id=${company.id}`} className="font-medium text-signal hover:underline">
                  Add it in Companies
                </Link>
              </span>
            )
          ) : (
            <span className="text-[12.5px] text-ink-3">Comes from the company you pick.</span>
          )}
        </div>
        <ListEditor name="bullets" label="Highlights" hint="one per item, use the arrows to reorder" initial={job?.bullets ?? []} what="highlight" addLabel="Add highlight" error={errors.bullets} />
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <fieldset className="flex flex-col gap-3 rounded-[14px] border border-rule p-[18px]">
          <legend className="sr-only">Technologies</legend>
          <span aria-hidden className="text-[13px] font-medium">
            Technologies
          </span>
          {techGroups.map((g) => (
            <div key={g.category} role="group" aria-label={g.category} className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">{g.category}</span>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((t) => (
                  <label
                    key={t.id}
                    className="cursor-pointer rounded-md border border-transparent bg-chip px-2 py-1 font-mono text-xs text-ink-2 select-none has-checked:border-signal has-checked:bg-soft has-checked:text-signal has-focus-visible:outline-2 has-focus-visible:outline-signal"
                  >
                    <input type="checkbox" name="technologyIds" value={t.id} defaultChecked={selected.has(t.id)} className="sr-only" />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {errors.technologyIds?.length ? <span className="text-[12.5px] text-danger">{errors.technologyIds[0]}</span> : null}
          <span className="text-[12.5px] leading-normal text-ink-3">
            The stack timeline reads its bars from these tags and the job dates, so the timeline stays in sync. Add new ones in{" "}
            <Link href="/admin/technologies" className="text-signal hover:underline">
              Technologies
            </Link>
            .
          </span>
        </fieldset>

        <section className="flex flex-col gap-2.5 rounded-[14px] border border-rule p-[18px]" aria-labelledby="lp-h">
          <h2 id="lp-h" className="text-[13px] font-medium">
            Linked projects
          </h2>
          {linkedProjects.length ? (
            <ul className="flex flex-col gap-2">
              {linkedProjects.map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-[13.5px]">
                  <span className="text-ink-3">
                    <IconFolder size={14} />
                  </span>
                  <Link href={`/admin/projects?id=${p.id}`} className="min-w-0 truncate hover:text-signal">
                    {p.name}
                  </Link>
                  {p.status !== "PUBLISHED" ? <StatusPill status={p.status} /> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-ink-3">{job ? "No projects belong to this company yet." : "Projects of the company show here after saving."}</p>
          )}
          <span className="text-[12.5px] text-ink-3">Projects of the same company. Change a project&apos;s company in Projects.</span>
        </section>

        <section className="flex flex-col gap-2 rounded-[14px] bg-paper p-[18px]" aria-label="Preview on the site">
          <span className="font-mono text-xs text-ink-3">Preview on the site</span>
          <span className="text-[15px] font-semibold">
            {role || "Role"} <span className="font-normal text-ink-3">at</span> {company?.name ?? "Company"}
          </span>
          <span className={cx("font-mono text-xs", validStart && validEnd ? "text-ink-2" : "text-ink-3")}>
            {validStart && validEnd ? `${formatPeriod(start, current ? null : end)} · ${formatDuration(start, current ? null : end, now)}` : "Start and end month to show the period"}
          </span>
          {company?.city ? <span className="text-[13px] text-ink-2">{company.city}</span> : null}
        </section>
      </div>
    </>
  );
}
