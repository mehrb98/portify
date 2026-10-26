"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavLink } from "@/lib/site/nav";
import { CloseIcon, GitHubIcon, LinkedInIcon, MailIcon, MenuIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  name: string;
  links: NavLink[];
  cvUrl: string;
  email: string;
  github: string;
  linkedin: string;
};

/** Hamburger button and the full-screen menu used below the lg breakpoint. */
export function MobileMenu({ name, links, cvUrl, email, github, linkedin }: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // The header has a backdrop filter, which would trap a fixed child; the menu is portalled to <body>.
  // Close when the viewport grows past the breakpoint, so the page never stays locked.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(true)}
        className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-[10px] text-ink lg:hidden"
      >
        <MenuIcon size={20} />
      </button>

      {open &&
        createPortal(
          <div
            ref={dialog}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper text-ink lg:hidden"
          >
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-rule px-5">
              <span className="text-[15px] font-semibold">{name}</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="-mr-2.5 flex h-11 w-11 items-center justify-center rounded-[10px]"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <nav aria-label="Primary" className="grow px-5 pt-3">
              <ul className="flex flex-col">
                {links.map((l, i) => (
                  <li key={l.href} className="border-b border-rule">
                    <a href={l.href} onClick={() => setOpen(false)} className="flex h-[60px] items-center gap-4">
                      <span className="w-6 font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-2xl font-medium tracking-[-0.02em]">{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-3 p-5">
              {cvUrl && (
                <a
                  href={cvUrl}
                  className="flex h-[52px] items-center justify-center rounded-xl bg-ink text-base font-medium text-paper"
                >
                  Download CV
                </a>
              )}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <a
                    href={`mailto:${email}`}
                    aria-label="Email"
                    className="flex h-11 w-11 items-center justify-center text-ink-2"
                  >
                    <MailIcon size={20} />
                  </a>
                  <a href={linkedin} aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center text-ink-2">
                    <LinkedInIcon size={20} />
                  </a>
                  <a href={github} aria-label="GitHub" className="flex h-11 w-11 items-center justify-center text-ink-2">
                    <GitHubIcon size={20} />
                  </a>
                </div>
                <ThemeToggle withLabel className="h-11 bg-surface px-3.5" />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
