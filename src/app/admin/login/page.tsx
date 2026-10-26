import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminEmail } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdminEmail()) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-4 py-12 text-ink">
      <div className="flex w-full max-w-[400px] flex-col gap-6 rounded-[14px] border border-rule bg-surface p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex size-[30px] items-center justify-center rounded-lg bg-ink font-mono text-xs font-medium text-surface">MB</span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Portfolio admin</span>
            <span className="font-mono text-[11px] text-ink-3">content manager</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-[-0.015em]">Sign in</h1>
          <p className="text-sm text-ink-2">Only the site owner can edit the content.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
