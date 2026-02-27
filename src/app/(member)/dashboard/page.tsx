import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccessibleCoursesWithCounts, checkAndNotifyExpiredAccess } from "@/lib/access";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const courses = await getAccessibleCoursesWithCounts(user.id);

  // Check for expired access and send notification email if needed (fire & forget)
  checkAndNotifyExpiredAccess(user.id).catch(error => {
    console.error("Failed to check expired access:", error);
    // Don't block dashboard loading
  });

  return (
    <DashboardClient
      userName={profile?.full_name || ""}
      courses={courses}
    />
  );
}
