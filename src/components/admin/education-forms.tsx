"use client";

import Link from "next/link";
import {
  deleteCertificate,
  deleteEducation,
  deleteMilestone,
  saveCertificate,
  saveEducation,
  saveMilestone,
} from "@/lib/admin/actions/education";
import { CERTIFICATE_KINDS, EDUCATION_KINDS, MILESTONE_PHASES } from "@/lib/admin/constants";
import { ConfirmDelete, FormMessage, RowsEditor, SubmitButton, useAdminForm } from "./form-kit";
import { SelectField, TextArea, TextField, btn } from "./ui";

function Buttons({ pending, editing }: { pending: boolean; editing: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <SubmitButton pending={pending}>{editing ? "Save" : "Add"}</SubmitButton>
      <Link href="/admin/education" scroll={false} className={btn.secondary}>
        Cancel
      </Link>
    </div>
  );
}

const warnIfPlaceholder = (v: string) => (/\[[^\]]+\]/.test(v) ? "Still a placeholder." : undefined);

export type EducationInput = {
  id: string;
  kind: "AUSBILDUNG" | "DEGREE";
  title: string;
  school: string;
  location: string;
  startYear: string;
  endYear: string;
  state: string;
  details: { k: string; v: string }[];
};

export function EducationForm({ entry }: { entry: EducationInput | null }) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveEducation.bind(null, entry?.id ?? null));
  const e = entry;
  const p = e ? `edu-${e.id}` : "edu-new";
  const placeholders = e?.details.filter((d) => /\[[^\]]+\]/.test(d.v)).map((d) => d.k) ?? [];
  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col gap-3" aria-label={e ? `Edit ${e.title}` : "New education entry"}>
        <FormMessage state={state} />
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField id={`${p}-kind`} name="kind" label="Kind" defaultValue={e?.kind ?? "DEGREE"} options={EDUCATION_KINDS} error={errors.kind} />
          <TextField id={`${p}-title`} name="title" label="Title" defaultValue={e?.title} required error={errors.title} />
          <TextField id={`${p}-school`} name="school" label="School" defaultValue={e?.school} required error={errors.school} />
          <TextField id={`${p}-location`} name="location" label="Location" defaultValue={e?.location} placeholder="Stuttgart, Germany" required error={errors.location} />
          <div className="grid grid-cols-2 gap-3">
            <TextField id={`${p}-start`} name="startYear" label="Start year" inputMode="numeric" mono defaultValue={e?.startYear} placeholder="2022" required error={errors.startYear} />
            <TextField id={`${p}-end`} name="endYear" label="End year" inputMode="numeric" mono defaultValue={e?.endYear} placeholder="empty = now" error={errors.endYear} />
          </div>
          <TextField id={`${p}-state`} name="state" label="State" defaultValue={e?.state ?? "Completed"} list="edu-states" required error={errors.state} />
          <datalist id="edu-states">
            <option value="Completed" />
            <option value="In progress" />
          </datalist>
        </div>
        <RowsEditor
          name="details"
          label="Details"
          hint="a value in [brackets] is a placeholder"
          columns={[
            { key: "k", label: "Label", placeholder: "Fachrichtung" },
            { key: "v", label: "Value", wide: true },
          ]}
          initial={e?.details ?? []}
          what="detail"
          error={errors.details}
        />
        {placeholders.length ? <p className="text-[12.5px] text-warn">Still placeholders: {placeholders.join(", ")}. Replace the [bracketed] text with the real value or remove the row.</p> : null}
        <Buttons pending={pending} editing={!!e} />
      </form>
      {e ? <ConfirmDelete action={deleteEducation.bind(null, e.id)} label="Delete entry" question={`Delete ${e.title}?`} className="items-start" /> : null}
    </div>
  );
}

export type CertificateInput = { id: string; kind: "RECOGNITION" | "COURSE"; title: string; meta: string };

export function CertificateForm({ certificate }: { certificate: CertificateInput | null }) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveCertificate.bind(null, certificate?.id ?? null));
  const c = certificate;
  const p = c ? `cert-${c.id}` : "cert-new";
  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col gap-3" aria-label={c ? `Edit ${c.title}` : "New certificate"}>
        <FormMessage state={state} />
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <SelectField id={`${p}-kind`} name="kind" label="Kind" defaultValue={c?.kind ?? "COURSE"} options={CERTIFICATE_KINDS} error={errors.kind} />
          <TextField id={`${p}-title`} name="title" label="Title" defaultValue={c?.title} required error={errors.title} warn={warnIfPlaceholder(c?.title ?? "")} />
        </div>
        <TextField id={`${p}-meta`} name="meta" label="Date or issuer" defaultValue={c?.meta} placeholder="07/2026 or Udemy" required error={errors.meta} className="max-w-xs" />
        <Buttons pending={pending} editing={!!c} />
      </form>
      {c ? <ConfirmDelete action={deleteCertificate.bind(null, c.id)} label="Delete certificate" question={`Delete “${c.title}”?`} className="items-start" /> : null}
    </div>
  );
}

export type MilestoneInput = { id: string; phase: string; label: string; text: string };

export function MilestoneForm({ milestone }: { milestone: MilestoneInput | null }) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveMilestone.bind(null, milestone?.id ?? null));
  const m = milestone;
  const p = m ? `ms-${m.id}` : "ms-new";
  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col gap-3" aria-label={m ? `Edit milestone ${m.label}` : "New milestone"}>
        <FormMessage state={state} />
        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <SelectField id={`${p}-phase`} name="phase" label="Phase" defaultValue={m?.phase ?? MILESTONE_PHASES[0]} options={MILESTONE_PHASES.map((x) => ({ value: x, label: x }))} error={errors.phase} />
          <TextField id={`${p}-label`} name="label" label="Label" mono defaultValue={m?.label} placeholder="09/2022" required error={errors.label} />
        </div>
        <TextArea id={`${p}-text`} name="text" label="Text" rows={2} defaultValue={m?.text} required error={errors.text} />
        <Buttons pending={pending} editing={!!m} />
      </form>
      {m ? <ConfirmDelete action={deleteMilestone.bind(null, m.id)} label="Delete milestone" question={`Delete the milestone “${m.label}”?`} className="items-start" /> : null}
    </div>
  );
}
