import type { ReactNode } from "react";

/** Eyebrow ("02 / Stack"), h2 and intro, as in the design. */
export function SectionHead({
  id,
  eyebrow,
  title,
  intro,
  aside,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 ${className}`}>
      <div className="flex max-w-[760px] flex-col">
        <span className="font-mono text-xs text-signal md:text-[13px]">{eyebrow}</span>
        <h2
          id={`${id}-title`}
          className="mt-2.5 text-[30px] leading-[1.15] font-semibold tracking-[-0.03em] text-ink md:mt-3.5 md:text-[44px] md:leading-[1.1]"
        >
          {title}
        </h2>
        {intro && <p className="mt-3 text-[15px] leading-[1.6] text-ink-2 md:mt-4 md:text-lg">{intro}</p>}
      </div>
      {aside}
    </div>
  );
}

/** Vertical rhythm of a section: 56px on phones, 104px on desktop. */
export const SECTION_Y = "py-14 md:py-20 xl:py-[104px]";
