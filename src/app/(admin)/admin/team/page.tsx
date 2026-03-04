import { createClient } from "@/lib/supabase/server";
import { getTeamMembers, getAllCourses } from "@/lib/actions/members";
import { MembersClient } from "../members/members-client";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Only admins can manage team
  if (profile?.role !== "admin") {
    redirect("/admin/members");
  }

  const [members, courses] = await Promise.all([
    getTeamMembers(),
    getAllCourses(),
  ]);

  return (
    <MembersClient
      initialMembers={members}
      courses={courses}
      currentUserRole="admin"
      mode="team"
    />
  );
}
