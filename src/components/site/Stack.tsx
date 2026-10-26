import type { Span, Timeline, TimelineRow } from "@/lib/site/timeline";
import { FRAME } from "./layout";
import { SECTION_Y, SectionHead } from "./SectionHead";
import { Tag } from "./Tag";
import { TimelineFilter } from "./TimelineFilter";

const pos = ({ left, width }: Span) => ({ left: `calc(${left}% + 1px)`, width: `calc(${width}% - 2px)` });

const BAR: Record<TimelineRow["state"], string> = {
  live: "bg-signal text-paper",
  old: "bg-bar-old text-ink",
  tbd: "border border-dashed border-[#9aa0a8] text-ink-3 dark:border-[#5b616b]",
};
const MINI: Record<TimelineRow["state"], string> = {
  live: "bg-signal",
  old: "bg-[#b9bdc4] dark:bg-[#454a53]",
  tbd: "border border-dashed border-[#9aa0a8] dark:border-[#5b616b]",
};

function Legend() {
  const item = "flex items-center gap-2";
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 pb-1.5 font-mono text-xs text-ink-2" aria-label="Legend">
      <span className={item}>
        <span className="h-2.5 w-6 rounded-[3px] bg-signal" aria-hidden="true" />
        in use today
      </span>
      <span className={item}>
        <span className="h-2.5 w-6 rounded-[3px] bg-bar-old" aria-hidden="true" />
        earlier role
      </span>
      <span className={item}>
        <span className="h-2.5 w-6 rounded-[3px] border border-dashed border-[#9aa0a8] dark:border-[#5b616b]" aria-hidden="true" />
        dates to add
      </span>
    </div>
  );
}

