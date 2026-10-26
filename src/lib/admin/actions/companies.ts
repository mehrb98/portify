"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import type { FormState } from "../types";
import { fieldErrors, invalid, optional, required, revalidateContent, str, badId } from "../form";

const schema = z.object({
  name: required("Name", 120),
  shortName: required("Short name", 60),
  city: optional("City", 80),
  order: z.coerce.number({ error: "Order must be a number." }).int({ error: "Order must be a whole number." }).min(0).max(9999),
});

export async function saveCompany(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };
  const parsed = schema.safeParse({
    name: str(fd, "name"),
    shortName: str(fd, "shortName"),
    city: str(fd, "city"),
    order: str(fd, "order") || "0",
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));

  if (id) {
    if (!(await db.company.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This company no longer exists." };
    await db.company.update({ where: { id }, data: parsed.data });
    revalidateContent();
    redirect("/admin/companies");
  }
  await db.company.create({ data: parsed.data });
  revalidateContent();
  redirect("/admin/companies");
}

export async function deleteCompany(id: string): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  const c = await db.company.findUnique({ where: { id }, include: { _count: { select: { jobs: true } } } });
  if (!c) return { ok: false, error: "This company no longer exists." };
  if (c._count.jobs > 0) {
    const n = c._count.jobs;
    return {
      ok: false,
      error: `${c.name} can't be deleted while ${n} job${n > 1 ? "s" : ""} use${n > 1 ? "" : "s"} it. Move those jobs to another company or delete them first.`,
    };
  }
  await db.company.delete({ where: { id } }); // projects keep existing without a company
  revalidateContent();
  redirect("/admin/companies");
}
