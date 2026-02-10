import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberHeader } from "@/components/member-header";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex h-screen flex-col">
      {isAdmin && (
        <div className="flex items-center justify-center gap-2 bg-[#0099A8] px-4 py-1.5 text-xs text-white">
          <span>Admin-Vorschau</span>
          <span className="mx-1">|</span>
          <Link href="/admin" className="underline hover:no-underline">
            Zurück zur Admin-Ansicht
          </Link>
        </div>
      )}
      <MemberHeader userName={profile?.full_name || user.email || "Mitglied"} />
      <main className="flex-1 overflow-y-auto bg-secondary">
        {children}
      </main>
    </div>
  );
}
