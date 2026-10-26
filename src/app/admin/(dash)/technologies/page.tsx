import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SwitchForm } from "@/components/admin/controls";
import { IconPlus, IconX } from "@/components/admin/icons";
import { TechForm } from "@/components/admin/tech-form";
import { NewLink, Page, TopBar } from "@/components/admin/topbar";
import { FilterTabs, cx } from "@/components/admin/ui";
import { toggleTimeline } from "@/lib/admin/actions/technologies";
import { requireAdmin } from "@/lib/auth";
import { TECH_CATEGORIES, TOOLKIT_GROUPS, getTechnologies } from "@/lib/content";
import { formatMonth } from "@/lib/months";

export const metadata: Metadata = { title: "Technologies" };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function TechnologiesPage({ searchParams }: PageProps<"/admin/technologies">) {
  await requireAdmin();
  const sp = await searchParams;
  const all = await getTechnologies();
  const categories = [...TECH_CATEGORIES, ...new Set(all.map((t) => t.category).filter((c) => !TECH_CATEGORIES.includes(c)))];
  const missing = one(sp.missing) === "1";
  const cat = categories.includes(one(sp.cat)) ? one(sp.cat) : "";
  const id = one(sp.id);
  const isNew = one(sp.new) === "1";
  const selected = id ? all.find((t) => t.id === id) : undefined;
  if (id && !selected) notFound();

  const list = all.filter((t) => (!cat || t.category === cat) && (!missing || (t.showOnTimeline && !t.start)));
  const href = (over: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ cat: cat || undefined, missing: missing ? "1" : undefined, ...over })) if (v) params.set(k, v);
    const s = params.toString();
    return `/admin/technologies${s ? `?${s}` : ""}`;
  };
  const panelOpen = !!selected || isNew;

  return (
    <Page>
      <TopBar
        crumb="Admin / Content"
        title="Technologies"
        actions={
          <NewLink href={href({ new: "1" })}>
            <IconPlus />
            Add technology
          </NewLink>
        }
      />
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-5 sm:px-8">
          <FilterTabs
            label="Filter by category"
            tabs={[
              { label: "All", n: all.length, on: !cat && !missing, href: "/admin/technologies" },
              ...categories.map((c) => ({ label: c, n: all.filter((t) => t.category === c).length, on: cat === c && !missing, href: `/admin/technologies?cat=${encodeURIComponent(c)}` })),
              ...(missing ? [{ label: "Period to add", on: true, href: "/admin/technologies?missing=1" }] : []),
            ]}
          />

          <div role="table" aria-label="Technologies" className="flex flex-col overflow-hidden rounded-xl border border-rule">
            <div role="row" className="grid h-9 grid-cols-[minmax(0,1.3fr)_130px_170px_minmax(0,1.6fr)_80px] items-center gap-3 border-b border-rule bg-paper px-4 font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">
              <span role="columnheader">Technology</span>
              <span role="columnheader">Category</span>
              <span role="columnheader">Period</span>
              <span role="columnheader">Used at</span>
              <span role="columnheader">Timeline</span>
            </div>
            {list.length === 0 ? <p className="px-4 py-8 text-center text-sm text-ink-3">No technologies in this list.</p> : null}
            {list.map((t) => {
              const on = t.id === selected?.id;
              const period = t.start ? `${formatMonth(t.start)} to ${t.end ? formatMonth(t.end) : "now"}` : null;
              return (
                <div
                  role="row"
                  key={t.id}
                  aria-selected={on}
                  className={cx(
                    "relative grid min-h-10 grid-cols-[minmax(0,1.3fr)_130px_170px_minmax(0,1.6fr)_80px] items-center gap-3 border-b border-rule-2 px-4 py-1 last:border-b-0",
                    on ? "bg-soft/60 shadow-[inset_3px_0_0_var(--signal)]" : "hover:bg-paper",
                  )}
                >
                  <span role="cell" className="min-w-0 truncate">
                    <Link
                      href={href({ id: t.id })}
                      scroll={false}
                      className="text-sm font-medium text-ink after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-signal"
                    >
                      {t.name}
                    </Link>
                    {t.toolkitGroup ? <span className="ml-2 font-mono text-[10px] text-ink-3">toolkit · {t.toolkitGroup}</span> : null}
                  </span>
                  <span role="cell" className="truncate font-mono text-xs text-ink-2">
                    {t.category}
                  </span>
                  <span role="cell">
                    {period ? (
                      <span className={cx("rounded-[5px] px-2 py-[3px] font-mono text-[11px]", t.current ? "bg-signal text-surface" : "bg-bar-old text-ink")}>{period}</span>
                    ) : (
                      <span className="rounded-[5px] border border-dashed border-ink-3/60 px-2 py-[3px] font-mono text-[11px] text-ink-3">[period]</span>
                    )}
                  </span>
                  <span role="cell" className="truncate text-[13px] text-ink-2">
                    {t.usedAt.length ? t.usedAt.join(", ") : t.toolkitGroup ? "Toolkit only" : "No job yet"}
                  </span>
                  <span role="cell" className="relative z-10">
                    <SwitchForm action={toggleTimeline.bind(null, t.id)} on={t.showOnTimeline} label={`Show ${t.name} on the stack timeline`} className="w-fit" />
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12.5px] text-ink-2">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-[18px] rounded-[3px] bg-signal" aria-hidden />
              in use today
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-[18px] rounded-[3px] bg-bar-old" aria-hidden />
              earlier role
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-[18px] rounded-[3px] border border-dashed border-ink-3" aria-hidden />
              period to add
            </span>
          </div>
          <p className="max-w-3xl text-[13px] leading-normal text-ink-2">
            Periods are not typed in here: they come from the jobs that use each technology (earliest job start to latest job end, or “now” while a current job
            uses it). To give a technology a period, tick it on a job in{" "}
            <Link href="/admin/jobs" className="text-signal hover:underline">
              Jobs
            </Link>
            . The Timeline switch decides whether it gets a bar on the stack timeline; technologies without a dated job can sit in a toolkit column instead.
          </p>
        </div>

        {panelOpen ? (
          <aside
            aria-label={selected ? "Edit technology" : "New technology"}
            className="fixed inset-y-0 right-0 z-20 w-full max-w-[400px] shrink-0 overflow-y-auto border-l border-rule bg-surface shadow-2xl xl:sticky xl:top-0 xl:right-auto xl:bottom-auto xl:z-auto xl:h-dvh xl:w-[360px] xl:max-w-none xl:shadow-none"
          >
            <div className="flex flex-col gap-4 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs text-ink-3">{selected ? "Edit technology" : "New technology"}</span>
                <Link href={href({})} scroll={false} className="ml-auto flex size-8 items-center justify-center rounded-lg text-ink-3 hover:bg-chip hover:text-ink" aria-label="Close panel">
                  <IconX />
                </Link>
              </div>
              <TechForm
                key={selected?.id ?? "new"}
                tech={
                  selected
                    ? {
                        id: selected.id,
                        name: selected.name,
                        category: selected.category,
                        toolkitGroup: selected.toolkitGroup ?? "",
                        showOnTimeline: selected.showOnTimeline,
                        order: selected.order,
                        jobCount: selected.jobIds.length,
                        period: selected.start ? `${formatMonth(selected.start)} to ${selected.end ? formatMonth(selected.end) : "now"}` : null,
                      }
                    : null
                }
                version={JSON.stringify(selected ?? null)}
                categories={categories}
                toolkitGroups={TOOLKIT_GROUPS}
                cat={cat}
                nextOrder={all.reduce((m, t) => Math.max(m, t.order), -1) + 1}
              />
            </div>
          </aside>
        ) : null}
      </div>
    </Page>
  );
}
