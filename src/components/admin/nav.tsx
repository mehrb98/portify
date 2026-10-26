"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { NavCounts } from "@/lib/admin/queries";
import { IconBriefcase, IconBuilding, IconCap, IconCode, IconFolder, IconMenu, IconOverview, IconSettings } from "./icons";
import { cx } from "./ui";

const ITEMS: { href: string; label: string; icon: ReactNode; count?: keyof NavCounts }[] = [
  { href: "/admin", label: "Overview", icon: <IconOverview /> },
  { href: "/admin/projects", label: "Projects", icon: <IconFolder />, count: "projects" },
  { href: "/admin/companies", label: "Companies", icon: <IconBuilding />, count: "companies" },
  { href: "/admin/jobs", label: "Jobs", icon: <IconBriefcase />, count: "jobs" },
  { href: "/admin/education", label: "Education", icon: <IconCap />, count: "education" },
  { href: "/admin/technologies", label: "Technologies", icon: <IconCode />, count: "technologies" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({ href, label, icon, count, pathname }: { href: string; label: string; icon: ReactNode; count?: number; pathname: string }) {
  const on = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={cx(
        "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium",
        on ? "bg-soft text-signal" : "text-ink-2 hover:bg-chip hover:text-ink",
      )}
    >
      {icon}
      {label}
      {count !== undefined ? <span className={cx("ml-auto font-mono text-[11px]", on ? "text-signal" : "text-ink-3")}>{count}</span> : null}
    </Link>
  );
}

export function NavLinks({ counts }: { counts: NavCounts }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {ITEMS.map((it) => (
        <NavItem key={it.href} {...it} count={it.count ? counts[it.count] : undefined} pathname={pathname} />
      ))}
    </nav>
  );
}

export function SettingsLink() {
  const pathname = usePathname();
  return <NavItem href="/admin/settings" label="Settings" icon={<IconSettings />} pathname={pathname} />;
}

/** Below 1024px the sidebar folds into this menu; it closes again after each navigation. */
export function MobileMenu({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <details key={pathname} className="group relative">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-[10px] border border-rule bg-surface px-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
        <IconMenu />
        Menu
      </summary>
      <div className="absolute left-0 top-11 z-30 flex w-64 flex-col gap-3 rounded-xl border border-rule bg-paper p-3 shadow-lg">{children}</div>
    </details>
  );
}
