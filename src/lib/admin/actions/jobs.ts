"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { MONTH_RE } from "@/lib/months";
import type { FormState } from "../types";
import { bool, fieldErrors, invalid, reorder, required, revalidateContent, saved, str, strs, type Dir, badId } from "../form";

const month = (label: string) => z.string().trim().regex(MONTH_RE, { error: `${label} must be a month like 2025-08.` });

const schema = z
  .object({
    companyId: z.string().min(1, { error: "Pick a company." }),
    role: required("Role", 120),
    start: month("Start"),
    current: z.boolean(),
    end: z.string().trim(),
    bullets: z.array(z.string().max(1200, { error: "A highlight is too long (max 1200)." })).max(20, { error: "Use at most 20 highlights." }),
    technologyIds: z.array(z.string().min(1)).max(200),
  })
  .superRefine((v, ctx) => {
    if (v.current) return;
    if (!MONTH_RE.test(v.end)) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "End must be a month like 2025-08, or tick “I work here now”." });
    } else if (v.end < v.start) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "End can't be before the start." });
    }
  });

export async function saveJob(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };
  const parsed = schema.safeParse({
    companyId: str(fd, "companyId"),
    role: str(fd, "role"),
    start: str(fd, "start"),
    current: bool(fd, "current"),
    end: str(fd, "end"),
    bullets: strs(fd, "bullets").filter(Boolean),
    technologyIds: [...new Set(strs(fd, "technologyIds").filter(Boolean))],
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  const v = parsed.data;

  if (!(await db.company.findUnique({ where: { id: v.companyId }, select: { id: true } }))) {
    return invalid({ companyId: ["That company no longer exists. Pick another one."] });
  }
  // Only keep technology ids that really exist.
  const techs = await db.technology.findMany({ where: { id: { in: v.technologyIds } }, select: { id: true } });
  const technologyIds = techs.map((t) => t.id);

  const data = { companyId: v.companyId, role: v.role, start: v.start, end: v.current ? null : v.end, bullets: v.bullets };

  if (id) {
    if (!(await db.job.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This job no longer exists." };
    await db.$transaction([
      db.job.update({ where: { id }, data }),
      db.jobTechnology.deleteMany({ where: { jobId: id } }),
      db.jobTechnology.createMany({ data: technologyIds.map((technologyId) => ({ jobId: id, technologyId })) }),
    ]);
    revalidateContent();
    return saved();
  }

  const last = await db.job.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
  const job = await db.job.create({
    data: { ...data, order: (last?.order ?? -1) + 1, technologies: { create: technologyIds.map((technologyId) => ({ technologyId })) } },
  });
  revalidateContent();
  redirect(`/admin/jobs/${job.id}`);
}

export async function deleteJob(id: string): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  if (!(await db.job.findUnique({ where: { id }, select: { id: true } }))) return { ok: false, error: "This job no longer exists." };
  await db.job.delete({ where: { id } });
  revalidateContent();
  redirect("/admin/jobs");
}

export async function moveJob(id: string, dir: Dir): Promise<void> {
  await requireAdmin();
  if (badId(id)) return;
  const list = await db.job.findMany({ orderBy: [{ order: "asc" }, { start: "desc" }], select: { id: true } });
  const updates = reorder(list, id, dir);
  if (!updates) return;
  await db.$transaction(updates.map((u) => db.job.update({ where: { id: u.id }, data: { order: u.order } })));
  revalidateContent();
}
