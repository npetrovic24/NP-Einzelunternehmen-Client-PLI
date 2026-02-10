"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function getMembers() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllCourses() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createMember(formData: {
  email: string;
  password: string;
  fullName: string;
  courseAssignments?: { courseId: string; expiresAt?: string | null }[];
}) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      full_name: formData.fullName,
      role: "participant",
    },
  });

  if (error) {
    if (error.message.includes("already been registered")) {
      return { error: "Diese E-Mail-Adresse ist bereits vergeben." };
    }
    return { error: error.message };
  }

  // Assign courses if provided
  if (formData.courseAssignments && formData.courseAssignments.length > 0 && data.user) {
    const supabase = await createClient();
    const grants = formData.courseAssignments.map((ca) => ({
      user_id: data.user.id,
      course_id: ca.courseId,
      module_id: null,
      unit_id: null,
      is_granted: true,
      expires_at: ca.expiresAt || null,
    }));
    await supabase.from("access_grants").insert(grants);
  }

  revalidatePath("/admin/members");
  return { data: data.user };
}

export async function updateMember(
  memberId: string,
  formData: { fullName: string; email: string }
) {
  await requireAdmin();
  const supabase = await createClient();
  const admin = createAdminClient();

  // Update profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: formData.fullName,
      email: formData.email,
    })
    .eq("id", memberId);

  if (profileError) return { error: profileError.message };

  // Update auth email if changed
  const { error: authError } = await admin.auth.admin.updateUserById(memberId, {
    email: formData.email,
  });

  if (authError) return { error: authError.message };

  revalidatePath("/admin/members");
  return { success: true };
}

export async function toggleMemberStatus(memberId: string, isActive: boolean) {
  const currentUser = await requireAdmin();

  if (memberId === currentUser.id) {
    return { error: "Sie können sich nicht selbst deaktivieren." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", memberId);

  if (error) return { error: error.message };

  revalidatePath("/admin/members");
  return { success: true };
}

export async function resetMemberPassword(memberId: string, newPassword: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.updateUserById(memberId, {
    password: newPassword,
  });

  if (error) return { error: error.message };
  return { success: true };
}
