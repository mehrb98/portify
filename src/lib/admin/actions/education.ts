"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { MILESTONE_PHASES } from "../constants";
import type { FormState } from "../types";
import { fieldErrors, invalid, reorder, required, revalidateContent, rows, str, type Dir, badId } from "../form";


const BACK = "/admin/education";

const year = (label: string) =>
  z.coerce.number({ error: `${label} must be a year.` }).int({ error: `${label} must be a year.` }).min(1950, { error: `${label} looks wrong.` }).max(2100, { error: `${label} looks wrong.` });

const educationSchema = z
  .object({
    kind: z.enum(["AUSBILDUNG", "DEGREE"], { error: "Pick a kind." }),
    title: required("Title", 160),
    school: required("School", 160),
    location: required("Location", 120),
    startYear: year("Start year"),
    endYear: z.union([z.literal("").transform(() => null), year("End year")]),
    state: required("State", 60),
    details: z.array(z.object({ k: z.string().max(80), v: z.string().max(400) })).max(12),
  })
  .refine((v) => v.endYear === null || v.endYear >= v.startYear, { path: ["endYear"], error: "End year can't be before the start year." });

export async function saveEducation(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };
  const details = rows(fd, "details", ["k", "v"] as const);
  const parsed = educationSchema.safeParse({
    kind: str(fd, "kind"),
    title: str(fd, "title"),
    school: str(fd, "school"),
    location: str(fd, "location"),
    startYear: str(fd, "startYear"),
    endYear: str(fd, "endYear"),
    state: str(fd, "state"),
    details: details.rows,
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (details.incomplete) return invalid({ details: ["Each detail row needs a label and a value."] });

  if (id) {
    if (!(await db.education.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This entry no longer exists." };
    await db.education.update({ where: { id }, data: parsed.data });
  } else {
    const last = await db.education.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
    await db.education.create({ data: { ...parsed.data, order: (last?.order ?? -1) + 1 } });
  }
  revalidateContent();
  redirect(BACK);
}

export async function deleteEducation(id: string): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  if (!(await db.education.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This entry no longer exists." };
  await db.education.delete({ where: { id } });
  revalidateContent();
  redirect(BACK);
}

export async function moveEducation(id: string, dir: Dir): Promise<void> {
  await requireAdmin();
  if (badId(id)) return;
  const list = await db.education.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  const updates = reorder(list, id, dir);
  if (!updates) return;
  await db.$transaction(updates.map((u) => db.education.update({ where: { id: u.id }, data: { order: u.order } })));
  revalidateContent();
}

const certificateSchema = z.object({
  kind: z.enum(["RECOGNITION", "COURSE"], { error: "Pick a kind." }),
  title: required("Title", 200),
  meta: required("Date or issuer", 80),
});

export async function saveCertificate(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };
  const parsed = certificateSchema.safeParse({ kind: str(fd, "kind"), title: str(fd, "title"), meta: str(fd, "meta") });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (id) {
    if (!(await db.certificate.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This certificate no longer exists." };
    await db.certificate.update({ where: { id }, data: parsed.data });
  } else {
    const last = await db.certificate.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
    await db.certificate.create({ data: { ...parsed.data, order: (last?.order ?? -1) + 1 } });
  }
  revalidateContent();
  redirect(BACK);
}

export async function deleteCertificate(id: string): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  if (!(await db.certificate.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This certificate no longer exists." };
  await db.certificate.delete({ where: { id } });
  revalidateContent();
  redirect(BACK);
}

export async function moveCertificate(id: string, dir: Dir): Promise<void> {
  await requireAdmin();
  if (badId(id)) return;
  const list = await db.certificate.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  const updates = reorder(list, id, dir);
  if (!updates) return;
  await db.$transaction(updates.map((u) => db.certificate.update({ where: { id: u.id }, data: { order: u.order } })));
  revalidateContent();
}

const milestoneSchema = z.object({
  phase: z.enum(MILESTONE_PHASES, { error: "Pick a phase." }),
  label: required("Label", 40),
  text: required("Text", 300),
});

export async function saveMilestone(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };
  const parsed = milestoneSchema.safeParse({ phase: str(fd, "phase"), label: str(fd, "label"), text: str(fd, "text") });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (id) {
    if (!(await db.milestone.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This milestone no longer exists." };
    await db.milestone.update({ where: { id }, data: parsed.data });
  } else {
    const last = await db.milestone.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
    await db.milestone.create({ data: { ...parsed.data, order: (last?.order ?? -1) + 1 } });
  }
  revalidateContent();
  redirect(BACK);
}

export async function deleteMilestone(id: string): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  if (!(await db.milestone.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This milestone no longer exists." };
  await db.milestone.delete({ where: { id } });
  revalidateContent();
  redirect(BACK);
}

export async function moveMilestone(id: string, dir: Dir): Promise<void> {
  await requireAdmin();
  if (badId(id)) return;
  const list = await db.milestone.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  const updates = reorder(list, id, dir);
  if (!updates) return;
  await db.$transaction(updates.map((u) => db.milestone.update({ where: { id: u.id }, data: { order: u.order } })));
  revalidateContent();
}
