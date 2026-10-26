import type { ReactNode } from "react";
import type { Profile } from "@/lib/content";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FRAME } from "./layout";

/** Shell for the Impressum and Datenschutz pages, with the site header and footer. */
export function LegalPage({ profile, eyebrow, title, children }: { profile: Profile; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <>
      <Header profile={profile} base="/" />
      <main id="top" className={`${FRAME} py-14 md:py-20`}>
        <div className="max-w-[760px]">
          <span className="font-mono text-xs text-signal md:text-[13px]">{eyebrow}</span>
          <h1 className="mt-2.5 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] md:mt-3.5 md:text-[44px]">{title}</h1>
          <p className="mt-6 rounded-xl border border-dashed border-warn/60 bg-surface px-4 py-3 text-sm leading-[1.6] text-ink-2">
            Values in <Ph>[brackets]</Ph> are placeholders. The site owner must replace them before the site goes live.
          </p>
          <div className="mt-10 flex flex-col gap-8 text-base leading-[1.65] text-ink-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-[-0.015em] [&_h2]:text-ink">
            {children}
          </div>
        </div>
      </main>
      <Footer profile={profile} base="/" />
    </>
  );
}

/** A value still to be supplied by the owner. */
export function Ph({ children }: { children: ReactNode }) {
  return <span className="font-medium text-warn">{children}</span>;
}
