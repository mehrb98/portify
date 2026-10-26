import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { FieldErrors, FormState } from "./types";

/** A form field as a trimmed string ("" when missing). */
export function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** All values of a repeated field, trimmed. */
export function strs(fd: FormData, key: string): string[] {
  return fd.getAll(key).map((v) => (typeof v === "string" ? v.trim() : ""));
}

export function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

/** "a, b ,c" -> ["a", "b", "c"], without empty items or duplicates. */
export function splitList(s: string): string[] {
  return [...new Set(s.split(",").map((x) => x.trim()).filter(Boolean))];
}

/**
 * Zips repeated inputs named `${name}.${key}` into rows, dropping rows where every field is empty.
 * Returns the rows and whether any row is only half filled.
 */
export function rows<K extends string>(fd: FormData, name: string, keys: readonly K[]) {
  const cols = keys.map((k) => strs(fd, `${name}.${k}`));
  const len = Math.max(0, ...cols.map((c) => c.length));
  const out: Record<K, string>[] = [];
  let incomplete = false;
  for (let i = 0; i < len; i++) {
    const row = Object.fromEntries(keys.map((k, j) => [k, cols[j][i] ?? ""])) as Record<K, string>;
    const filled = keys.filter((k) => row[k] !== "").length;
    if (filled === 0) continue;
    if (filled < keys.length) incomplete = true;
    out.push(row);
  }
  return { rows: out, incomplete };
}

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export function invalid(errors: FieldErrors, error = "Please fix the highlighted fields."): FormState {
  return { ok: false, error, errors };
}

export function saved(message = "Saved."): FormState {
  return { ok: true, message, savedAt: Date.now() };
}

/** Refresh the public page and every admin page (the sidebar counts live in the admin layout). */
export function revalidateContent() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

// Reusable zod pieces. Messages are written for the person filling the form.
export const required = (label: string, max = 300) =>
  z.string().trim().min(1, { error: `${label} is required.` }).max(max, { error: `${label} is too long (max ${max}).` });

export const optional = (label: string, max = 2000) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label} is too long (max ${max}).` })
    .transform((v) => (v === "" ? null : v));

/** Empty, an http(s) URL, or a site path like /cv/file.pdf. */
export const linkOrPath = (label: string) =>
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\/[^\s]+$/.test(v), {
      error: `${label} must be a full URL (https://...) or a path starting with /.`,
    });

export const httpUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\/[^\s]+$/.test(v), { error: `${label} must start with https:// or http://.` });

export type Dir = "up" | "down";

/**
 * Moves one item up or down in an ordered list and returns the new order value for every item.
 * Orders are renumbered 0..n-1, which also repairs duplicates.
 */
export function reorder<T extends { id: string }>(list: T[], id: string, dir: Dir): { id: string; order: number }[] | null {
  const i = list.findIndex((x) => x.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return null;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next.map((x, order) => ({ id: x.id, order }));
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Ids arrive from the client through bound actions: reject anything that is not a plausible id string. */
export function badId(id: unknown): boolean {
  return typeof id !== "string" || id.length === 0 || id.length > 64;
}
