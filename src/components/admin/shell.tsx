import type { ReactNode } from "react";
import { logout } from "@/lib/admin/actions/auth";
import type { NavCounts } from "@/lib/admin/queries";
import { IconLogout } from "./icons";
import { MobileMenu, NavLinks, SettingsLink } from "./nav";
import { initials } from "./ui";

function Brand({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5 px-1.5">
      <span className="flex size-[30px] items-center justify-center rounded-lg bg-ink font-mono text-xs font-medium text-surface">{initials(name)}</span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">Portfolio admin</span>
        <span className="font-mono text-[11px] text-ink-3">content manager</span>
      </div>
    </div>
  );
}

function Owner({ name, email }: { name: string; email: string }) {
  return (
    <div className="mt-3 flex items-center gap-2.5 border-t border-rule px-2.5 pt-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-bar-old text-[11px] font-semibold">{initials(name)}</span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] font-medium">{name}</span>
        <span className="truncate font-mono text-[11px] text-ink-3" title={email}>
          {email}
        </span>
      </div>
      <form action={logout} className="ml-auto">
        <button type="submit" className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-ink-3 hover:bg-chip hover:text-ink" title="Sign out">
          <IconLogout />
          <span className="sr-only">Sign out</span>
        </button>
      </form>
    </div>
  );
}

export function AdminShell({ counts, name, email, children }: { counts: NavCounts; name: string; email: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-surface text-ink">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-rule bg-paper px-4 py-5 lg:flex">
        <Brand name={name} />
        <span className="mx-2.5 mt-7 mb-2 font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">Content</span>
        <NavLinks counts={counts} />
        <div className="mt-auto flex flex-col gap-0.5">
          <SettingsLink />
          <Owner name={name} email={email} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-rule bg-paper px-4 py-3 lg:hidden">
          <MobileMenu>
            <NavLinks counts={counts} />
            <div className="flex flex-col gap-0.5 border-t border-rule pt-2">
              <SettingsLink />
              <Owner name={name} email={email} />
            </div>
          </MobileMenu>
          <Brand name={name} />
        </div>
        {children}
      </div>
    </div>
  );
}
