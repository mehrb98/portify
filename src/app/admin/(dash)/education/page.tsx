import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoveButtons } from "@/components/admin/controls";
import { CertificateForm, EducationForm, MilestoneForm } from "@/components/admin/education-forms";
import { IconAlert, IconBadge, IconCap, IconFlag, IconPlus } from "@/components/admin/icons";
import { NewLink, Page, TopBar } from "@/components/admin/topbar";
import { Card, cx } from "@/components/admin/ui";
import { moveCertificate, moveEducation, moveMilestone } from "@/lib/admin/actions/education";
import { requireAdmin } from "@/lib/auth";
import { getCertificates, getEducation, getMilestones } from "@/lib/content";

export const metadata: Metadata = { title: "Education" };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const PLACEHOLDER = /\[[^\]]+\]/;

function AddLink({ href }: { href: string }) {
  return (
    <Link href={href} scroll={false} className="inline-flex items-center gap-1 text-[13px] font-medium text-signal hover:underline">
      <IconPlus size={14} />
      Add
    </Link>
  );
}

function EditLink({ href, editing, label }: { href: string; editing: boolean; label: string }) {
  return editing ? (
    <Link href="/admin/education" scroll={false} className="text-[13px] font-medium text-ink-3 hover:text-ink">
      Close
    </Link>
  ) : (
    <Link href={href} scroll={false} className="text-[13px] font-medium text-signal hover:underline">
      Edit<span className="sr-only">: {label}</span>
    </Link>
  );
}

