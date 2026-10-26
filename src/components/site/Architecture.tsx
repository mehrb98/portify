import { ARCHITECTURE_LAYERS, ARCHITECTURE_PRINCIPLES } from "@/content/architecture";
import { ArrowDownIcon } from "./icons";
import { FRAME } from "./layout";
import { SECTION_Y, SectionHead } from "./SectionHead";

export function Architecture() {
  return (
    <section id="architecture" aria-labelledby="architecture-title" className="bg-paper">
      <div className={`${FRAME} ${SECTION_Y} reveal`}>
        <SectionHead
          id="architecture"
          eyebrow="05 / Architecture"
          title="How the pieces fit together"
          intro="The layers I work across on a typical product, and the principles I bring to each one."
        />
        <div className="mt-8 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <figure aria-label="Layered architecture from client to infrastructure" className="flex flex-col">
            {ARCHITECTURE_LAYERS.map((l, i) => (
              <div key={l.n} className="flex flex-col">
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center sm:gap-4">
                  <span className="font-mono text-xs text-ink-3">
                    {l.n} {l.name}
                  </span>
                  <div
                    className={`flex flex-wrap gap-2 rounded-xl border bg-surface p-3 ${l.highlight ? "border-signal" : "border-rule"}`}
                  >
                    {l.items.map((it) => (
                      <span key={it} className="rounded-lg bg-chip px-3 py-2 text-sm font-medium">
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
                {i < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="grid h-7 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
                    <span className="hidden sm:block" />
                    <div className="flex items-center gap-2.5 pl-6 text-[#9aa0a8]">
                      <ArrowDownIcon size={16} />
                      <span className="font-mono text-[11px] text-ink-3">{l.edge}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </figure>
          <ul className="flex flex-col gap-3">
            {ARCHITECTURE_PRINCIPLES.map((p) => (
              <li key={p.t} className="flex flex-col gap-2 rounded-[14px] border border-rule bg-surface px-6 py-[22px]">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{p.t}</h3>
                  <span className="font-mono text-[11px] whitespace-nowrap text-signal">{p.where}</span>
                </div>
                <p className="text-[15px] leading-[1.55] text-ink-2">{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
