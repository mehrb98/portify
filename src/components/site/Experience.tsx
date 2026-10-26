import type { JobWithRelations } from "@/lib/content";
import { formatDuration, formatPeriod } from "@/lib/months";
import { FRAME } from "./layout";
import { SECTION_Y, SectionHead } from "./SectionHead";
import { Tag, TagList } from "./Tag";

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`list-disc flex-col gap-2 pl-[18px] text-[14.5px] leading-[1.55] text-ink-2 md:text-[15.5px] md:leading-[1.6] ${className}`}>
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export function Experience({ jobs, cvUrl, now }: { jobs: JobWithRelations[]; cvUrl: string; now: string }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg-paper">
      <div className={`${FRAME} ${SECTION_Y} reveal`}>
        <SectionHead
          id="experience"
          eyebrow="03 / Experience"
          title="Four years, three product companies"
          intro="Full-stack roles across billing, commerce, booking and education platforms."
          aside={
            cvUrl ? (
              <a href={cvUrl} className="text-[15px] font-medium whitespace-nowrap text-signal hover:text-signal-ink">
                Full CV (PDF)
              </a>
            ) : null
          }
        />
        <ol className="mt-7 flex flex-col gap-4 border-l border-bar-old pl-5 md:mt-14 md:gap-0 md:border-0 md:pl-0">
          {jobs.map((j, i) => {
            const current = j.end === null;
            const period = formatPeriod(j.start, j.end);
            const location = `${j.company.city ?? "[City]"}, Germany`;
            return (
              <li key={j.id} className="relative md:grid md:grid-cols-[180px_32px_minmax(0,1fr)] lg:grid-cols-[250px_32px_minmax(0,1fr)]">
                <div className="hidden flex-col gap-1.5 pt-[26px] md:flex">
                  <span className="font-mono text-sm font-medium">{period}</span>
                  <span className="font-mono text-xs text-ink-3">{formatDuration(j.start, j.end, now)}</span>
                </div>
                <div className="absolute top-[22px] -left-[26px] md:static md:flex md:flex-col md:items-center" aria-hidden="true">
                  <span
                    className={`block h-[11px] w-[11px] rounded-full border-2 md:mt-[30px] ${
                      current ? "border-signal bg-signal" : "border-ink-3 bg-paper"
                    }`}
                  />
                  <span className={`hidden w-px grow bg-bar-old md:block ${i === jobs.length - 1 ? "md:mb-6" : ""}`} />
                </div>
                <article className="flex flex-col rounded-[14px] border border-rule bg-surface p-[18px] md:mb-6 md:ml-6 md:rounded-2xl md:px-8 md:pt-[26px] md:pb-7">
                  <span className="font-mono text-[11.5px] text-ink-3 md:hidden">{period}</span>
                  <div className="mt-2 flex flex-col gap-0.5 md:mt-0 md:flex-row md:items-baseline md:justify-between md:gap-6">
                    <h3 className="text-lg leading-[1.3] font-semibold tracking-[-0.015em] md:text-[22px]">
                      {j.role}
                      <span className="hidden md:inline">
                        {" "}
                        <span className="font-normal text-ink-3">at</span> {j.company.name}
                      </span>
                    </h3>
                    <span className="text-[15px] text-ink-2 md:hidden">{j.company.name}</span>
                    <span className="font-mono text-xs whitespace-nowrap text-ink-3 max-md:mt-1">{location}</span>
                  </div>
                  <Bullets items={j.bullets} className="mt-4 hidden md:flex" />
                  <TagList className="mt-3 md:order-last md:mt-5">
                    {j.technologies.map((t) => (
                      <Tag key={t.id}>
                        {t.name}
                      </Tag>
                    ))}
                  </TagList>
                  {/* phone: details fold away, the first one open (MobileExperience) */}
                  <details className="group mt-1 md:hidden" open={i === 0}>
                    <summary className="-ml-2 flex h-11 cursor-pointer list-none items-center px-2 text-sm font-medium text-signal [&::-webkit-details-marker]:hidden">
                      <span className="group-open:hidden">Show details</span>
                      <span className="hidden group-open:inline">Hide details</span>
                    </summary>
                    <Bullets items={j.bullets} className="flex" />
                  </details>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
