import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMySubmissions } from "@/lib/actions/submissions";
import { ReflexionenClient } from "./reflexionen-client";

export default async function ReflexionenPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const submissions = await getMySubmissions();

  return <ReflexionenClient submissions={submissions} />;
}
