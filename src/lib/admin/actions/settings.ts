"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { SECTION_KEYS, type SectionKey } from "@/lib/content";
import { db } from "@/lib/db";
import type { FormState } from "../types";
import { fieldErrors, httpUrl, invalid, linkOrPath, required, revalidateContent, rows, saved, splitList, str, strs } from "../form";

const kv = z.array(z.object({ k: z.string().max(80), v: z.string().max(300) })).max(12);

const schema = z.object({
  name: required("Name", 120),
  headline: required("Headline", 160),
  status: required("Status badge", 80),
  location: required("Location", 120),
  pitch: required("Pitch", 1200),
  email: z.string().trim().pipe(z.email({ error: "Enter a valid email address." })),
  github: httpUrl("GitHub URL"),
  linkedin: httpUrl("LinkedIn URL"),
  cvUrl: linkOrPath("CV URL"),
  photoUrl: linkOrPath("Photo URL"),
  facts: kv,
  coreStack: z.array(z.string().max(60)).max(30, { error: "Use at most 30 items." }),
  metrics: z.array(z.object({ n: z.string().max(60), l: z.string().max(200) })).max(8, { error: "Use at most 8 metrics." }),
  aboutTitle: required("About title", 200),
  about: z.array(z.string().max(2000, { error: "A paragraph is too long (max 2000)." })).max(10, { error: "Use at most 10 paragraphs." }),
  strengths: z.array(z.object({ t: z.string().max(100), d: z.string().max(400) })).max(10, { error: "Use at most 10 items." }),
});

export async function saveProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const facts = rows(fd, "facts", ["k", "v"] as const);
  const metrics = rows(fd, "metrics", ["n", "l"] as const);
  const strengths = rows(fd, "strengths", ["t", "d"] as const);
  const parsed = schema.safeParse({
    name: str(fd, "name"),
    headline: str(fd, "headline"),
    status: str(fd, "status"),
    location: str(fd, "location"),
    pitch: str(fd, "pitch"),
    email: str(fd, "email"),
    github: str(fd, "github"),
    linkedin: str(fd, "linkedin"),
    cvUrl: str(fd, "cvUrl"),
    photoUrl: str(fd, "photoUrl"),
    facts: facts.rows,
    coreStack: splitList(str(fd, "coreStack")),
    metrics: metrics.rows,
    aboutTitle: str(fd, "aboutTitle"),
    about: strs(fd, "about").filter(Boolean),
    strengths: strengths.rows,
  });
  if (!parsed.success) return invalid(fieldErrors(parsed.error));
  const errors: Record<string, string[]> = {};
  if (facts.incomplete) errors.facts = ["Each row needs a label and a value."];
  if (metrics.incomplete) errors.metrics = ["Each metric needs a number and a label."];
  if (strengths.incomplete) errors.strengths = ["Each item needs a title and a description."];
  if (Object.keys(errors).length) return invalid(errors);

  await db.profile.update({ where: { id: 1 }, data: parsed.data });
  revalidateContent();
  return saved("Profile saved.");
}

/** Flips one site section on or off. */
export async function toggleSection(key: string): Promise<void> {
  await requireAdmin();
  if (!(SECTION_KEYS as readonly string[]).includes(key)) return;
  const p = await db.profile.findUnique({ where: { id: 1 }, select: { sections: true } });
  if (!p) return;
  const current = { ...Object.fromEntries(SECTION_KEYS.map((k) => [k, true])), ...(p.sections as Partial<Record<SectionKey, boolean>>) };
  current[key as SectionKey] = !current[key as SectionKey];
  await db.profile.update({ where: { id: 1 }, data: { sections: current } });
  revalidateContent();
}
