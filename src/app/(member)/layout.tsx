import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberSidebar } from "@/components/member-sidebar";
import { MemberMobileHeader } from "@/components/member-mobile-header";

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
  const isDozent = profile?.role === "dozent";
  const userName = profile?.full_name || user.email || "Benutzer";

  return (
    <div className="flex h-screen">
      <MemberSidebar userName={userName} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {(isAdmin || isDozent) && (
          <div className="flex items-center justify-center gap-2 bg-[#0099A8] px-4 py-1.5 text-xs text-white">
            <span>{isAdmin ? "Admin-Vorschau" : "Dozenten-Ansicht"}</span>
            {isAdmin && (
              <>
                <span className="mx-1">|</span>
                <Link href="/admin" className="underline hover:no-underline">
                  Zurück zur Admin-Ansicht
                </Link>
              </>
            )}
          </div>
        )}
        {/* Mobile header (hidden on desktop where sidebar shows) */}
        <MemberMobileHeader userName={userName} />
        <main className="flex-1 overflow-y-auto bg-secondary p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
