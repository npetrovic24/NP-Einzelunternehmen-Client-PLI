"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Settings, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebarMobile } from "@/components/admin-sidebar-mobile";
import type { UserRole } from "@/lib/types";

interface AppHeaderProps {
  userName: string;
  isAdmin?: boolean;
  role?: UserRole;
  headerLabel?: string;
}

export function AppHeader({ userName, isAdmin = false, role = "participant", headerLabel }: AppHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="flex h-14 items-center border-b border-border bg-white px-4 lg:px-6">
      {/* Mobile menu (Admin only) */}
      {isAdmin && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu öffnen</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebarMobile role={role} userName={userName} />
          </SheetContent>
        </Sheet>
      )}

      {/* Logo for member view */}
      {!isAdmin && (
        <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
          <img src="/logo-teal.svg" alt="PLI" className="h-8 w-auto" />
          <span className="text-sm font-semibold text-foreground">
            Lernportal
          </span>
        </Link>
      )}

      {/* Admin badge + spacer */}
      {isAdmin && (
        <>
          <Badge variant="outline" className="mr-auto gap-1 border-primary/30 text-primary text-xs">
            <Shield className="h-3 w-3" />
            {headerLabel || "Admin"}
          </Badge>
          <div className="flex-1" />
        </>
      )}

      {/* User menu */}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Einstellungen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Abmelden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
