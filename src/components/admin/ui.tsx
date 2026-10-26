// Presentational building blocks for the admin (no hooks, so they work in server and client components).
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

const btnBase =
  "inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[10px] border px-3.5 text-sm font-medium whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
export const btn = {
  primary: cx(btnBase, "border-ink bg-ink text-surface hover:bg-ink-2 hover:border-ink-2"),
  secondary: cx(btnBase, "border-rule bg-surface text-ink hover:border-ink-3"),
  danger: cx(btnBase, "border-danger bg-danger text-surface hover:opacity-90"),
  dangerGhost: cx(btnBase, "border-rule bg-surface text-danger hover:border-danger"),
  small: "inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-rule bg-surface px-2 text-xs font-medium text-ink-2 hover:border-ink-3 hover:text-ink cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
  link: "inline-flex items-center gap-1 text-[13px] font-medium text-signal hover:underline cursor-pointer",
};

export const inputClass =
  "h-10 w-full rounded-[10px] border border-bar-old bg-surface px-3 text-sm text-ink placeholder:text-ink-3 focus:border-signal focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 aria-[invalid=true]:border-danger disabled:bg-paper disabled:text-ink-3";
export const textareaClass = cx(inputClass, "h-auto py-2.5 leading-normal");

type FieldBase = { id: string; label: ReactNode; error?: string[]; hint?: ReactNode; warn?: ReactNode; className?: string };

function Described({ id, error, hint, warn }: Pick<FieldBase, "id" | "error" | "hint" | "warn">) {
  return (
    <>
      {error?.length ? (
        <span id={`${id}-err`} className="text-[12.5px] text-danger">
          {error[0]}
        </span>
      ) : warn ? (
        <span id={`${id}-warn`} className="text-[12.5px] text-warn">
          {warn}
        </span>
      ) : null}
      {hint ? (
        <span id={`${id}-hint`} className="text-[12.5px] leading-normal text-ink-3">
          {hint}
        </span>
      ) : null}
    </>
  );
}

function describedBy({ id, error, hint, warn }: Pick<FieldBase, "id" | "error" | "hint" | "warn">) {
  return [error?.length ? `${id}-err` : warn ? `${id}-warn` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

export function TextField({ id, label, error, hint, warn, className, mono, ...rest }: FieldBase & { mono?: boolean } & Omit<ComponentProps<"input">, "id">) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <input
        id={id}
        name={rest.name ?? id}
        aria-invalid={error?.length ? true : undefined}
        aria-describedby={describedBy({ id, error, hint, warn })}
        className={cx(inputClass, mono && "font-mono text-[13px]", !error?.length && warn ? "border-warn" : undefined)}
        {...rest}
      />
      <Described id={id} error={error} hint={hint} warn={warn} />
    </div>
  );
}

export function TextArea({ id, label, error, hint, warn, className, mono, ...rest }: FieldBase & { mono?: boolean } & Omit<ComponentProps<"textarea">, "id">) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <textarea
        id={id}
        name={rest.name ?? id}
        aria-invalid={error?.length ? true : undefined}
        aria-describedby={describedBy({ id, error, hint, warn })}
        className={cx(textareaClass, mono && "font-mono text-[13px]")}
        {...rest}
      />
      <Described id={id} error={error} hint={hint} warn={warn} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  warn,
  className,
  options,
  ...rest
}: FieldBase & { options: readonly { value: string; label: string }[] } & Omit<ComponentProps<"select">, "id">) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      <select
        id={id}
        name={rest.name ?? id}
        aria-invalid={error?.length ? true : undefined}
        aria-describedby={describedBy({ id, error, hint, warn })}
        className={cx(inputClass, "pr-8")}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Described id={id} error={error} hint={hint} warn={warn} />
    </div>
  );
}

