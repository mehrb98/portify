import type { KV, ProjectWithCompany } from "@/lib/content";
import { ElferplatzFigure } from "./ElferplatzFigure";
import { ArrowUpRightIcon } from "./icons";
import { FRAME } from "./layout";
import { SECTION_Y, SectionHead } from "./SectionHead";
import { Tag, TagList } from "./Tag";

/** "W&S Digital · 2025 to now · Designed and built" */
export function context(p: ProjectWithCompany, withRole = true) {
  return [p.company?.shortName, p.period, withRole ? p.role : null].filter(Boolean).join(" · ");
}

function Featured({ p }: { p: ProjectWithCompany }) {
  const details = (Array.isArray(p.details) ? p.details : []) as KV[];
  const withFigure = /elferplatz/i.test(p.name);
  return (
    <article
      className={`grid overflow-hidden rounded-2xl border border-rule bg-paper md:rounded-[20px] ${
        withFigure ? "lg:grid-cols-2" : ""
      }`}
    >
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-ink-3">
          <span className="rounded-[5px] bg-signal px-2 py-[3px] text-paper">Featured</span>
          <span>{context(p)}</span>
        </div>
        <h3 className="mt-5 text-[26px] leading-[1.15] font-semibold tracking-[-0.025em] md:text-[32px]">{p.name}</h3>
        <p className="mt-3.5 text-base leading-[1.6] text-ink-2 md:text-[17px]">{p.summary}</p>
        {details.length > 0 && (
          <dl className="mt-7 flex flex-col gap-4">
            {details.map((d, i) => (
              <div key={i} className="flex flex-col gap-1 sm:grid sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4">
                <dt className="font-mono text-xs leading-[23px] text-ink-3">{d.k}</dt>
                <dd className="text-[15px] leading-[1.55]">{d.v}</dd>
              </div>
            ))}
          </dl>
        )}
        {p.tags.length > 0 && (
          <TagList className="mt-7">
            {p.tags.map((t) => (
              <Tag key={t} variant="surface">
                {t}
              </Tag>
            ))}
          </TagList>
        )}
        {p.url && (
          <div className="mt-6 flex">
            <VisitLink url={p.url} />
          </div>
        )}
      </div>
      {withFigure && <ElferplatzFigure />}
    </article>
  );
}

function VisitLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      className={`-my-3 flex min-h-11 items-center gap-1.5 text-sm font-medium whitespace-nowrap text-signal hover:text-signal-ink`}
    >
      Visit <ArrowUpRightIcon size={14} />
    </a>
  );
}

function Main({ p }: { p: ProjectWithCompany }) {
  return (
    <article className="flex flex-col rounded-2xl border border-rule p-6 md:p-8">
      <span className="font-mono text-xs text-ink-3">{context(p)}</span>
      <h3 className="mt-3.5 text-[22px] font-semibold tracking-[-0.02em] md:text-2xl">{p.name}</h3>
      <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-2 md:text-base">{p.summary}</p>
      {p.focus && (
        <div className="mt-[18px] flex flex-col gap-1 border-t border-rule-2 pt-4 sm:grid sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-3">
          <span className="font-mono text-xs leading-[22px] text-ink-3">technical focus</span>
          <span className="text-[15px] leading-[1.5]">{p.focus}</span>
        </div>
      )}
      <div className="mt-[18px] flex items-center justify-between gap-3">
        <TagList>
          {p.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </TagList>
        {p.url && <VisitLink url={p.url} />}
      </div>
    </article>
  );
}

function Compact({ p }: { p: ProjectWithCompany }) {
  return (
    <article className="flex flex-col rounded-2xl border border-rule px-6 py-6 md:px-7 md:py-[26px]">
      <span className="font-mono text-xs text-ink-3">{context(p, false)}</span>
      <h3 className="mt-3 text-[19px] font-semibold tracking-[-0.015em]">{p.name}</h3>
      <p className="mt-2 grow text-[15px] leading-[1.6] text-ink-2">{p.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <TagList>
          {p.tags.map((t) => (
            <Tag key={t} small>
              {t}
            </Tag>
          ))}
        </TagList>
        {p.url && <VisitLink url={p.url} />}
      </div>
    </article>
  );
}

export function Projects({ projects }: { projects: ProjectWithCompany[] }) {
  const work = projects.filter((p) => p.kind === "WORK");
  const featured = work.filter((p) => p.size === "featured");
  const main = work.filter((p) => p.size === "main");
  const compact = work.filter((p) => p.size === "compact" || p.size === "more");
  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-surface">
      <div className={`${FRAME} ${SECTION_Y} reveal flex flex-col gap-6`}>
        <SectionHead
          id="projects"
          eyebrow="04 / Projects"
          title="What I've built"
          intro="Production work for clients and employers. Most code is private, so each project shows the problem, my role and how it fits together."
          className="mb-2 md:mb-6"
        />
        {featured.map((p) => (
          <Featured key={p.id} p={p} />
        ))}
        {main.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {main.map((p) => (
              <Main key={p.id} p={p} />
            ))}
          </div>
        )}
        {compact.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {compact.map((p) => (
              <Compact key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
