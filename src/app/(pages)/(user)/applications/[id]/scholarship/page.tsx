import { upsertScholarshipForm } from "@/actions/scholarship-forms/create.action";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const { id: scholarshipId } = await upsertScholarshipForm(id);

  redirect(`/applications/${id}/scholarship/${scholarshipId}`);
}
