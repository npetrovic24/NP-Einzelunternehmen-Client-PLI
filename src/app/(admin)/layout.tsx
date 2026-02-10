import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AppHeader } from "@/components/app-header";

export default async function AdminLayout({
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

  if (!profile || (profile.role !== "admin" && profile.role !== "dozent")) {
    redirect("/dashboard");
  }

  const isDozent = profile.role === "dozent";
  const headerLabel = isDozent ? "Benutzer verwalten" : "Administration";

  return (
    <div className="flex h-screen">
      <AdminSidebar role={profile.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          userName={profile.full_name || user.email || "Admin"}
          isAdmin
          role={profile.role}
          headerLabel={headerLabel}
        />
        <main className="flex-1 overflow-y-auto bg-secondary p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
