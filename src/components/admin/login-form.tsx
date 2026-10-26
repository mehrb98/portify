"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/admin/actions/auth";
import { Notice, TextField, btn } from "./ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
      <TextField id="email" label="Email" type="email" autoComplete="username" required defaultValue={state.email} aria-invalid={state.error ? true : undefined} />
      <TextField id="password" label="Password" type="password" autoComplete="current-password" required aria-invalid={state.error ? true : undefined} />
      <button type="submit" className={`${btn.primary} h-10 w-full`} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
