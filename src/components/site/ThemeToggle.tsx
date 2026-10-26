"use client";

import { MoonIcon, SunIcon } from "./icons";

/** Toggles the .dark class on <html> and remembers the choice in localStorage ("theme"). */
export function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // storage blocked: the choice lasts for this page view
  }
}

export function ThemeToggle({ withLabel = false, className = "" }: { withLabel?: boolean; className?: string }) {
  // Both icons are rendered and switched by CSS, so the server markup matches before the theme is known.
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch colour theme"
      className={`flex items-center justify-center gap-2 rounded-[10px] border border-rule text-ink hover:bg-chip ${className}`}
    >
      <MoonIcon size={18} className="dark:hidden" />
      <SunIcon size={18} className="hidden dark:block" />
      {withLabel && (
        <span className="text-sm" aria-hidden="true">
          <span className="dark:hidden">Dark</span>
          <span className="hidden dark:inline">Light</span>
        </span>
      )}
    </button>
  );
}
