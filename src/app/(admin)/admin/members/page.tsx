import { createClient } from "@/lib/supabase/server";
import { getMembers, getAllCourses } from "@/lib/actions/members";
import { MembersClient } from "./members-client";
import type { UserRole } from "@/lib/types";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentUserRole: UserRole = "admin";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile) currentUserRole = profile.role as UserRole;
  }

  const [members, courses] = await Promise.all([
    getMembers(),
    getAllCourses(),
  ]);

  return (
    <MembersClient
      initialMembers={members}
      courses={courses}
      currentUserRole={currentUserRole}
    />
  );
}
