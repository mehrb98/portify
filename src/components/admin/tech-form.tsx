"use client";

import { deleteTechnology, saveTechnology } from "@/lib/admin/actions/technologies";
import { ConfirmDelete, FormMessage, SubmitButton, useAdminForm } from "./form-kit";
import { CheckboxField, SelectField, TextField } from "./ui";

export type TechInput = {
  id: string;
  name: string;
  category: string;
  toolkitGroup: string;
  showOnTimeline: boolean;
  order: number;
  jobCount: number;
  period: string | null;
};

export function TechForm({
  tech,
  version,
  categories,
  toolkitGroups,
  cat,
  nextOrder,
}: {
  tech: TechInput | null;
  version: string;
  categories: string[];
  toolkitGroups: string[];
  cat: string;
  nextOrder: number;
}) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveTechnology.bind(null, tech?.id ?? null));
  const t = tech;
  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <input type="hidden" name="_cat" value={cat} />
        <FormMessage state={state} />
        <div key={`${version}-${state.savedAt ?? 0}`} className="flex flex-col gap-4">
          <TextField id="name" label="Name" defaultValue={t?.name} required error={errors.name} />
          <SelectField id="category" label="Category" defaultValue={t?.category ?? (cat || categories[0])} options={categories.map((c) => ({ value: c, label: c }))} error={errors.category} hint="The timeline group it appears in." />
          <SelectField
            id="toolkitGroup"
            label="Toolkit column"
            defaultValue={t?.toolkitGroup ?? ""}
            options={[{ value: "", label: "None" }, ...toolkitGroups.map((g) => ({ value: g, label: g }))]}
            error={errors.toolkitGroup}
            hint="For technologies without a dated role."
          />
          <CheckboxField id="showOnTimeline" label="Show on the stack timeline" defaultChecked={t?.showOnTimeline ?? true} />
          <TextField id="order" label="Order" type="number" min={0} mono defaultValue={t?.order ?? nextOrder} error={errors.order} className="max-w-32" />
          {t ? (
            <div className="flex flex-col gap-1 rounded-[10px] bg-paper px-3 py-2.5">
              <span className="font-mono text-xs text-ink-3">Period (from jobs)</span>
              <span className="font-mono text-[13px]">{t.period ?? "[period]"}</span>
              <span className="text-[12.5px] text-ink-3">
                Used by {t.jobCount} job{t.jobCount === 1 ? "" : "s"}.
              </span>
            </div>
          ) : null}
        </div>
        <SubmitButton pending={pending}>{t ? "Save technology" : "Add technology"}</SubmitButton>
      </form>
      {t ? (
        <ConfirmDelete
          action={deleteTechnology.bind(null, t.id)}
          hidden={{ _cat: cat }}
          label="Delete technology"
          question={t.jobCount ? `Delete ${t.name}? It is removed from ${t.jobCount} job${t.jobCount === 1 ? "" : "s"}.` : `Delete ${t.name}?`}
        />
      ) : null}
    </div>
  );
}
