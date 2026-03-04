import { createClient } from "@/lib/supabase/server";
import { getAllSubmissions, getReflexionStats } from "@/lib/actions/submissions";
import { ReflexionenQueueClient } from "./reflexionen-queue-client";
import { redirect } from "next/navigation";

export default async function AdminReflexionenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [submissions, stats] = await Promise.all([
    getAllSubmissions(),
    getReflexionStats(),
  ]);

  return (
    <ReflexionenQueueClient
      submissions={submissions}
      stats={stats}
      currentUserId={user.id}
    />
  );
}
