import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, BarChart3, Layers, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Dozent should not see the dashboard
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === "dozent") {
      redirect("/admin/members");
    }
  }

  const [
    { count: membersCount },
    { count: activeMembersCount },
    { count: coursesCount },
    { count: activeCoursesCount },
    { count: unitsCount },
    { count: activeGrantsCount },
    { data: recentMembers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("role", "participant"),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("units").select("*", { count: "exact", head: true }),
    supabase
      .from("access_grants")
      .select("*", { count: "exact", head: true })
      .eq("is_granted", true),
    supabase
      .from("profiles")
      .select("full_name, email, created_at, is_active")
      .eq("role", "participant")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Benutzer",
      value: membersCount ?? 0,
      sub: `${activeMembersCount ?? 0} aktiv`,
      icon: Users,
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Lehrgänge",
      value: coursesCount ?? 0,
      sub: `${activeCoursesCount ?? 0} aktiv`,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Einheiten",
      value: unitsCount ?? 0,
      sub: "Erstellte Tage",
      icon: Layers,
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Aktive Zugriffe",
      value: activeGrantsCount ?? 0,
      sub: "Freigeschaltete Zugriffe",
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-accent",
    },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent members */}
      {recentMembers && recentMembers.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Letzte Benutzer
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentMembers.map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {member.full_name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={member.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {member.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(member.created_at).toLocaleDateString("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
