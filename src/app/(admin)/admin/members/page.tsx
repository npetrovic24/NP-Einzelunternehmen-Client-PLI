import { getMembers, getAllCourses } from "@/lib/actions/members";
import { MembersClient } from "./members-client";

export default async function MembersPage() {
  const [members, courses] = await Promise.all([
    getMembers(),
    getAllCourses(),
  ]);

  return <MembersClient initialMembers={members} courses={courses} />;
}
