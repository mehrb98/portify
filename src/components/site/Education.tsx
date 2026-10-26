import { PHASE_SUBTITLES } from "@/content/journey";
import type { SiteContent } from "@/lib/content";
import { isPlaceholder } from "@/lib/content";
import { FRAME } from "./layout";
import { SECTION_Y, SectionHead } from "./SectionHead";

type Props = Pick<SiteContent, "education" | "certificates" | "milestones"> & { hasCurrentJob: boolean };

function years(e: { startYear: number; endYear: number | null }) {
  return `${e.startYear} to ${e.endYear ?? "now"}`;
}

/** Years named in milestone labels such as "2022", "09/2022" or "2024–25". */
function labelYears(label: string): number[] {
  const out: number[] = [];
  for (const m of label.matchAll(/(\d{4})(?:\s*[–-]\s*(\d{2,4}))?/g)) {
    const a = Number(m[1]);
    out.push(a);
    if (m[2]) out.push(m[2].length === 2 ? Math.floor(a / 100) * 100 + Number(m[2]) : Number(m[2]));
  }
  return out;
}

const BARS = ["bg-bar-old", "bg-[#8aa8ff] dark:bg-[#4a63b8]", "bg-signal"];

export function Education({ education, certificates, milestones, hasCurrentJob }: Props) {
  const ausbildung = education.find((e) => e.kind === "AUSBILDUNG");
  // Rows still holding a [placeholder] stay off the public page until they are filled in.
  const details = ausbildung?.details.filter((d) => !isPlaceholder(d.v)) ?? [];
  const degrees = education.filter((e) => e.kind === "DEGREE");

  const phaseNames = [...new Set(milestones.map((m) => m.phase))];
  const phases = phaseNames.map((name, i) => {
    const ms = milestones.filter((m) => m.phase === name);
    const last = i === phaseNames.length - 1;
    let span = "";
    if (name === "Ausbildung" && ausbildung) span = years(ausbildung);
    else {
      const ys = ms.flatMap((m) => labelYears(m.label));
      if (ys.length) span = `${Math.min(...ys)} to ${last && hasCurrentJob ? "now" : Math.max(...ys)}`;
    }
    const bar = phaseNames.length === 1 ? BARS[2] : i === 0 ? BARS[0] : last ? BARS[2] : BARS[1];
    return { name, span, sub: PHASE_SUBTITLES[name], bar, ms };
  });

  return (
    <section id="education" aria-labelledby="education-title" className="bg-surface">
      <div className={`${FRAME} ${SECTION_Y} reveal`}>
        <SectionHead
          id="education"
          eyebrow="06 / Education and journey"
          title="From Ausbildung to full-stack engineer"
          intro="Trained as a software developer in Stuttgart while working in production codebases, then took on more ownership with every role."
        />

        {phases.length > 0 && (
          <ol aria-label="Career journey" className="mt-8 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-6">
            {phases.map((p) => (
              <li key={p.name} className="flex flex-col">
                <div className={`h-1.5 rounded-[3px] ${p.bar}`} aria-hidden="true" />
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{p.name}</h3>
                  {p.span && <span className="font-mono text-xs whitespace-nowrap text-ink-3">{p.span}</span>}
                </div>
                {p.sub && <span className="mt-1.5 text-[15px] text-ink-2">{p.sub}</span>}
                <ul className="mt-5 flex flex-col gap-3.5">
                  {p.ms.map((m) => (
                    <li key={m.id} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3">
                      <span className="font-mono text-xs leading-[23px] text-ink-3">{m.label}</span>
                      <span className="text-[15px] leading-[1.55]">{m.text}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          {ausbildung && (
            <article className="flex flex-col rounded-2xl border border-rule bg-paper p-6 md:p-8">
              <span className="font-mono text-xs text-ink-3">
                Ausbildung · {years(ausbildung)} · {ausbildung.state}
              </span>
              <h3 className="mt-3.5 text-[24px] font-semibold tracking-[-0.02em] md:text-[26px]">{ausbildung.title}</h3>
              <span className="mt-1 text-base text-ink-2">
                {ausbildung.school}, {ausbildung.location}
              </span>
              {details.length > 0 && (
                <dl className="mt-6 flex flex-col">
                  {details.map((d, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 border-t border-rule py-3 sm:grid sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-4"
                    >
                      <dt className="font-mono text-xs leading-[22px] text-ink-3">{d.k}</dt>
                      <dd className="text-[15px] leading-[22px]">{d.v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          )}
          <div className="flex flex-col gap-6">
            {degrees.map((d) => (
              <article key={d.id} className="flex flex-col gap-1 rounded-2xl border border-rule px-6 py-6 md:px-7">
                <span className="font-mono text-xs text-ink-3">Degree · {years(d)}</span>
                <h3 className="mt-2 text-lg font-semibold">{d.title}</h3>
                <span className="text-[15px] text-ink-2">
                  {d.school}, {d.location}
                </span>
              </article>
            ))}
            {certificates.length > 0 && (
              <article className="flex flex-col gap-3 rounded-2xl border border-rule px-6 py-6 md:px-7">
                <h3 className="font-mono text-xs font-normal text-ink-3">Certificates and recognition</h3>
                <ul className="flex flex-col gap-2.5 text-[15px] leading-[1.45]">
                  {certificates.map((c) => (
                    <li key={c.id}>
                      {c.title} <span className="font-mono text-xs text-ink-3">{c.meta}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