export default async function EducationPage({ searchParams }: PageProps<"/admin/education">) {
  await requireAdmin();
  const sp = await searchParams;
  const [kind, editId] = one(sp.edit).split(":");
  const [education, certificates, milestones] = await Promise.all([getEducation(), getCertificates(), getMilestones()]);

  if (editId && editId !== "new") {
    const exists =
      (kind === "edu" && education.some((e) => e.id === editId)) ||
      (kind === "cert" && certificates.some((c) => c.id === editId)) ||
      (kind === "ms" && milestones.some((m) => m.id === editId));
    if (!exists) notFound();
  }
  const isEditing = (k: string, id: string) => kind === k && editId === id;

  return (
    <Page>
      <TopBar
        crumb="Admin / Content"
        title="Education, certificates and milestones"
        actions={
          <NewLink href="/admin/education?edit=edu:new">
            <IconPlus />
            Add education
          </NewLink>
        }
      />
      <div className="grid items-start gap-6 px-4 py-6 sm:px-8 xl:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-6">
          <Card id="education" title="Education" icon={<IconCap />} action={<AddLink href="/admin/education?edit=edu:new" />}>
            {isEditing("edu", "new") ? (
              <div className="border-b border-rule-2 bg-paper/60 px-5 py-4">
                <EducationForm entry={null} />
              </div>
            ) : null}
            <ul>
              {education.map((e, i) => {
                const editing = isEditing("edu", e.id);
                const todos = e.details.filter((d) => PLACEHOLDER.test(d.v)).map((d) => d.k);
                return (
                  <li key={e.id} className={cx("border-b border-rule-2 last:border-b-0", editing && "bg-paper/60")}>
                    <div className="flex items-start gap-3 px-5 py-3.5">
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-[14.5px] font-semibold">
                            {e.title}
                            {e.kind === "AUSBILDUNG" ? <span className="font-normal text-ink-3"> (Ausbildung)</span> : null}
                          </span>
                          <span className="ml-auto shrink-0 font-mono text-xs text-ink-3">
                            {e.startYear} to {e.endYear ?? "now"}
                          </span>
                        </div>
                        <span className="text-[13.5px] text-ink-2">
                          {e.school}, {e.location} · {e.state}
                        </span>
                        {todos.length ? (
                          <span className="flex items-center gap-1.5 text-[12.5px] text-warn">
                            <IconAlert size={13} />
                            {todos.join(" and ")} still to add
                          </span>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <MoveButtons up={moveEducation.bind(null, e.id, "up")} down={moveEducation.bind(null, e.id, "down")} first={i === 0} last={i === education.length - 1} label={e.title} />
                        <EditLink href={`/admin/education?edit=edu:${e.id}`} editing={editing} label={e.title} />
                      </div>
                    </div>
                    {editing ? (
                      <div className="px-5 pb-5">
                        <EducationForm
                          entry={{
                            id: e.id,
                            kind: e.kind,
                            title: e.title,
                            school: e.school,
                            location: e.location,
                            startYear: String(e.startYear),
                            endYear: e.endYear ? String(e.endYear) : "",
                            state: e.state,
                            details: e.details,
                          }}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {education.length === 0 ? <p className="px-5 py-6 text-sm text-ink-3">No education entries yet.</p> : null}
          </Card>

          <Card id="milestones" title="Career milestones" icon={<IconFlag />} sub="journey in the education section" action={<AddLink href="/admin/education?edit=ms:new#milestones" />}>
            {isEditing("ms", "new") ? (
              <div className="border-b border-rule-2 bg-paper/60 px-5 py-4">
                <MilestoneForm milestone={null} />
              </div>
            ) : null}
            <ul>
              {milestones.map((m, i) => {
                const editing = isEditing("ms", m.id);
                const newPhase = i === 0 || milestones[i - 1].phase !== m.phase;
                return (
                  <li key={m.id} className={cx("border-b border-rule-2 last:border-b-0", editing && "bg-paper/60")}>
                    {newPhase ? <div className="px-5 pt-3 font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase">{m.phase}</div> : null}
                    <div className="flex items-center gap-3 px-5 py-2.5">
                      <span className="w-16 shrink-0 font-mono text-xs text-ink-2">{m.label}</span>
                      <span className="min-w-0 flex-1 text-[13.5px]">{m.text}</span>
                      <MoveButtons up={moveMilestone.bind(null, m.id, "up")} down={moveMilestone.bind(null, m.id, "down")} first={i === 0} last={i === milestones.length - 1} label={m.label} />
                      <EditLink href={`/admin/education?edit=ms:${m.id}#milestones`} editing={editing} label={`${m.label} ${m.text}`} />
                    </div>
                    {editing ? (
                      <div className="px-5 pb-5">
                        <MilestoneForm milestone={{ id: m.id, phase: m.phase, label: m.label, text: m.text }} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {milestones.length === 0 ? <p className="px-5 py-6 text-sm text-ink-3">No milestones yet.</p> : null}
          </Card>
        </div>

        <Card id="certificates" title="Certificates and recognition" icon={<IconBadge />} action={<AddLink href="/admin/education?edit=cert:new#certificates" />}>
          {isEditing("cert", "new") ? (
            <div className="border-b border-rule-2 bg-paper/60 px-5 py-4">
              <CertificateForm certificate={null} />
            </div>
          ) : null}
          <ul>
            {certificates.map((c, i) => {
              const editing = isEditing("cert", c.id);
              return (
                <li key={c.id} className={cx("border-b border-rule-2 last:border-b-0", editing && "bg-paper/60")}>
                  <div className="flex items-center gap-3 px-5 py-2.5">
                    <span className={cx("shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]", c.kind === "RECOGNITION" ? "bg-soft text-signal" : "bg-chip text-ink-2")}>
                      {c.kind === "RECOGNITION" ? "recognition" : "course"}
                    </span>
                    <span className="min-w-0 flex-1 text-sm">{c.title}</span>
                    <span className="shrink-0 font-mono text-xs text-ink-3">{c.meta}</span>
                    <MoveButtons up={moveCertificate.bind(null, c.id, "up")} down={moveCertificate.bind(null, c.id, "down")} first={i === 0} last={i === certificates.length - 1} label={c.title} />
                    <EditLink href={`/admin/education?edit=cert:${c.id}#certificates`} editing={editing} label={c.title} />
                  </div>
                  {editing ? (
                    <div className="px-5 pb-5">
                      <CertificateForm certificate={{ id: c.id, kind: c.kind, title: c.title, meta: c.meta }} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {certificates.length === 0 ? <p className="px-5 py-6 text-sm text-ink-3">No certificates yet.</p> : null}
        </Card>
      </div>
    </Page>
  );
}
