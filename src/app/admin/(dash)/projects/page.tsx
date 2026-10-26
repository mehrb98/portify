import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { MoveButtons } from "@/components/admin/controls";
import { IconPlus, IconSearch, IconX } from "@/components/admin/icons";
import { ProjectForm } from "@/components/admin/project-form";
import { NewLink, Page, TopBar } from "@/components/admin/topbar";
import { FeaturedBadge, FilterTabs, StatusPill, cx, inputClass } from "@/components/admin/ui";
import { moveProject } from "@/lib/admin/actions/projects";
import { requireAdmin } from "@/lib/auth";
import type { KV } from "@/lib/content";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Projects" };

const TABS = [
  { key: "all", label: "All", where: {} },
  { key: "featured", label: "Featured", where: { featured: true } },
  { key: "work", label: "Work", where: { kind: "WORK" } },
  { key: "side", label: "Side projects", where: { kind: "SIDE" } },
] as const satisfies readonly { key: string; label: string; where: Prisma.ProjectWhereInput }[];

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.find((t) => t.key === one(sp.tab)) ?? TABS[0];
  const q = one(sp.q).trim().slice(0, 100);
  const id = one(sp.id);
  const isNew = one(sp.new) === "1";

  const nameFilter: Prisma.ProjectWhereInput = q ? { name: { contains: q, mode: "insensitive" } } : {};
  const [projects, counts, companies, selected, kindLists] = await Promise.all([
    db.project.findMany({
      where: { ...tab.where, ...nameFilter },
      orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      include: { company: { select: { shortName: true } } },
    }),
    Promise.all(TABS.map((t) => db.project.count({ where: { ...t.where, ...nameFilter } }))),
    db.company.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    id ? db.project.findUnique({ where: { id } }) : null,
    db.project.findMany({ orderBy: [{ kind: "asc" }, { order: "asc" }, { createdAt: "asc" }], select: { id: true, kind: true } }),
  ]);
  if (id && !selected) notFound();

  const href = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { tab: tab.key === "all" ? undefined : tab.key, q: q || undefined, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return `/admin/projects${s ? `?${s}` : ""}`;
  };
  const listHref = href({});
  const panelOpen = !!selected || isNew;

  // Position of the selected project among projects of the same kind, for Move up / Move down.
  const siblings = selected ? kindLists.filter((p) => p.kind === selected.kind) : [];
  const pos = selected ? siblings.findIndex((p) => p.id === selected.id) : -1;

  return (
    <Page>
      <TopBar
        crumb="Admin / Content"
        title="Projects"
        actions={
          <NewLink href={href({ new: "1" })}>
            <IconPlus />
            New project
          </NewLink>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-5 sm:px-8 xl:pr-6">
          <div className="flex flex-wrap items-center gap-2">
            <FilterTabs
              label="Filter projects"
              tabs={TABS.map((t, i) => ({
                label: t.label,
                n: counts[i],
                on: t.key === tab.key,
                href: `/admin/projects?${new URLSearchParams({ ...(t.key !== "all" ? { tab: t.key } : {}), ...(q ? { q } : {}) })}`,
              }))}
            />
            <form role="search" action="/admin/projects" className="ml-auto flex items-center gap-2">
              {tab.key !== "all" ? <input type="hidden" name="tab" value={tab.key} /> : null}
              <label className="relative flex items-center">
                <span className="sr-only">Search projects by name</span>
                <span className="pointer-events-none absolute left-3 text-ink-3">
                  <IconSearch size={15} />
                </span>
                <input name="q" type="search" defaultValue={q} placeholder="Search projects" className={cx(inputClass, "h-[34px] w-60 pl-9 font-mono text-xs")} />
              </label>
              {q ? (
                <Link href={href({ q: undefined })} className="flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-chip hover:text-ink" aria-label="Clear search">
                  <IconX />
                </Link>
              ) : null}
            </form>
          </div>

          <div role="table" aria-label="Projects" className="flex flex-col overflow-hidden rounded-xl border border-rule">
            <div role="row" className="grid h-9 grid-cols-[24px_minmax(0,2.4fr)_minmax(0,1.2fr)_120px_96px] items-center gap-3 border-b border-rule bg-paper px-3.5 font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">
              <span role="columnheader">
                <span className="sr-only">Position</span>#
              </span>
              <span role="columnheader">Project</span>
              <span role="columnheader">Company</span>
              <span role="columnheader">Period</span>
              <span role="columnheader">Status</span>
            </div>
            {projects.length === 0 ? (
              <div role="row" className="px-4 py-8 text-center text-sm text-ink-3">
                <span role="cell">{q ? `No project matches “${q}”.` : "No projects in this list yet."}</span>
              </div>
            ) : null}
            {projects.map((p) => {
              const on = p.id === selected?.id;
              const n = kindLists.filter((x) => x.kind === p.kind).findIndex((x) => x.id === p.id) + 1;
              return (
                <div
                  role="row"
                  key={p.id}
                  aria-selected={on}
                  className={cx(
                    "relative grid h-[52px] grid-cols-[24px_minmax(0,2.4fr)_minmax(0,1.2fr)_120px_96px] items-center gap-3 border-b border-rule-2 px-3.5 last:border-b-0",
                    on ? "bg-soft/60 shadow-[inset_3px_0_0_var(--signal)]" : "bg-surface hover:bg-paper",
                  )}
                >
                  <span role="cell" className="font-mono text-[11px] text-ink-3">
                    {p.kind === "SIDE" ? `S${n}` : n}
                  </span>
                  <div role="cell" className="flex min-w-0 items-center gap-2">
                    <Link
                      href={href({ id: p.id })}
                      scroll={false}
                      className="truncate text-sm font-medium text-ink after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-signal"
                    >
                      {p.name}
                    </Link>
                    {p.featured ? <FeaturedBadge /> : null}
                  </div>
                  <span role="cell" className="truncate text-[13px] text-ink-2">
                    {p.company?.shortName ?? (p.kind === "SIDE" ? "Side project" : "No company")}
                  </span>
                  <span role="cell" className="truncate font-mono text-xs text-ink-2">
                    {p.period}
                  </span>
                  <span role="cell">
                    <StatusPill status={p.status} />
                  </span>
                </div>
              );
            })}
          </div>
          <span className="font-mono text-xs text-ink-3">
            Click a row to edit it. Order on the site follows the # column (work and side projects separately); use Move up and Move down in the panel.
          </span>
        </div>

        <aside
          aria-label={isNew ? "New project" : "Edit project"}
          className={cx(
            "shrink-0 border-l border-rule bg-surface xl:sticky xl:top-0 xl:right-auto xl:bottom-auto xl:z-auto xl:block xl:h-dvh xl:w-[400px] xl:max-w-none xl:overflow-y-auto xl:shadow-none",
            // below 1280px the panel slides over the table as a drawer
            panelOpen ? "fixed inset-y-0 right-0 z-20 w-full max-w-[420px] overflow-y-auto shadow-2xl" : "hidden",
          )}
        >
          {panelOpen ? (
            <div className="flex flex-col gap-4 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs text-ink-3">{isNew && !selected ? "New project" : "Edit project"}</span>
                {selected ? (
                  <div className="ml-auto flex items-center gap-1">
                    <MoveButtons
                      up={moveProject.bind(null, selected.id, "up")}
                      down={moveProject.bind(null, selected.id, "down")}
                      first={pos <= 0}
                      last={pos === siblings.length - 1}
                      label={selected.name}
                    />
                  </div>
                ) : null}
                <Link href={listHref} scroll={false} className={cx("flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-chip hover:text-ink", !selected && "ml-auto")} aria-label="Close panel">
                  <IconX />
                </Link>
              </div>
              <ProjectForm
                key={selected?.id ?? "new"}
                version={selected ? selected.updatedAt.getTime() : 0}
                project={
                  selected
                    ? {
                        id: selected.id,
                        name: selected.name,
                        kind: selected.kind,
                        companyId: selected.companyId ?? "",
                        period: selected.period,
                        role: selected.role ?? "",
                        summary: selected.summary,
                        focus: selected.focus ?? "",
                        flow: selected.flow ?? "",
                        tags: selected.tags.join(", "),
                        url: selected.url ?? "",
                        size: selected.size,
                        featured: selected.featured,
                        status: selected.status,
                        details: Array.isArray(selected.details) ? (selected.details as KV[]) : [],
                      }
                    : null
                }
                companies={companies.map((c) => ({ value: c.id, label: c.name }))}
                tab={tab.key === "all" ? "" : tab.key}
                q={q}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-6 py-8 text-sm text-ink-2">
              <span className="font-mono text-xs text-ink-3">Edit project</span>
              <p>Select a project in the table to edit it, or create a new one.</p>
              <Link href={href({ new: "1" })} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-signal hover:underline">
                <IconPlus size={14} />
                New project
              </Link>
            </div>
          )}
        </aside>
      </div>
    </Page>
  );
}
