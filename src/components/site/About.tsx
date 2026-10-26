import type { Profile } from "@/lib/content";
import { FRAME } from "./layout";
import { SECTION_Y } from "./SectionHead";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper">
      <div
        className={`${FRAME} ${SECTION_Y} reveal grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16 xl:gap-24 xl:py-28`}
      >
        <div className="flex flex-col">
          <span className="font-mono text-xs text-signal md:text-[13px]">01 / About</span>
          <h2
            id="about-title"
            className="mt-2.5 text-[30px] leading-[1.15] font-semibold tracking-[-0.03em] md:mt-3.5 md:text-[44px] md:leading-[1.1]"
          >
            {profile.aboutTitle}
          </h2>
          <div className="mt-6 flex flex-col gap-[18px] text-base leading-[1.65] text-ink-2 md:mt-8 md:text-lg">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        {profile.strengths.length > 0 && (
          <div className="flex flex-col lg:pt-10">
            <h3 className="border-b border-rule pb-3 font-mono text-xs font-normal text-ink-3">What I bring</h3>
            <ol>
              {profile.strengths.map((s, i) => (
                <li key={i} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-rule py-[22px]">
                  <span className="font-mono text-[13px] leading-[26px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-semibold tracking-[-0.01em]">{s.t}</span>
                    <span className="text-[15px] leading-[1.55] text-ink-2">{s.d}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
