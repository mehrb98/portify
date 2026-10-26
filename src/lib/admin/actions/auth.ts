"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { z } from "zod";
import { auth } from "@/lib/better-auth";
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
  const admin = process.env.ADMIN_EMAIL;
  if (!admin) return { error: "Sign in is not configured on this server.", email };

  // Only the owner's account may sign in here, even if other users exist in the table.
  if (!parsed.success || !parsed.data.password || email.toLowerCase() !== admin.toLowerCase()) {
    await sleep(600 + Math.floor(Math.random() * 400));
    return { error: GENERIC, email };
  }

  try {
    await auth.api.signInEmail({ body: { email, password: parsed.data.password }, headers: await headers() });
  } catch (e) {
    await sleep(600 + Math.floor(Math.random() * 400));
    if (e instanceof APIError && e.status === "TOO_MANY_REQUESTS") return { error: "Too many attempts. Try again in a minute.", email };
    return { error: GENERIC, email };
  }
  redirect("/admin");
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/login");
}
