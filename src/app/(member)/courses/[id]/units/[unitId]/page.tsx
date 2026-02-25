import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUnitContent } from "@/lib/access";
import { getAssignmentForUnit, getMySubmissionForAssignment } from "@/lib/actions/submissions";
import { UnitViewClient } from "./unit-view-client";

export default async function UnitViewPage({
  params,
}: {
  params: Promise<{ id: string; unitId: string }>;
}) {
  const { id, unitId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const unitData = await getUnitContent(user.id, id, unitId);

  if (!unitData) {
    redirect(`/courses/${id}`);
  }

  // Load assignment for this unit + existing submission
  const assignment = await getAssignmentForUnit(unitId);
  let existingSubmission = null;
  if (assignment) {
    existingSubmission = await getMySubmissionForAssignment(assignment.id);
  }

  return (
    <UnitViewClient
      course={unitData.course}
      unit={unitData.unit}
      blocks={unitData.blocks}
      prevUnit={unitData.prevUnit}
      nextUnit={unitData.nextUnit}
      courseId={id}
      assignment={assignment}
      existingSubmission={existingSubmission}
    />
  );
}
