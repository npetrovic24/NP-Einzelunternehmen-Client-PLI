"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
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

      {isAdmin && <div className="flex-1" />}

      <div className="flex-1" />
    </header>
  );
}
