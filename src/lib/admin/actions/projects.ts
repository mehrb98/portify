"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { PROJECT_SIZES } from "../constants";
import type { FormState } from "../types";
import { bool, fieldErrors, httpUrl, invalid, optional, reorder, required, revalidateContent, rows, saved, splitList, str, type Dir, badId } from "../form";

const SIZES = PROJECT_SIZES.map((s) => s.value) as [string, ...string[]];

const schema = z.object({
  name: required("Name", 200),
  kind: z.enum(["WORK", "SIDE"], { error: "Pick work or side project." }),
  companyId: z.string().transform((v) => (v === "" ? null : v)),
  period: required("Period", 60),
  role: optional("Role", 120),
  summary: required("Summary", 1500),
  focus: optional("Focus", 600),
  flow: optional("Flow", 1000),
  tags: z.array(z.string().max(60, { error: "A tag is too long (max 60)." })).max(30, { error: "Use at most 30 tags." }),
  url: httpUrl("Link").transform((v) => (v === "" ? null : v)),
  size: z.enum(SIZES, { error: "Pick a card size." }),
  featured: z.boolean(),
  status: z.enum(["PUBLISHED", "DRAFT", "HIDDEN"], { error: "Pick a status." }),
  details: z.array(z.object({ k: z.string().max(80), v: z.string().max(600) })).max(12),
});

function back(params: { id?: string; tab?: string; q?: string }) {
  const sp = new URLSearchParams();
  if (params.tab) sp.set("tab", params.tab);
  if (params.q) sp.set("q", params.q);
  if (params.id) sp.set("id", params.id);
  const s = sp.toString();
  return `/admin/projects${s ? `?${s}` : ""}`;
}

/** Create (id null) or update a project. */
export async function saveProject(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (id !== null && badId(id)) return { ok: false, error: "Unknown item." };

  const details = rows(fd, "details", ["k", "v"] as const);
  const parsed = schema.safeParse({
    name: str(fd, "name"),
    kind: str(fd, "kind"),
    companyId: str(fd, "companyId"),
    period: str(fd, "period"),
    role: str(fd, "role"),
    summary: str(fd, "summary"),
    focus: str(fd, "focus"),
    flow: fd.get("flow") == null ? "" : String(fd.get("flow")).replace(/\r\n/g, "\n").trim(),
    tags: splitList(str(fd, "tags")),
    url: str(fd, "url"),
    size: str(fd, "size"),
    featured: bool(fd, "featured"),
    status: str(fd, "status"),
    details: details.rows,
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  if (details.incomplete) return invalid({ details: ["Each case study row needs a label and a text."] });
  const data = parsed.data;

  if (data.companyId && !(await db.company.findUnique({ where: { id: data.companyId }, select: { id: true } }))) {
    return invalid({ companyId: ["That company no longer exists. Pick another one."] });
  }

  const tab = str(fd, "_tab") || undefined;
  const q = str(fd, "_q") || undefined;
  const fields = { ...data, details: data.details.length ? data.details : Prisma.DbNull };

  if (id) {
    const existing = await db.project.findUnique({ where: { id }, select: { kind: true } });
    if (!existing) return { ok: false, error: "This project no longer exists." };
    let order: number | undefined;
    if (existing.kind !== data.kind) order = await nextOrder(data.kind);
    await db.project.update({
      where: { id },
      data: { ...fields, ...(order !== undefined ? { order } : {}) },
    });
    revalidateContent();
    return saved();
  }

  const created = await db.project.create({ data: { ...fields, order: await nextOrder(data.kind) } });
  revalidateContent();
  redirect(back({ id: created.id, tab, q }));
}

async function nextOrder(kind: "WORK" | "SIDE") {
  const last = await db.project.findFirst({ where: { kind }, orderBy: { order: "desc" }, select: { order: true } });
  return (last?.order ?? -1) + 1;
}

export async function deleteProject(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  if (badId(id)) return { ok: false, error: "Unknown item." };
  const existing = await db.project.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { ok: false, error: "This project no longer exists." };
  await db.project.delete({ where: { id } });
  revalidateContent();
  redirect(back({ tab: str(fd, "_tab") || undefined, q: str(fd, "_q") || undefined }));
}

/** Moves a project one place up or down among projects of the same kind. */
export async function moveProject(id: string, dir: Dir): Promise<void> {
  await requireAdmin();
  if (badId(id)) return;
  const p = await db.project.findUnique({ where: { id }, select: { kind: true } });
  if (!p) return;
  const list = await db.project.findMany({ where: { kind: p.kind }, orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true } });
  const updates = reorder(list, id, dir);
  if (!updates) return;
  await db.$transaction(updates.map((u) => db.project.update({ where: { id: u.id }, data: { order: u.order } })));
  revalidateContent();
}
