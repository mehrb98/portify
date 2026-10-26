import { toggleSection } from "@/lib/admin/actions/settings";
import { SECTION_KEYS, SECTION_LABELS, type Sections, type SectionKey } from "@/lib/content";
import { SwitchForm } from "./controls";

/** Which admin page feeds each section. */
const SOURCE: Record<SectionKey, string> = {
  about: "Settings",
  stack: "Technologies",
  experience: "Jobs",
  projects: "Projects",
  sideProjects: "Projects",
  architecture: "Projects",
  education: "Education",
};

export function SectionToggles({ sections }: { sections: Sections }) {
  return (
    <ul className="flex flex-col gap-1 px-5 py-4">
      {SECTION_KEYS.map((key, i) => (
        <li key={key}>
          <SwitchForm action={toggleSection.bind(null, key)} on={sections[key]} label={`Show ${SECTION_LABELS[key]} on the site`} className="py-1.5">
            <span className="w-6 font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
            <span className={sections[key] ? "flex-1 text-sm" : "flex-1 text-sm text-ink-3 line-through decoration-ink-3/50"}>{SECTION_LABELS[key]}</span>
            <span className="font-mono text-xs text-ink-3">{SOURCE[key]}</span>
          </SwitchForm>
        </li>
      ))}
    </ul>
  );
}
