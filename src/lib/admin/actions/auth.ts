"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/session";
import { sleep } from "../form";

export type LoginState = { error?: string; email?: string };

const schema = z.object({
  email: z.string().trim().max(200),
  password: z.string().max(500),
});

const GENERIC = "Email or password is incorrect.";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = schema.safeParse({ email: formData.get("email") ?? "", password: formData.get("password") ?? "" });
  const email = parsed.success ? parsed.data.email : "";
  const adminEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash) return { error: "Sign in is not configured on this server.", email };

  // Always run the password check so a wrong email takes as long as a wrong password.
  const passwordOk = parsed.success && parsed.data.password !== "" ? await verifyPassword(parsed.data.password, hash) : false;
  const emailOk = email.toLowerCase() === adminEmail.toLowerCase();

  if (!passwordOk || !emailOk) {
    await sleep(600 + Math.floor(Math.random() * 400));
    return { error: GENERIC, email };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(adminEmail), sessionCookieOptions);
  redirect("/admin");
}

export async function logout() {
  await requireAdmin();
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
