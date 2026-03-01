"use server";

import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht authentifiziert");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") throw new Error("Keine Berechtigung");
  return user;
}

export async function getMemberAccess(memberId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: member } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", memberId)
    .single();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: units } = await supabase
    .from("units")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: grants } = await supabase
    .from("access_grants")
    .select("*")
    .eq("user_id", memberId);

  return {
    member,
    courses: courses || [],
    modules: modules || [],
    units: units || [],
    grants: grants || [],
  };
}

export async function getCourseAccess(courseId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "participant")
    .order("full_name", { ascending: true });

  const { data: grants } = await supabase
    .from("access_grants")
    .select("*")
    .eq("course_id", courseId)
    .is("module_id", null)
    .is("unit_id", null);

  return {
    course,
    members: members || [],
    grants: grants || [],
  };
}

export async function setAccessGrant(params: {
  userId: string;
  courseId?: string;
  moduleId?: string;
  unitId?: string;
  isGranted: boolean;
  expiresAt?: string | null;
}) {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("access_grants")
    .select("id")
    .eq("user_id", params.userId);

  if (params.courseId && !params.moduleId && !params.unitId) {
    query = query.eq("course_id", params.courseId).is("module_id", null).is("unit_id", null);
  } else if (params.moduleId && !params.unitId) {
    query = query.eq("module_id", params.moduleId).is("unit_id", null);
  } else if (params.unitId) {
    query = query.eq("unit_id", params.unitId);
  }

  const { data: existing } = await query;

  if (existing && existing.length > 0) {
    const updateData: Record<string, unknown> = { is_granted: params.isGranted };
    if (params.expiresAt !== undefined) {
      updateData.expires_at = params.expiresAt || null;
    }
    const { error } = await supabase
      .from("access_grants")
      .update(updateData)
      .eq("id", existing[0].id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("access_grants").insert({
      user_id: params.userId,
      course_id: params.courseId || null,
      module_id: params.moduleId || null,
      unit_id: params.unitId || null,
      is_granted: params.isGranted,
      expires_at: params.expiresAt || null,
    });
    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function updateGrantExpiration(params: {
  userId: string;
  courseId?: string;
  moduleId?: string;
  unitId?: string;
  expiresAt: string | null;
}) {
  await requireAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("access_grants")
    .select("id")
    .eq("user_id", params.userId);

  if (params.courseId && !params.moduleId && !params.unitId) {
    query = query.eq("course_id", params.courseId).is("module_id", null).is("unit_id", null);
  } else if (params.moduleId && !params.unitId) {
    query = query.eq("module_id", params.moduleId).is("unit_id", null);
  } else if (params.unitId) {
    query = query.eq("unit_id", params.unitId);
  }

  const { data: existing } = await query;

  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from("access_grants")
      .update({ expires_at: params.expiresAt })
      .eq("id", existing[0].id);
    if (error) return { error: error.message };
    return { success: true };
  }

  return { error: "Kein Zugang gefunden." };
}

export async function setCourseAccessForAll(
  courseId: string,
  isGranted: boolean
) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "participant");

  if (!members) return { error: "Keine Benutzer gefunden" };

  for (const member of members) {
    await setAccessGrant({
      userId: member.id,
      courseId,
      isGranted,
    });
  }

  return { success: true };
}

export async function setCourseLevelAccess(params: {
  userId: string;
  courseId: string;
  isGranted: boolean;
  expiresAt?: string | null;
}) {
  await requireAdmin();
  const supabase = await createClient();

  const result = await setAccessGrant({
    userId: params.userId,
    courseId: params.courseId,
    isGranted: params.isGranted,
    expiresAt: params.expiresAt,
  });

  if ("error" in result) return result;

  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", params.courseId);

  const { data: units } = await supabase
    .from("units")
    .select("id")
    .eq("course_id", params.courseId);

  if (modules && modules.length > 0) {
    const moduleIds = modules.map((m) => m.id);
    await supabase
      .from("access_grants")
      .delete()
      .eq("user_id", params.userId)
      .in("module_id", moduleIds);
  }

  if (units && units.length > 0) {
    const unitIds = units.map((u) => u.id);
    await supabase
      .from("access_grants")
      .delete()
      .eq("user_id", params.userId)
      .in("unit_id", unitIds);
  }

  return { success: true };
}
