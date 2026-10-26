import type { Profile } from "@/lib/content";
import { navLinks } from "@/lib/site/nav";
import { DownloadIcon } from "./icons";
import { FRAME } from "./layout";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ profile, base = "" }: { profile: Profile; base?: string }) {
  const links = navLinks(profile.sections, base);
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className={`${FRAME} flex h-[60px] items-center justify-between gap-6 lg:h-[72px]`}>
        <a href={base ? "/" : "#top"} className="flex items-center gap-3 text-ink" aria-label={`${profile.name}, home`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] border-ink font-mono text-xs font-medium">
            MB
          </span>
          <span className="hidden text-[15px] font-semibold tracking-[-0.01em] sm:inline">{profile.name}</span>
        </a>
        <nav aria-label="Primary" className="hidden gap-6 text-sm lg:flex xl:gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-ink-2 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle className="h-10 w-10" />
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              className="flex h-10 items-center gap-2 rounded-[10px] border border-rule px-4 text-sm font-medium text-ink hover:bg-chip"
            >
              <DownloadIcon size={16} />
              CV
            </a>
          )}
        </div>
        <MobileMenu
          name={profile.name}
          links={links}
          cvUrl={profile.cvUrl}
          email={profile.email}
          github={profile.github}
          linkedin={profile.linkedin}
        />
      </div>
    </header>
  );
}
