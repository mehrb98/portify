// Shapes shared by admin server actions and the client forms that call them.

export type FieldErrors = Record<string, string[] | undefined>;

/** What every admin form action returns to useActionState. */
export type FormState = {
  ok?: boolean;
  /** Success note, e.g. "Saved." */
  message?: string;
  /** Form-level error, e.g. a record that no longer exists. */
  error?: string;
  errors?: FieldErrors;
  /** Bumped on every successful save so the form can remount with fresh values. */
  savedAt?: number;
};

export const initialFormState: FormState = {};

export type Option = { value: string; label: string };
