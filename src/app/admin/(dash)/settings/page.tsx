import type { Metadata } from "next";
import { SectionToggles } from "@/components/admin/section-toggles";
import { SettingsForm } from "@/components/admin/settings-form";
import { Page, TopBar } from "@/components/admin/topbar";
import { Card } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const p = await getProfile();
  return (
    <Page>
      <TopBar crumb="Admin" title="Settings" />
      <div className="grid items-start gap-6 px-4 py-6 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SettingsForm
          version={p.updatedAt.getTime()}
          profile={{
            name: p.name,
            headline: p.headline,
            status: p.status,
            location: p.location,
            pitch: p.pitch,
            email: p.email,
            github: p.github,
            linkedin: p.linkedin,
            cvUrl: p.cvUrl,
            photoUrl: p.photoUrl,
            facts: Array.isArray(p.facts) ? p.facts : [],
            coreStack: p.coreStack.join(", "),
            metrics: Array.isArray(p.metrics) ? p.metrics : [],
            aboutTitle: p.aboutTitle,
            about: p.about,
            strengths: Array.isArray(p.strengths) ? p.strengths : [],
          }}
        />
        <Card id="sections" title="Site sections" className="xl:sticky xl:top-6">
          <SectionToggles sections={p.sections} />
          <p className="border-t border-rule-2 px-5 py-3.5 text-[12.5px] leading-normal text-ink-3">A section that is switched off is left out of the public page and its navigation.</p>
        </Card>
      </div>
    </Page>
  );
}
