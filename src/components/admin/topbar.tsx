import Link from "next/link";
import type { ReactNode } from "react";
import { IconEye } from "./icons";
import { btn, cx } from "./ui";

/** Top bar: breadcrumb, title and actions. "Preview site" is always there. */
export function TopBar({ crumb, title, actions }: { crumb: string; title: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex min-h-[72px] shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-rule px-4 py-3 sm:px-8">
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[11px] text-ink-3">{crumb}</span>
        <h1 className="mt-0.5 truncate text-xl font-semibold tracking-[-0.015em]">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <a href="/" target="_blank" rel="noopener noreferrer" className={btn.secondary}>
          <IconEye />
          Preview site
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        {actions}
      </div>
    </header>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cx("flex min-w-0 flex-1 flex-col", className)}>{children}</main>;
}

export function NewLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={btn.primary}>
      {children}
    </Link>
  );
}
