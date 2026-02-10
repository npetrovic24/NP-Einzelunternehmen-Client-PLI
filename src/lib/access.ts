import { createClient } from "@/lib/supabase/server";
import type { AccessGrant, Course, Module, Unit, UserRole } from "@/lib/types";

export interface UserAccessData {
  grants: AccessGrant[];
  courses: Course[];
  modules: Module[];
  units: Unit[];
  role: UserRole;
}

/**
 * Checks if a grant is currently active (not expired).
 */
function isGrantActive(grant: AccessGrant): boolean {
  if (!grant.is_granted) return false;
  if (grant.expires_at && new Date(grant.expires_at) < new Date()) return false;
  return true;
}

/**
 * Checks if a grant is expired (was granted but has passed its expiration date).
 */
export function isGrantExpired(grant: AccessGrant): boolean {
  if (!grant.is_granted) return false;
  if (grant.expires_at && new Date(grant.expires_at) < new Date()) return true;
  return false;
}

/**
 * Determines if a user has access to a specific unit.
 * "Most specific rule wins":
 *   Unit grant > Module grant > Course grant > no grant (denied)
 */
export function hasUnitAccess(
  grants: AccessGrant[],
  unit: Unit
): boolean {
  // Check unit-level grant first (most specific)
  const unitGrant = grants.find((g) => g.unit_id === unit.id);
  if (unitGrant) return isGrantActive(unitGrant);

  // Check module-level grant
  if (unit.module_id) {
    const moduleGrant = grants.find(
      (g) => g.module_id === unit.module_id && !g.unit_id
    );
    if (moduleGrant) return isGrantActive(moduleGrant);
  }

  // Check course-level grant
  const courseGrant = grants.find(
    (g) => g.course_id === unit.course_id && !g.module_id && !g.unit_id
  );
  if (courseGrant) return isGrantActive(courseGrant);

  // No grant = no access
  return false;
}

/**
 * Determines if a user has access to a module (at least one unit accessible).
 */
export function hasModuleAccess(
  grants: AccessGrant[],
  module: Module,
  units: Unit[]
): boolean {
  const moduleUnits = units.filter((u) => u.module_id === module.id);
  if (moduleUnits.length === 0) {
    const moduleGrant = grants.find(
      (g) => g.module_id === module.id && !g.unit_id
    );
    if (moduleGrant) return isGrantActive(moduleGrant);

    const courseGrant = grants.find(
      (g) => g.course_id === module.course_id && !g.module_id && !g.unit_id
    );
    if (courseGrant) return isGrantActive(courseGrant);

    return false;
  }
  return moduleUnits.some((u) => hasUnitAccess(grants, u));
}

/**
 * Determines if a user has access to a course (at least one unit accessible).
 */
export function hasCourseAccess(
  grants: AccessGrant[],
  course: Course,
  units: Unit[]
): boolean {
  const courseUnits = units.filter((u) => u.course_id === course.id);
  if (courseUnits.length === 0) {
    const courseGrant = grants.find(
      (g) => g.course_id === course.id && !g.module_id && !g.unit_id
    );
    return courseGrant ? isGrantActive(courseGrant) : false;
  }
  return courseUnits.some((u) => hasUnitAccess(grants, u));
}

/**
 * Checks if a course grant exists but is expired (for dashboard display).
 */
export function isCourseExpired(
  grants: AccessGrant[],
  course: Course,
  units: Unit[]
): boolean {
  const courseGrant = grants.find(
    (g) => g.course_id === course.id && !g.module_id && !g.unit_id
  );
  if (courseGrant && isGrantExpired(courseGrant)) return true;

  const courseUnits = units.filter((u) => u.course_id === course.id);
  if (courseUnits.length === 0) return false;

  const hasAnyActiveUnit = courseUnits.some((u) => hasUnitAccess(grants, u));
  const hasAnyGrant = grants.some(
    (g) =>
      (g.course_id === course.id) ||
      courseUnits.some((u) => g.unit_id === u.id)
  );

  return !hasAnyActiveUnit && hasAnyGrant;
}

/**
 * Fetches all access data needed for the member portal.
 */
