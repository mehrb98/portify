import type { Sections } from "@/lib/content";

export type NavLink = { label: string; href: string };

const LINKS: { key: keyof Sections | null; label: string; id: string }[] = [
  { key: "about", label: "About", id: "about" },
  { key: "stack", label: "Stack", id: "stack" },
  { key: "experience", label: "Experience", id: "experience" },
  { key: "projects", label: "Projects", id: "projects" },
  { key: "architecture", label: "Architecture", id: "architecture" },
  { key: "education", label: "Education", id: "education" },
  { key: null, label: "Contact", id: "contact" },
];

/** Links to the sections that are switched on. `base` is "" on the home page and "/" elsewhere. */
export function navLinks(sections: Sections, base = ""): NavLink[] {
  return LINKS.filter((l) => l.key === null || sections[l.key]).map((l) => ({ label: l.label, href: `${base}#${l.id}` }));
}
