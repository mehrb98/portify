"use client";

import { startTransition, useActionState, useId, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { initialFormState, type FormState } from "@/lib/admin/types";
import { IconDown, IconPlus, IconUp, IconX } from "./icons";
import { btn, cx, inputClass, Notice, textareaClass } from "./ui";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

/**
 * useActionState plus a submit handler that dispatches inside a transition. Dispatching ourselves
 * keeps React from resetting the fields when the server returns validation errors; without JS the
 * form still posts through `action`.
 */
export function useAdminForm(action: Action) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };
  return { state, formAction, onSubmit, pending, errors: state.errors ?? {} };
}

export function SubmitButton({
  children,
  pending,
  className,
  form,
  variant = "primary",
}: {
  children: ReactNode;
  pending?: boolean;
  className?: string;
  /** id of the form when the button sits outside it (e.g. in the top bar) */
  form?: string;
  variant?: keyof typeof btn;
}) {
  const status = useFormStatus();
  const busy = pending ?? status.pending;
  return (
    <button type="submit" form={form} disabled={busy} className={cx(btn[variant], className)}>
      {busy ? "Saving…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) return <Notice tone="error">{state.error}</Notice>;
  if (state.ok && state.message) return <Notice tone="ok">{state.message}</Notice>;
  return null;
}

/** Delete button with a confirm step. The action redirects on success or returns an error. */
/** A button that dims while its form's server action runs (move, toggle). */
export function PendingButton({ children, className, disabled, ...rest }: ComponentProps<"button">) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" {...rest} disabled={pending || disabled} className={cx(className, pending && "opacity-50")}>
      {children}
    </button>
  );
}

export function ConfirmDelete({
  action,
  label = "Delete",
  question = "Delete this for good?",
  hidden,
  className,
}: {
  action: Action;
  label?: string;
  question?: string;
  hidden?: Record<string, string>;
  className?: string;
}) {
  const [asking, setAsking] = useState(false);
  const [state, formAction, pending] = useActionState(action, initialFormState);
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {asking ? (
        <form action={formAction} className="flex flex-wrap items-center gap-2 rounded-[10px] border border-danger/30 bg-danger/5 p-2.5">
          {hidden ? Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />) : null}
          <span className="mr-auto text-[13px] font-medium text-danger">{question}</span>
          <button type="button" className={btn.secondary} onClick={() => setAsking(false)} disabled={pending}>
            Cancel
          </button>
          <button type="submit" className={btn.danger} disabled={pending} autoFocus>
            {pending ? "Deleting…" : `Yes, ${label.toLowerCase()}`}
          </button>
        </form>
      ) : (
        <button type="button" className={btn.dangerGhost} onClick={() => setAsking(true)}>
          {label}
        </button>
      )}
      {state.error ? <Notice tone="error">{state.error}</Notice> : null}
    </div>
  );
}

function MoveRemove({ i, n, onMove, onRemove, what }: { i: number; n: number; onMove: (i: number, d: -1 | 1) => void; onRemove: (i: number) => void; what: string }) {
  return (
    <div className="flex shrink-0 items-start gap-1">
      <button type="button" className={btn.small} onClick={() => onMove(i, -1)} disabled={i === 0} aria-label={`Move ${what} ${i + 1} up`}>
        <IconUp size={14} />
      </button>
      <button type="button" className={btn.small} onClick={() => onMove(i, 1)} disabled={i === n - 1} aria-label={`Move ${what} ${i + 1} down`}>
        <IconDown size={14} />
      </button>
      <button type="button" className={btn.small} onClick={() => onRemove(i)} aria-label={`Remove ${what} ${i + 1}`}>
        <IconX size={14} />
      </button>
    </div>
  );
}

