import type { ReactNode } from "react";

const VARIANTS = {
  /** chip fill, used on cards */
  fill: "bg-chip",
  /** outlined on paper, used in the at-a-glance card and the toolkit */
  outline: "border border-rule bg-paper",
  /** outlined on surface, used on the featured case study */
  surface: "border border-rule bg-surface",
};

export function Tag({ children, variant = "fill", small = false }: { children: ReactNode; variant?: keyof typeof VARIANTS; small?: boolean }) {
  return (
    <span
      className={`rounded-md font-mono text-ink ${small ? "px-2 py-[3px] text-[11.5px]" : "px-[9px] py-1 text-xs"} ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}

export function TagList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap gap-1.5 ${className}`}>{children}</div>;
}
