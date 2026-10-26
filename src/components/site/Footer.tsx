import type { Profile } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { FRAME } from "./layout";

export function Footer({ profile, base = "" }: { profile: Profile; base?: string }) {
  const s = profile.sections;
  const links = [
    s.about && { label: "About", href: `${base}#about` },
    s.experience && { label: "Experience", href: `${base}#experience` },
    s.projects && { label: "Projects", href: `${base}#projects` },
    profile.cvUrl && { label: "CV (PDF)", href: profile.cvUrl },
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ].filter((l): l is { label: string; href: string } => Boolean(l));
  const icon = "flex h-11 w-11 items-center justify-center text-ink-2 hover:text-signal";

  return (
    <footer id="contact" className="bg-paper">
      <div className={FRAME}>
        <div className="flex flex-col gap-6 border-t border-rule pt-8 pb-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold">{profile.name}</span>
            <span className="font-mono text-xs text-ink-3">
              {profile.headline} · © {new Date().getFullYear()}
            </span>
          </div>
          <nav aria-label="Footer" className="-my-3 flex flex-wrap gap-x-6 text-sm">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="flex min-h-11 items-center text-ink-2 hover:text-signal">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="-ml-3 flex gap-1 lg:ml-0">
            <a href={`mailto:${profile.email}`} aria-label="Email" className={icon}>
              <MailIcon size={18} />
            </a>
            <a href={profile.linkedin} aria-label="LinkedIn" className={icon}>
              <LinkedInIcon size={18} />
            </a>
            <a href={profile.github} aria-label="GitHub" className={icon}>
              <GitHubIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
