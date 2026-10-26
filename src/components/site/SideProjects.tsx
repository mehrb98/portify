import type { ProjectWithCompany } from "@/lib/content";
import { ArrowUpRightIcon, GitHubIcon } from "./icons";
import { FRAME } from "./layout";
import { SECTION_Y, SectionHead } from "./SectionHead";
import { Tag, TagList } from "./Tag";

export function SideProjects({ projects, github }: { projects: ProjectWithCompany[]; github: string }) {
  const side = projects.filter((p) => p.kind === "SIDE");
  const cards = side.filter((p) => p.size !== "more");
  const more = side.filter((p) => p.size === "more");
  return (
    <section id="side-projects" aria-labelledby="side-projects-title" className="bg-paper">
      <div className={`${FRAME} ${SECTION_Y} reveal`}>
        <SectionHead
          id="side-projects"
          eyebrow="04b / Side projects"
          title="Built in my own time, open on GitHub"
          intro="Where I try new architectures end to end: multi-service AI systems, a school platform with a Flutter app, and a full shop with Stripe."
          aside={
            <a
              href={github}
              className="flex min-h-11 items-center gap-2 self-start text-[15px] font-medium whitespace-nowrap text-signal hover:text-signal-ink md:self-auto"
            >
              <GitHubIcon size={18} />
              All repositories
            </a>
          }
        />
        {cards.length > 0 && (
          <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-2">
            {cards.map((p) => (
              <article key={p.id} className="flex flex-col rounded-2xl border border-rule bg-surface p-6 md:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs text-ink-3">{[p.period, p.role].filter(Boolean).join(" · ")}</span>
                  {p.url && (
                    <a
                      href={p.url}
                      aria-label={`${p.name} on GitHub`}
                      className="-my-3 flex min-h-11 items-center gap-1.5 text-sm font-medium text-signal hover:text-signal-ink"
                    >
                      GitHub <ArrowUpRightIcon size={14} />
                    </a>
                  )}
                </div>
                <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] md:text-2xl">{p.name}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-ink-2 md:text-[15.5px]">{p.summary}</p>
                {p.flow && (
                  <div className="mt-[18px] overflow-x-auto rounded-[10px] bg-code-bg px-3.5 py-3 font-mono text-xs leading-[1.7] whitespace-pre-line text-code-ink">
                    {p.flow}
                  </div>
                )}
                {p.tags.length > 0 && (
                  <TagList className="mt-4">
                    {p.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </TagList>
                )}
              </article>
            ))}
          </div>
        )}
        {more.length > 0 && (
          <div className="mt-10 flex flex-col">
            <h3 className="border-b border-rule pb-3 font-mono text-xs font-normal text-ink-3">More on GitHub</h3>
            <ul className="grid md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
              {more.map((m) => {
                const inner = (
                  <>
                    <span className="flex justify-between gap-3">
                      <span className="text-base font-semibold">{m.name}</span>
                      <span className="font-mono text-xs text-ink-3">{m.period}</span>
                    </span>
                    <span className="text-sm leading-[1.5] text-ink-2">{m.summary}</span>
                  </>
                );
                const cls = "flex flex-col gap-1 border-b border-rule py-4 text-ink";
                return (
                  <li key={m.id} className="flex">
                    {m.url ? (
                      <a href={m.url} className={`${cls} w-full hover:text-signal`}>
                        {inner}
                      </a>
                    ) : (
                      <div className={`${cls} w-full`}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