function DesktopTimeline({ t }: { t: Timeline }) {
  return (
    <div className="relative mt-8 hidden lg:block">
      {/* year gridlines and the "now" marker, behind every row */}
      <div className="pointer-events-none absolute inset-y-0 right-0 left-[200px]" aria-hidden="true">
        {t.ticks.map((k) => (
          <div key={k.label} className="absolute inset-y-0 w-px bg-rule-2" style={{ left: `${k.left}%` }} />
        ))}
        <div className="absolute inset-y-0 w-0 border-l-[1.5px] border-dashed border-signal" style={{ left: `${t.now}%` }} />
      </div>

      <div className="relative grid h-7 grid-cols-[200px_minmax(0,1fr)]" aria-hidden="true">
        <span />
        <div className="relative font-mono text-xs text-ink-3">
          {t.ticks.map((k) => (
            <span key={k.label} className="absolute top-0" style={{ left: `calc(${k.left}% + 6px)` }}>
              {k.label}
            </span>
          ))}
          <span className="absolute top-0 font-medium text-signal" style={{ left: `calc(${t.now}% + 6px)` }}>
            now
          </span>
        </div>
      </div>

      <div className="relative grid h-10 grid-cols-[200px_minmax(0,1fr)]">
        <span className="font-mono text-xs leading-8 text-ink-3">Employer</span>
        <div className="relative">
          {t.employers.map((e) => (
            <div
              key={e.id}
              className="absolute top-0.5 flex h-[30px] items-center overflow-hidden rounded-md border border-rule bg-chip px-2.5 text-[13px] font-medium whitespace-nowrap"
              style={pos(e)}
            >
              {e.name}
            </div>
          ))}
        </div>
      </div>

      {t.ausbildung && (
        <div className="relative grid h-11 grid-cols-[200px_minmax(0,1fr)] border-b border-rule">
          <span className="font-mono text-xs leading-8 text-ink-3">Ausbildung</span>
          <div className="relative">
            <div
              className="absolute top-0.5 flex h-[30px] items-center overflow-hidden rounded-md border border-dashed border-[#9aa0a8] px-2.5 text-[13px] whitespace-nowrap text-ink-2 dark:border-[#5b616b]"
              style={pos(t.ausbildung)}
            >
              {t.ausbildung.label}
            </div>
          </div>
        </div>
      )}

      {t.groups.map((g) => (
        <div key={g.name} data-group={g.name} className="relative flex flex-col pt-2.5">
          <h3 className="h-[26px] font-mono text-xs leading-[26px] font-normal tracking-[0.04em] text-ink-3 uppercase">{g.name}</h3>
          <ul>
            {g.rows.map((r) => (
              <li key={r.id} className="grid h-[30px] grid-cols-[200px_minmax(0,1fr)] items-center">
                <span className="text-[15px] font-medium">{r.name}</span>
                <div className="relative h-[30px]">
                  <div
                    className={`bar-grow absolute top-1 flex h-[22px] items-center overflow-hidden rounded-[5px] px-2.5 font-mono text-[11px] whitespace-nowrap ${BAR[r.state]}`}
                    style={pos(r)}
                    title={r.label}
                  >
                    {r.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MobileTimeline({ t }: { t: Timeline }) {
  return (
    <div className="lg:hidden">
      <div className="relative mt-6" aria-hidden="true">
        <div className="relative h-[18px] font-mono text-[10.5px] text-ink-3">
          {t.ticks.map((k) => (
            <span key={k.label} className="absolute" style={{ left: `${k.left}%` }}>
              {k.label}
            </span>
          ))}
        </div>
        <div className="relative mt-1 h-[26px]">
          {t.employers.map((e) => (
            <div
              key={e.id}
              className="absolute top-0 flex h-[22px] items-center overflow-hidden rounded-[5px] border border-rule bg-chip px-1.5 font-mono text-[10.5px] whitespace-nowrap"
              style={pos(e)}
            >
              {e.name}
            </div>
          ))}
        </div>
      </div>
      {t.groups.map((g) => (
        <div key={g.name} data-group={g.name} className="mt-[18px] flex flex-col">
          <h3 className="pb-1 font-mono text-[11px] font-normal tracking-[0.04em] text-ink-3 uppercase">{g.name}</h3>
          <ul>
            {g.rows.map((r) => (
              <li key={r.id} className="flex flex-col gap-[7px] border-b border-chip py-[9px]">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[15px] font-medium">{r.name}</span>
                  <span className="text-right font-mono text-[11px] text-ink-3">{r.state === "tbd" ? r.label : r.short}</span>
                </div>
                <div className="relative h-2 rounded bg-paper" aria-hidden="true">
                  <div
                    className={`bar-grow absolute top-0 h-2 rounded ${MINI[r.state]}`}
                    style={{ left: `${r.left}%`, width: `${r.width}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Stack({ timeline }: { timeline: Timeline }) {
  const t = timeline;
  return (
    <section id="stack" aria-labelledby="stack-title" className="bg-surface">
      <div className={`${FRAME} ${SECTION_Y} reveal`}>
        <SectionHead
          id="stack"
          eyebrow="02 / Stack"
          title="How my stack evolved"
          intro="From Ruby on Rails to TypeScript microservices. Each bar spans the roles on my CV where I used that technology. No self-rated percentages."
          aside={<Legend />}
        />
        <TimelineFilter groups={t.groups.map((g) => g.name)}>
          <DesktopTimeline t={t} />
          <MobileTimeline t={t} />
        </TimelineFilter>

        {t.toolkit.length > 0 && (
          <div className="mt-7 flex flex-col gap-3.5 lg:mt-10 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-0 lg:border-t lg:border-rule lg:pt-7">
            <h3 className="font-mono text-[11px] font-normal tracking-[0.04em] text-ink-3 uppercase lg:text-xs lg:leading-5 lg:tracking-normal lg:normal-case">
              Also in the toolkit
            </h3>
            {/* phone: one flat list of chips */}
            <div className="flex flex-wrap gap-1.5 lg:hidden">
              {t.toolkit.flatMap((k) => k.items).map((it) => (
                <Tag key={it} variant="outline" small>
                  {it}
                </Tag>
              ))}
            </div>
            <div className="hidden grid-cols-4 gap-6 lg:grid">
              {t.toolkit.map((k) => (
                <div key={k.name} className="flex flex-col gap-2.5">
                  <h4 className="text-sm font-semibold">{k.name}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {k.items.map((it) => (
                      <Tag key={it} variant="outline">
                        {it}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
