"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Category chips for the stack timeline. The rows are rendered on the server inside `children`;
 * each group carries data-group, and the filter hides the groups that do not match.
 */
export function TimelineFilter({ groups, children }: { groups: string[]; children: ReactNode }) {
  const [active, setActive] = useState("All");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>("[data-group]").forEach((el) => {
      el.hidden = active !== "All" && el.dataset.group !== active;
    });
  }, [active]);

  return (
    <div ref={ref}>
      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:mt-10"
      >
        {["All", ...groups].map((g) => {
          const on = g === active;
          return (
            <button
              key={g}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(g)}
              className={`h-11 shrink-0 cursor-pointer rounded-full border px-3.5 text-sm font-medium lg:h-9 ${
                on ? "border-ink bg-ink text-paper" : "border-rule bg-surface text-ink hover:border-ink-3"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