function useList<T>(initial: T[]) {
  // Keys must match between the server render and hydration, so they start from the index.
  const [items, setItems] = useState(() => initial.map((value, i) => ({ key: `i${i}`, value })));
  const [seq, setSeq] = useState(initial.length);
  const move = (i: number, d: -1 | 1) =>
    setItems((xs) => {
      const j = i + d;
      if (j < 0 || j >= xs.length) return xs;
      const next = [...xs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (i: number) => setItems((xs) => xs.filter((_, k) => k !== i));
  const add = (value: T) => {
    setItems((xs) => [...xs, { key: `n${seq}`, value }]);
    setSeq(seq + 1);
  };
  const update = (i: number, value: T) => setItems((xs) => xs.map((x, k) => (k === i ? { ...x, value } : x)));
  return { items, move, remove, add, update };
}

/** An ordered list of texts (job highlights, about paragraphs). Posts each item as `name`. */
export function ListEditor({
  name,
  label,
  hint,
  initial,
  what = "item",
  addLabel = "Add",
  error,
  rows = 3,
}: {
  name: string;
  label: string;
  hint?: string;
  initial: string[];
  what?: string;
  addLabel?: string;
  error?: string[];
  rows?: number;
}) {
  const { items, move, remove, add, update } = useList(initial);
  const id = useId();
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" aria-describedby={error?.length ? `${id}-err` : undefined}>
      <legend className="mb-2 flex items-baseline gap-2.5">
        <span className="text-[13px] font-medium">{label}</span>
        {hint ? <span className="font-mono text-xs text-ink-3">{hint}</span> : null}
      </legend>
      {items.map((it, i) => (
        <div key={it.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2.5 rounded-[10px] border border-rule p-2.5">
          <label className="sr-only" htmlFor={`${id}-${it.key}`}>
            {`${what} ${i + 1}`}
          </label>
          <textarea
            id={`${id}-${it.key}`}
            name={name}
            rows={rows}
            value={it.value}
            onChange={(e) => update(i, e.target.value)}
            className={cx(textareaClass, "min-h-0 border-transparent px-1 py-0.5 text-[13.5px] text-ink-2 focus:border-signal")}
          />
          <MoveRemove i={i} n={items.length} onMove={move} onRemove={remove} what={what} />
        </div>
      ))}
      {items.length === 0 ? <p className="text-[13px] text-ink-3">Nothing here yet.</p> : null}
      <button type="button" className={cx(btn.link, "self-start")} onClick={() => add("")}>
        <IconPlus size={14} />
        {addLabel}
      </button>
      {error?.length ? (
        <span id={`${id}-err`} className="text-[12.5px] text-danger">
          {error[0]}
        </span>
      ) : null}
    </fieldset>
  );
}

/** Repeating rows of small fields, posted as `${name}.${key}` (e.g. facts.k, facts.v). */
export function RowsEditor<K extends string>({
  name,
  label,
  hint,
  columns,
  initial,
  what = "row",
  addLabel = "Add row",
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  columns: { key: K; label: string; wide?: boolean; placeholder?: string }[];
  initial: Record<K, string>[];
  what?: string;
  addLabel?: string;
  error?: string[];
}) {
  const { items, move, remove, add, update } = useList(initial);
  const id = useId();
  const empty = Object.fromEntries(columns.map((c) => [c.key, ""])) as Record<K, string>;
  const tpl = columns.map((c) => (c.wide ? "minmax(0,2fr)" : "minmax(0,1fr)")).join(" ");
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" aria-describedby={error?.length ? `${id}-err` : undefined}>
      <legend className="mb-2 flex items-baseline gap-2.5">
        <span className="text-[13px] font-medium">{label}</span>
        {hint ? <span className="font-mono text-xs text-ink-3">{hint}</span> : null}
      </legend>
      {items.length ? (
        <div className="hidden gap-2 pr-[104px] font-mono text-[11px] tracking-[0.04em] text-ink-3 uppercase sm:grid" style={{ gridTemplateColumns: tpl }} aria-hidden>
          {columns.map((c) => (
            <span key={c.key}>{c.label}</span>
          ))}
        </div>
      ) : null}
      {items.map((it, i) => (
        <div key={it.key} className="flex items-start gap-2">
          <div className="grid min-w-0 flex-1 gap-2" style={{ gridTemplateColumns: tpl }}>
            {columns.map((c) => (
              <input
                key={c.key}
                name={`${name}.${c.key}`}
                aria-label={`${c.label}, ${what} ${i + 1}`}
                value={it.value[c.key]}
                placeholder={c.placeholder}
                onChange={(e) => update(i, { ...it.value, [c.key]: e.target.value })}
                aria-invalid={error?.length && !it.value[c.key] && Object.values(it.value).some(Boolean) ? true : undefined}
                className={inputClass}
              />
            ))}
          </div>
          <div className="pt-1.5">
            <MoveRemove i={i} n={items.length} onMove={move} onRemove={remove} what={what} />
          </div>
        </div>
      ))}
      {items.length === 0 ? <p className="text-[13px] text-ink-3">No rows yet.</p> : null}
      <button type="button" className={cx(btn.link, "self-start")} onClick={() => add({ ...empty })}>
        <IconPlus size={14} />
        {addLabel}
      </button>
      {error?.length ? (
        <span id={`${id}-err`} className="text-[12.5px] text-danger">
          {error[0]}
        </span>
      ) : null}
    </fieldset>
  );
}
