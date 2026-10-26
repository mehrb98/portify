import type { Metadata } from "next";
import { JobEditor } from "@/components/admin/job-editor";
import { requireAdmin } from "@/lib/auth";
import { getJobEditorData } from "@/lib/admin/jobs";

export const metadata: Metadata = { title: "New job" };

export default async function NewJobPage() {
  await requireAdmin();
  const data = await getJobEditorData(null);
  return <JobEditor {...data} />;
}
