"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, Menu, PenLine, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Meine Lehrgänge", icon: BookOpen },
  { href: "/reflexionen", label: "Meine Reflexionen", icon: PenLine },
];

interface MemberMobileHeaderProps {
  userName: string;
}

export function MemberMobileHeader({ userName }: MemberMobileHeaderProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/courses");
    return pathname.startsWith(href);
  };

  return (
    <header className="flex h-14 items-center border-b border-border bg-white px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b border-border px-6 py-5">
              <Link href="/dashboard" className="flex items-center gap-3">
                <img src="/logo-teal.svg" alt="PLI" className="h-9 w-auto" />
                <span className="text-sm font-semibold text-foreground">Lernportal</span>
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border px-3 py-4 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-foreground truncate">{userName}</span>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Einstellungen
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Abmelden
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="flex items-center gap-2">
        <img src="/logo-teal.svg" alt="PLI" className="h-8 w-auto" />
        <span className="text-sm font-semibold text-foreground">Lernportal</span>
      </Link>
    </header>
  );
}
