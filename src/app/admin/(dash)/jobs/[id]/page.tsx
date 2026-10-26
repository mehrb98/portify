import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobEditor } from "@/components/admin/job-editor";
import { requireAdmin } from "@/lib/auth";
import { getJobEditorData } from "@/lib/admin/jobs";

export const metadata: Metadata = { title: "Edit job" };

export default async function EditJobPage({ params }: PageProps<"/admin/jobs/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const data = await getJobEditorData(id);
  if (!data.job) notFound();
  return <JobEditor {...data} />;
}
