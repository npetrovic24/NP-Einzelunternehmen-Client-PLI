import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: "not authenticated" });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id, title, is_active")
    .eq("is_active", true)
    .limit(5);

  return NextResponse.json({
    userId: user.id,
    email: user.email,
    profile,
    profileError,
    coursesCount: courses?.length,
    coursesError,
    coursesSample: courses?.slice(0, 2),
  });
}
