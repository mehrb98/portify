"use client";

import Link from "next/link";
import { deleteCompany, saveCompany } from "@/lib/admin/actions/companies";
import { ConfirmDelete, FormMessage, SubmitButton, useAdminForm } from "./form-kit";
import { TextField, btn } from "./ui";

export type CompanyInput = { id: string; name: string; shortName: string; city: string; order: number; jobs: number; projects: number };

export function CompanyForm({ company, nextOrder }: { company: CompanyInput | null; nextOrder: number }) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveCompany.bind(null, company?.id ?? null));
  const c = company;
  const prefix = c ? `co-${c.id}` : "co-new";
  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col gap-3" aria-label={c ? `Edit ${c.name}` : "New company"}>
        <FormMessage state={state} />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField id={`${prefix}-name`} name="name" label="Name" defaultValue={c?.name} placeholder="W&S Digital GmbH" required error={errors.name} />
          <TextField id={`${prefix}-short`} name="shortName" label="Short name" defaultValue={c?.shortName} placeholder="W&S Digital" required error={errors.shortName} hint="Used in tight spots like the timeline." />
          <TextField
            id={`${prefix}-city`}
            name="city"
            label="City"
            defaultValue={c?.city}
            placeholder="Stuttgart"
            error={errors.city}
            warn={c && !c.city ? "No city yet. It is listed under Needs your input until you add one." : undefined}
          />
          <TextField id={`${prefix}-order`} name="order" label="Order" type="number" min={0} mono defaultValue={c?.order ?? nextOrder} error={errors.order} />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <SubmitButton pending={pending}>{c ? "Save company" : "Add company"}</SubmitButton>
          <Link href="/admin/companies" className={btn.secondary}>
            Cancel
          </Link>
        </div>
      </form>
      {c ? (
        <ConfirmDelete
          action={deleteCompany.bind(null, c.id)}
          label="Delete company"
          question={c.projects ? `Delete ${c.name}? Its ${c.projects} project${c.projects === 1 ? "" : "s"} stay, without a company.` : `Delete ${c.name}?`}
          className="items-start"
        />
      ) : null}
    </div>
  );
}