export function CheckboxField({ id, label, hint, className, ...rest }: Omit<FieldBase, "error" | "warn"> & Omit<ComponentProps<"input">, "id" | "type">) {
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="inline-flex min-h-10 cursor-pointer items-center gap-2.5 text-sm">
        <input id={id} name={rest.name ?? id} type="checkbox" className="size-[18px] cursor-pointer accent-signal" aria-describedby={hint ? `${id}-hint` : undefined} {...rest} />
        {label}
      </label>
      {hint ? (
        <span id={`${id}-hint`} className="text-[12.5px] leading-normal text-ink-3">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/** Rounded bordered card with an optional header row. */
export function Card({
  title,
  icon,
  sub,
  action,
  children,
  className,
  id,
}: {
  title?: ReactNode;
  icon?: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const hid = id ? `${id}-h` : undefined;
  return (
    <section id={id} aria-labelledby={hid} className={cx("flex min-w-0 flex-col rounded-[14px] border border-rule bg-surface", className)}>
      {title ? (
        <div className="flex items-center gap-2.5 border-b border-rule px-5 py-4">
          {icon ? <span className="flex text-ink-3">{icon}</span> : null}
          <h2 id={hid} className="text-base font-semibold">
            {title}
          </h2>
          {sub ? <span className="font-mono text-xs text-ink-3">{sub}</span> : null}
          {action ? <div className="ml-auto flex items-center gap-2">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatusPill({ status }: { status: "PUBLISHED" | "DRAFT" | "HIDDEN" }) {
  const map = {
    PUBLISHED: ["Published", "bg-ok/10 text-ok"],
    DRAFT: ["Draft", "bg-warn/10 text-warn"],
    HIDDEN: ["Hidden", "bg-chip text-ink-3"],
  } as const;
  const [label, cls] = map[status];
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-xs font-medium", cls)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}

export function FeaturedBadge() {
  return <span className="shrink-0 rounded bg-signal px-1.5 py-0.5 font-mono text-[10px] text-surface">Featured</span>;
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-md bg-chip px-2 py-1 font-mono text-xs">{children}</span>;
}

/** Pill tabs that are plain links (filters live in searchParams). */
export function FilterTabs({ label, tabs }: { label: string; tabs: { href: string; label: string; n?: number; on: boolean }[] }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-1.5">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={t.on ? "page" : undefined}
          className={cx(
            "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium",
            t.on ? "border-ink bg-ink text-surface" : "border-rule bg-surface text-ink hover:border-ink-3",
          )}
        >
          {t.label}
          {t.n !== undefined ? <span className="font-mono text-[11px] opacity-70">{t.n}</span> : null}
        </Link>
      ))}
    </nav>
  );
}

/** The 32x18 switch from the design, as a visual inside a button or label. */
export function SwitchVisual({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={cx("relative inline-block h-[18px] w-8 shrink-0 rounded-full transition-colors", on ? "bg-signal" : "bg-bar-old")}>
      <span className={cx("absolute top-0.5 size-3.5 rounded-full bg-surface shadow-sm transition-[left]", on ? "left-4" : "left-0.5")} />
    </span>
  );
}

export function Notice({ tone, children }: { tone: "ok" | "error" | "warn"; children: ReactNode }) {
  const cls = { ok: "border-ok/30 bg-ok/10 text-ok", error: "border-danger/30 bg-danger/10 text-danger", warn: "border-warn/30 bg-warn/10 text-warn" }[tone];
  return (
    <p role={tone === "error" ? "alert" : "status"} className={cx("rounded-[10px] border px-3 py-2 text-[13px] font-medium", cls)}>
      {children}
    </p>
  );
}

export function initials(name: string) {
  const words = name.split(/\s+/).filter((w) => w && !/^gmbh$/i.test(w));
  const first = words[0] ?? "?";
  // "W&S Digital" -> "WS", "Orcaya" -> "OR", "Mehrulloh Boboev" -> "MB"
  if (first.includes("&")) return first.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2).toUpperCase();
  if (words.length >= 2) return (first[0] + words[1][0]).toUpperCase();
  return first.slice(0, 2).toUpperCase();
}
