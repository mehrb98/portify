import { ArrowDownIcon } from "./icons";

// Static architecture figure of the Elferplatz billing service, copied from Projects.dc.html.
// The figure is always dark, in both themes.

const box = "rounded-[10px] border border-[#33373f]";
const label = "font-mono text-[11px] text-[#8d929b]";

function Down() {
  return (
    <div className="flex h-9 items-center justify-center text-[#6b7079]" aria-hidden="true">
      <ArrowDownIcon size={16} />
    </div>
  );
}

export function ElferplatzFigure() {
  return (
    <figure aria-label="Billing service architecture" className="flex flex-col bg-[#111317] p-6 text-[#ededea] md:p-10 dark:border-rule dark:bg-surface max-lg:dark:border-t lg:dark:border-l">
      <figcaption className="font-mono text-xs text-[#8d929b]">architecture</figcaption>
      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {[
          ["Web checkout", "Stripe"],
          ["iOS app", "StoreKit"],
          ["Admin team", "plans, packages"],
        ].map(([t, s]) => (
          <div key={t} className={`${box} flex flex-col gap-1 px-3.5 py-3`}>
            <span className="text-sm font-medium">{t}</span>
            <span className={label}>{s}</span>
          </div>
        ))}
      </div>
      <Down />
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-[#8aa8ff] px-4 py-3.5">
        <span className="text-sm font-medium">Payment provider strategy</span>
        <span className="font-mono text-[11px] text-[#8aa8ff]">one interface, many providers</span>
      </div>
      <Down />
      <div className={`${box} flex flex-col gap-3 bg-[#181a1f] p-4`}>
        <div className="flex justify-between gap-2">
          <span className="text-sm font-medium">Billing service</span>
          <span className={label}>microservice</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {["Subscriptions (ERPNext model)", "Credit packages", "Two-stage approval, Stripe sync"].map((t) => (
            <span key={t} className="rounded-md bg-[#22252b] px-2.5 py-2 font-mono text-[11px] leading-[1.4]">
              {t}
            </span>
          ))}
        </div>
      </div>
      <Down />
      <div className={`${box} flex flex-col gap-2.5 px-4 py-3.5`}>
        <div className="flex flex-wrap justify-between gap-2">
          <span className="text-sm font-medium">Append-only credit ledger</span>
          <span className={label}>balance = sum of entries</span>
        </div>
        <span className="font-mono text-[10px] text-[#8d929b]">illustrative entries</span>
        <div className="flex flex-col gap-1 font-mono text-[11px] whitespace-pre text-[#b6bac1]">
          <span>+ 500  package purchased</span>
          <span>− 120  configuration export</span>
          <span>+ 200  subscription renewal</span>
        </div>
      </div>
    </figure>
  );
}
