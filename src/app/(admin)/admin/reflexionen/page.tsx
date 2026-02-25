import { getAllSubmissions, getReflexionStats } from "@/lib/actions/submissions";
import { ReflexionenQueueClient } from "./reflexionen-queue-client";

export default async function AdminReflexionenPage() {
  const [submissions, stats] = await Promise.all([
    getAllSubmissions(),
    getReflexionStats(),
  ]);

  return <ReflexionenQueueClient submissions={submissions} stats={stats} />;
}
