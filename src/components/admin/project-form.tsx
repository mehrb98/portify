"use client";

import { deleteProject, saveProject } from "@/lib/admin/actions/projects";
import { PROJECT_SIZES, PROJECT_STATUSES } from "@/lib/admin/constants";
import type { Option } from "@/lib/admin/types";
import { ConfirmDelete, FormMessage, RowsEditor, SubmitButton, useAdminForm } from "./form-kit";
import { CheckboxField, SelectField, TextArea, TextField } from "./ui";

export type ProjectInput = {
  id: string;
  name: string;
  kind: "WORK" | "SIDE";
  companyId: string;
  period: string;
  role: string;
  summary: string;
  focus: string;
  flow: string;
  tags: string;
  url: string;
  size: string;
  featured: boolean;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  details: { k: string; v: string }[];
};

const placeholderWarn = (v: string) => (/\[[^\]]+\]/.test(v) ? "Still a placeholder in [brackets]; the site shows it as written." : undefined);

export function ProjectForm({
  project,
  version,
  companies,
  tab,
  q,
}: {
  project: ProjectInput | null;
  version: number;
  companies: Option[];
  tab: string;
  q: string;
}) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveProject.bind(null, project?.id ?? null));
  const p = project;
  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <input type="hidden" name="_tab" value={tab} />
        <input type="hidden" name="_q" value={q} />
        <FormMessage state={state} />
        {/* Remounts with the saved values after each save. */}
        <div key={`${version}-${state.savedAt ?? 0}`} className="flex flex-col gap-4">
          <TextField id="name" label="Name" defaultValue={p?.name} required error={errors.name} warn={placeholderWarn(p?.name ?? "")} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              id="kind"
              label="Kind"
              defaultValue={p?.kind ?? "WORK"}
              options={[
                { value: "WORK", label: "Work project" },
                { value: "SIDE", label: "Side project" },
              ]}
              error={errors.kind}
            />
            <SelectField id="companyId" label="Company" defaultValue={p?.companyId ?? ""} options={[{ value: "", label: "No company" }, ...companies]} error={errors.companyId} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField id="period" label="Period" mono defaultValue={p?.period} placeholder="2025 to now" required error={errors.period} warn={placeholderWarn(p?.period ?? "")} />
            <TextField id="role" label="Role" defaultValue={p?.role} placeholder="Designed and built" error={errors.role} />
          </div>
          <TextArea id="summary" label="Summary" rows={4} defaultValue={p?.summary} required error={errors.summary} warn={placeholderWarn(p?.summary ?? "")} />
          <TextArea id="focus" label="Focus" rows={2} defaultValue={p?.focus} hint="Technical focus line on the large cards." error={errors.focus} />
          <TextArea id="flow" label="Flow" rows={3} mono defaultValue={p?.flow} hint="Side projects: the data flow in the dark box, one line per row." error={errors.flow} />
          <TextField id="tags" label="Tags" defaultValue={p?.tags} placeholder="NestJS, Stripe, PostgreSQL" hint="Comma separated." error={errors.tags} />
          <TextField id="url" label="Public link" type="url" mono defaultValue={p?.url} placeholder="https://" hint="Leave empty when the project is not public." error={errors.url} />
          <div className="grid grid-cols-2 gap-3">
            <SelectField id="size" label="Card size" defaultValue={p?.size ?? "compact"} options={PROJECT_SIZES} error={errors.size} />
            <SelectField id="status" label="Status" defaultValue={p?.status ?? "DRAFT"} options={PROJECT_STATUSES} error={errors.status} />
          </div>
          <CheckboxField id="featured" label="Featured on the site" defaultChecked={p?.featured ?? false} />
          <RowsEditor
            name="details"
            label="Case study rows"
            hint="featured project only"
            columns={[
              { key: "k", label: "Label", placeholder: "provider-agnostic" },
              { key: "v", label: "Text", wide: true },
            ]}
            initial={p?.details ?? []}
            what="case study row"
            error={errors.details}
          />
        </div>
        <div className="flex gap-2.5 border-t border-rule-2 pt-4">
          <SubmitButton pending={pending} className="flex-1">
            {p ? "Save project" : "Create project"}
          </SubmitButton>
        </div>
      </form>
      {p ? (
        <ConfirmDelete action={deleteProject.bind(null, p.id)} hidden={{ _tab: tab, _q: q }} label="Delete project" question={`Delete “${p.name}”?`} />
      ) : null}
    </div>
  );
}
