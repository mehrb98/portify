// Small server-rendered controls that post straight to a bound server action.
import type { ReactNode } from "react";
import { PendingButton } from "./form-kit";
import { IconDown, IconUp } from "./icons";
import { SwitchVisual, btn, cx } from "./ui";

type VoidAction = () => Promise<void>;

export function MoveButtons({ up, down, first, last, label }: { up: VoidAction; down: VoidAction; first: boolean; last: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <form action={up}>
        <PendingButton className={btn.small} disabled={first} aria-label={`Move ${label} up`} title="Move up">
          <IconUp size={14} />
        </PendingButton>
      </form>
      <form action={down}>
        <PendingButton className={btn.small} disabled={last} aria-label={`Move ${label} down`} title="Move down">
          <IconDown size={14} />
        </PendingButton>
      </form>
    </div>
  );
}

/** A switch (role="switch") that flips a boolean through a server action. */
export function SwitchForm({ action, on, label, children, className }: { action: VoidAction; on: boolean; label: string; children?: ReactNode; className?: string }) {
  return (
    <form action={action} className={cx("flex", className)}>
      <PendingButton role="switch" aria-checked={on} aria-label={label} className="flex w-full cursor-pointer items-center gap-3 rounded-md text-left">
        {children}
        <SwitchVisual on={on} />
      </PendingButton>
    </form>
  );
}