export async function getUserAccessData(
  userId: string
): Promise<UserAccessData> {
  const supabase = await createClient();

  const [profileRes, grantsRes, coursesRes, modulesRes, unitsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single(),
    supabase.from("access_grants").select("*").eq("user_id", userId),
    supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("modules")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("units")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  return {
    grants: grantsRes.data || [],
    courses: coursesRes.data || [],
    modules: modulesRes.data || [],
    units: unitsRes.data || [],
    role: (profileRes.data?.role as UserRole) || "participant",
  };
}

/**
 * Gets courses the user has access to (for dashboard).
 */
export async function getAccessibleCourses(userId: string) {
  const data = await getUserAccessData(userId);

  if (data.role === "admin") return data.courses;

  return data.courses.filter((course) =>
    hasCourseAccess(data.grants, course, data.units)
  );
}

export interface CourseWithCounts extends Course {
  unitCount: number;
  accessibleUnitCount: number;
  isExpired: boolean;
}

/**
 * Gets courses with unit counts for the dashboard.
 * Includes expired courses so they can be shown greyed out.
 */
export async function getAccessibleCoursesWithCounts(
  userId: string
): Promise<CourseWithCounts[]> {
  const data = await getUserAccessData(userId);
  const isAdmin = data.role === "admin";

  return data.courses
    .filter((course) => {
      if (isAdmin) return true;
      return (
        hasCourseAccess(data.grants, course, data.units) ||
        isCourseExpired(data.grants, course, data.units)
      );
    })
    .map((course) => {
      const courseUnits = data.units.filter((u) => u.course_id === course.id);
      const accessibleUnits = isAdmin
        ? courseUnits
        : courseUnits.filter((u) => hasUnitAccess(data.grants, u));
      const expired = !isAdmin && isCourseExpired(data.grants, course, data.units);
      return {
        ...course,
        unitCount: courseUnits.length,
        accessibleUnitCount: accessibleUnits.length,
        isExpired: expired,
      };
    });
}

/**
 * Gets full course data with access info for the course viewer.
 */
export async function getCourseWithAccess(userId: string, courseId: string) {
  const data = await getUserAccessData(userId);
  const isAdmin = data.role === "admin";

  const course = data.courses.find((c) => c.id === courseId);
  if (!course) return null;

  if (!isAdmin && !hasCourseAccess(data.grants, course, data.units)) return null;

  const courseModules = data.modules.filter((m) => m.course_id === courseId);
  const courseUnits = data.units.filter((u) => u.course_id === courseId);

  const unitsWithAccess = courseUnits.map((unit) => ({
    ...unit,
    hasAccess: isAdmin || hasUnitAccess(data.grants, unit),
  }));

  const modulesWithAccess = courseModules.map((mod) => ({
    ...mod,
    hasAccess: isAdmin || hasModuleAccess(data.grants, mod, courseUnits),
  }));

  return {
    course,
    modules: modulesWithAccess,
    units: unitsWithAccess,
  };
}

/**
 * Checks if a user can access a specific unit and returns the unit's content blocks.
 */
export async function getUnitContent(userId: string, courseId: string, unitId: string) {
  const supabase = await createClient();
  const data = await getUserAccessData(userId);
  const isAdmin = data.role === "admin";

  const course = data.courses.find((c) => c.id === courseId);
  if (!course) return null;

  const unit = data.units.find((u) => u.id === unitId && u.course_id === courseId);
  if (!unit) return null;

  if (!isAdmin && !hasUnitAccess(data.grants, unit)) return null;

  const { data: fullBlocks } = await supabase
    .from("content_blocks")
    .select("*")
    .eq("unit_id", unitId)
    .order("sort_order", { ascending: true });

  const safeBlocks = (fullBlocks || []).map((block) => {
    if (block.type === "canva_embed") {
      return {
        ...block,
        content: { title: (block.content as Record<string, unknown>)?.title || "Canva Präsentation" },
      };
    }
    return block;
  });

  const courseUnits = data.units.filter((u) => u.course_id === courseId);
  const accessibleUnits = isAdmin
    ? courseUnits
    : courseUnits.filter((u) => hasUnitAccess(data.grants, u));

  const currentIndex = accessibleUnits.findIndex((u) => u.id === unitId);
  const prevUnit = currentIndex > 0 ? accessibleUnits[currentIndex - 1] : null;
  const nextUnit =
    currentIndex < accessibleUnits.length - 1
      ? accessibleUnits[currentIndex + 1]
      : null;

  return {
    course,
    unit,
    blocks: safeBlocks,
    prevUnit,
    nextUnit,
  };
}
