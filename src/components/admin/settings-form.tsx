"use client";

import type { ReactNode } from "react";
import { saveProfile } from "@/lib/admin/actions/settings";
import { FormMessage, ListEditor, RowsEditor, SubmitButton, useAdminForm } from "./form-kit";
import { TextArea, TextField } from "./ui";

export type ProfileInput = {
  name: string;
  headline: string;
  status: string;
  location: string;
  pitch: string;
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
  photoUrl: string;
  facts: { k: string; v: string }[];
  coreStack: string;
  metrics: { n: string; l: string }[];
  aboutTitle: string;
  about: string[];
  strengths: { t: string; d: string }[];
};

function Group({ title, sub, id, children }: { title: string; sub?: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-h` : undefined} className="flex scroll-mt-6 flex-col gap-4 rounded-[14px] border border-rule p-5">
      <div className="flex items-baseline gap-2.5">
        <h2 id={id ? `${id}-h` : undefined} className="text-base font-semibold">
          {title}
        </h2>
        {sub ? <span className="font-mono text-xs text-ink-3">{sub}</span> : null}
      </div>
      {children}
    </section>
  );
}

export function SettingsForm({ profile, version }: { profile: ProfileInput; version: number }) {
  const { state, formAction, onSubmit, pending, errors } = useAdminForm(saveProfile);
  const p = profile;
  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="flex min-w-0 flex-col gap-5">
      <FormMessage state={state} />
      <div key={`${version}-${state.savedAt ?? 0}`} className="flex flex-col gap-5">
        <Group id="hero" title="Hero" sub="top of the page">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="name" label="Name" defaultValue={p.name} required error={errors.name} />
            <TextField id="headline" label="Headline" defaultValue={p.headline} required error={errors.headline} />
            <TextField id="status" label="Status badge" defaultValue={p.status} required error={errors.status} hint="The badge next to the portrait." />
            <TextField id="location" label="Location" defaultValue={p.location} required error={errors.location} />
          </div>
          <TextArea id="pitch" label="Pitch" rows={4} defaultValue={p.pitch} required error={errors.pitch} />
          <TextField id="photoUrl" label="Photo URL" mono defaultValue={p.photoUrl} placeholder="/portrait.jpg" error={errors.photoUrl} hint="A path in public/ (like /portrait.jpg) or a full URL." />
          <RowsEditor
            name="metrics"
            label="Key metrics"
            hint="under the hero"
            columns={[
              { key: "n", label: "Number", placeholder: "3 companies" },
              { key: "l", label: "Label", wide: true },
            ]}
            initial={p.metrics}
            what="metric"
            addLabel="Add metric"
            error={errors.metrics}
          />
        </Group>

        <Group id="links" title="Contact and links">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="email" label="Email" type="email" defaultValue={p.email} required error={errors.email} />
            <TextField id="github" label="GitHub URL" type="url" mono defaultValue={p.github} placeholder="https://github.com/..." error={errors.github} />
            <TextField id="linkedin" label="LinkedIn URL" type="url" mono defaultValue={p.linkedin} placeholder="https://linkedin.com/in/..." error={errors.linkedin} />
          </div>
          <div id="cv" className="scroll-mt-6">
            <TextField
              id="cvUrl"
              label="CV URL"
              mono
              defaultValue={p.cvUrl}
              placeholder="/cv/mehrulloh-boboev-cv.pdf"
              error={errors.cvUrl}
              warn={p.cvUrl ? undefined : "Empty: the CV buttons are hidden on the site."}
              hint="Leave empty to hide the CV buttons. The PDF of your CV includes your phone number, so upload a version without it, either to public/cv/ in the repository (then enter /cv/file-name.pdf) or to a host you control (enter the full URL)."
            />
          </div>
        </Group>

        <Group id="glance" title="At a glance" sub="card next to the hero">
          <RowsEditor
            name="facts"
            label="Facts"
            columns={[
              { key: "k", label: "Label", placeholder: "role" },
              { key: "v", label: "Value", wide: true },
            ]}
            initial={p.facts}
            what="fact"
            addLabel="Add fact"
            error={errors.facts}
          />
          <TextField id="coreStack" label="Core stack" defaultValue={p.coreStack} hint="Comma separated, in the order shown." error={errors.coreStack} />
        </Group>

        <Group id="about" title="About">
          <TextField id="aboutTitle" label="About title" defaultValue={p.aboutTitle} required error={errors.aboutTitle} />
          <ListEditor name="about" label="Paragraphs" initial={p.about} what="paragraph" addLabel="Add paragraph" error={errors.about} rows={4} />
          <RowsEditor
            name="strengths"
            label="What I bring"
            columns={[
              { key: "t", label: "Title", placeholder: "End-to-end ownership" },
              { key: "d", label: "Description", wide: true },
            ]}
            initial={p.strengths}
            what="item"
            addLabel="Add item"
            error={errors.strengths}
          />
        </Group>
      </div>
      <div className="sticky bottom-0 -mx-1 flex items-center gap-3 border-t border-rule bg-surface/95 px-1 py-3 backdrop-blur">
        <SubmitButton pending={pending}>Save settings</SubmitButton>
        <span className="text-[12.5px] text-ink-3">Changes go live on the site when saved.</span>
      </div>
    </form>
  );
}
