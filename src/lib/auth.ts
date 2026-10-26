import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, readSessionToken } from "./session";

/** Call at the top of every admin page and server action. */
export async function requireAdmin(): Promise<string> {
  const jar = await cookies();
  const email = await readSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!email) redirect("/admin/login");
  return email;
}
