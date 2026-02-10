"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const allNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
  { href: "/admin/members", label: "Benutzer", icon: Users, adminOnly: false },
  { href: "/admin/courses", label: "Lehrgänge", icon: BookOpen, adminOnly: true },
];

interface AdminSidebarMobileProps {
  role: UserRole;
}

export function AdminSidebarMobile({ role }: AdminSidebarMobileProps) {
  const pathname = usePathname();
  const navItems = role === "dozent"
    ? allNavItems.filter((item) => !item.adminOnly)
    : allNavItems;

  const homeHref = role === "dozent" ? "/admin/members" : "/admin";
  const title = role === "dozent" ? "Verwaltung" : "Admin";

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-5">
        <Link href={homeHref} className="flex items-center gap-3">
          <img src="/logo-teal.svg" alt="PLI" className="h-9 w-auto" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
