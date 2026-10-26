import Image from "next/image";
import type { Profile } from "@/lib/content";
import { ArrowRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from "./icons";
import { FRAME } from "./layout";
import { Tag } from "./Tag";

function updated(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function Hero({ profile }: { profile: Profile }) {
  const showProjects = profile.sections.projects;
  return (
    <section aria-labelledby="hero-title" className={`${FRAME} pt-8 lg:pt-[72px]`}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-12 xl:gap-[72px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-3.5 md:gap-5">
            <Image
              src={profile.photoUrl || "/portrait.jpg"}
              alt={`Portrait of ${profile.name}`}
              width={96}
              height={96}
              sizes="(min-width: 768px) 96px, 72px"
              preload
              unoptimized={/^https?:/.test(profile.photoUrl)}
              className="h-[72px] w-[72px] rounded-full border border-rule object-cover md:h-24 md:w-24"
            />
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-soft px-2.5 py-[5px] text-xs font-medium text-ink md:px-3 md:py-1.5 md:text-[13px]">
                <span className="h-[7px] w-[7px] rounded-full bg-ok md:h-2 md:w-2" aria-hidden="true" />
                {profile.status}
              </span>
              <span className="font-mono text-xs text-ink-3 md:text-[13px]">{profile.location}</span>
            </div>
          </div>

          <h1
            id="hero-title"
            className="mt-7 text-[44px] leading-[1.02] font-semibold tracking-[-0.04em] text-ink md:mt-9 md:text-[64px] md:leading-none xl:text-[76px]"
          >
            {profile.name}
          </h1>
          <p className="mt-2.5 text-[22px] font-medium tracking-[-0.02em] text-signal md:mt-4 md:text-[32px] md:leading-[1.2]">
            {profile.headline}
          </p>
          <p className="mt-[18px] max-w-[620px] text-base leading-[1.6] text-ink-2 md:mt-7 md:text-[19px]">{profile.pitch}</p>

          {/* Phone: stacked buttons as in MobileHero */}
          <div className="mt-7 flex flex-col gap-2.5 md:hidden">
            {showProjects && (
              <a href="#projects" className="flex h-[52px] items-center justify-center rounded-xl bg-ink text-base font-medium text-paper">
                View projects
              </a>
            )}
            <div className={`grid gap-2.5 ${profile.cvUrl ? "grid-cols-2" : "grid-cols-1"}`}>
              <a
                href="#contact"
                className="flex h-[52px] items-center justify-center rounded-xl border border-rule bg-surface text-base font-medium text-ink"
              >
                Contact me
              </a>
              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  className="flex h-[52px] items-center justify-center rounded-xl border border-rule bg-surface text-base font-medium text-ink"
                >
                  Download CV
                </a>
              )}
            </div>
            <div className="-ml-3 mt-0.5 flex gap-1">
              <a href={profile.github} className="flex h-11 items-center gap-2 px-3 text-sm text-ink-2">
                <GitHubIcon size={18} />
                GitHub
              </a>
              <a href={profile.linkedin} className="flex h-11 items-center gap-2 px-3 text-sm text-ink-2">
                <LinkedInIcon size={18} />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Tablet and desktop: one row */}
          <div className="mt-10 hidden flex-wrap items-center gap-3 md:flex">
            {showProjects && (
              <a
                href="#projects"
                className="flex h-12 items-center gap-2.5 rounded-xl bg-ink px-[22px] text-[15px] font-medium text-paper hover:opacity-90"
              >
                View projects
                <ArrowRightIcon size={16} />
              </a>
            )}
            <a
              href="#contact"
              className="flex h-12 items-center rounded-xl border border-rule bg-surface px-[22px] text-[15px] font-medium text-ink hover:border-ink-3"
            >
              Contact me
            </a>
            {profile.cvUrl && (
              <a href={profile.cvUrl} className="flex h-12 items-center gap-2 px-3 text-[15px] font-medium text-ink-2 hover:text-ink">
                <DownloadIcon size={16} />
                Download CV
              </a>
            )}
            <span className="mx-1 h-6 w-px bg-rule" aria-hidden="true" />
            <a
              href={profile.github}
              aria-label="GitHub profile"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink-2 hover:bg-chip hover:text-ink"
            >
              <GitHubIcon size={20} />
            </a>
            <a
              href={profile.linkedin}
              aria-label="LinkedIn profile"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-ink-2 hover:bg-chip hover:text-ink"
            >
              <LinkedInIcon size={20} />
            </a>
          </div>
        </div>

        <aside aria-label="Profile at a glance" className="overflow-hidden rounded-[14px] border border-rule bg-surface md:rounded-2xl">
          <div className="flex justify-between border-b border-rule px-4 py-3 font-mono text-[11px] text-ink-3 md:px-6 md:py-3.5 md:text-xs">
            <span>at-a-glance</span>
            <span>updated {updated(profile.updatedAt)}</span>
          </div>
          <dl className="flex flex-col px-4 pt-1 pb-4 md:px-6 md:pt-2 md:pb-5">
            {profile.facts.map((f, i) => (
              <div
                key={`${f.k}-${i}`}
                className="flex flex-col gap-0.5 border-b border-rule-2 py-2.5 md:grid md:grid-cols-[112px_minmax(0,1fr)] md:gap-4 md:border-rule md:py-3"
              >
                <dt className="font-mono text-[11px] text-ink-3 md:text-xs md:leading-[22px]">{f.k}</dt>
                <dd className="text-[15px] leading-[1.45] text-ink md:leading-[22px]">{f.v}</dd>
              </div>
            ))}
            {profile.coreStack.length > 0 && (
              <div className="pt-3 md:grid md:grid-cols-[112px_minmax(0,1fr)] md:gap-4 md:pt-3.5">
                <dt className="sr-only font-mono text-xs leading-[26px] text-ink-3 md:not-sr-only">core stack</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {profile.coreStack.map((t) => (
                    <Tag key={t} variant="outline">
                      {t}
                    </Tag>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </div>

      {profile.metrics.length > 0 && (
        <section
          aria-label="Key facts"
          className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-rule pt-5 pb-4 md:mt-20 md:grid-cols-3 md:gap-0 md:pt-7 md:pb-12"
        >
          {profile.metrics.map((m, i) => (
            <div key={`${m.n}-${i}`} className="flex flex-col gap-1 md:gap-1.5 md:pr-8">
              <span className="font-mono text-xl font-medium text-ink md:text-[28px] md:tracking-[-0.02em]">{m.n}</span>
              <span className="text-[13px] leading-[1.45] text-ink-2 md:text-sm md:leading-[1.5]">{m.l}</span>
            </div>
          ))}
        </section>
      )}
    </section>
  );
}
