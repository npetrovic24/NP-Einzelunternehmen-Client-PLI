import { getSubmissionById } from "@/lib/actions/submissions";
import { ReflexionDetailClient } from "./reflexion-detail-client";

export default async function ReflexionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  return <ReflexionDetailClient submission={submission} />;
}
