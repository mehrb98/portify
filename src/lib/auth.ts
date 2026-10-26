import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./better-auth";

/** The signed-in admin's email, or null. Only ADMIN_EMAIL counts as an admin. */
export async function getAdminEmail(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user.email;
  const admin = process.env.ADMIN_EMAIL;
  return email && admin && email.toLowerCase() === admin.toLowerCase() ? email : null;
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin(): Promise<string> {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  return email;
}
