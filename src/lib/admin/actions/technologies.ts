"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { TECH_CATEGORIES, TOOLKIT_GROUPS } from "@/lib/content";
import { db } from "@/lib/db";
import type { FormState } from "../types";
import { bool, fieldErrors, invalid, required, revalidateContent, saved, str, badId } from "../form";

const schema = z.object({
  name: required("Name", 80),
  category: z.string().refine((v) => TECH_CATEGORIES.includes(v), { error: "Pick a category." }),
  toolkitGroup: z
    .string()
    .refine((v) => v === "" || TOOLKIT_GROUPS.includes(v), { error: "Pick a toolkit column or none." })
    .transform((v) => (v === "" ? null : v)),
  showOnTimeline: z.boolean(),
  order: z.coerce.number({ error: "Order must be a number." }).int({ error: "Order must be a whole number." }).min(0).max(9999),
});

function back(fd: FormData, id?: string) {
  const sp = new URLSearchParams();
  const cat = str(fd, "_cat");
  if (cat) sp.set("cat", cat);
  if (id) sp.set("id", id);
  const s = sp.toString();
  return `/admin/technologies${s ? `?${s}` : ""}`;
}

export async function saveTechnology(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };
  const parsed = schema.safeParse({
    name: str(fd, "name"),
    category: str(fd, "category"),
    toolkitGroup: str(fd, "toolkitGroup"),
    showOnTimeline: bool(fd, "showOnTimeline"),
    order: str(fd, "order") || "0",
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  const data = parsed.data;

  const clash = await db.technology.findFirst({
    where: { name: { equals: data.name, mode: "insensitive" }, ...(id ? { NOT: { id } } : {}) },
    select: { name: true },
  });
  if (clash) return invalid({ name: [`“${clash.name}” already exists.`] });

  if (id) {
    if (!(await db.technology.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This technology no longer exists." };
    await db.technology.update({ where: { id }, data });
    revalidateContent();
    return saved();
  }
  const created = await db.technology.create({ data });
  revalidateContent();
  redirect(back(fd, created.id));
}

export async function deleteTechnology(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  if (!(await db.technology.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This technology no longer exists." };
  await db.technology.delete({ where: { id } }); // JobTechnology rows cascade
  revalidateContent();
  redirect(back(fd));
}

export async function toggleTimeline(id: string): Promise<void> {
  await requireAdmin();
  if (badId(id)) return;
  const t = await db.technology.findUnique({ where: { id }, select: { showOnTimeline: true } });
  if (!t) return;
  await db.technology.update({ where: { id }, data: { showOnTimeline: !t.showOnTimeline } });
  revalidateContent();
}
