"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Pick up the recovery token from the URL hash fragment
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Also check if already signed in (e.g. page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Passwort wurde erfolgreich gesetzt.");
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        window.location.href = "/admin";
      } else if (profile?.role === "dozent") {
        window.location.href = "/admin/members";
      } else {
        window.location.href = "/dashboard";
      }
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex min-h-screen animate-fade-in">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0099A8] via-[#007A87] to-[#005F6B]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full border-2 border-white" />
          <div className="absolute bottom-32 right-16 h-48 w-48 rounded-full border-2 border-white" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-20">
          <img src="/logo-white.svg" alt="PLI Logo" className="mb-8 h-16 w-auto" />
          <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">Passwort setzen</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/80">
            Setzen Sie Ihr persönliches Passwort, um Zugang zum Lernportal zu erhalten.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="h-2 bg-gradient-to-r from-[#0099A8] to-[#007A87] lg:hidden" />
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 text-center">
              <img src="/logo-teal.svg" alt="PLI Logo" className="mx-auto mb-4 h-14 w-auto" />
              <h1 className="text-xl font-semibold text-foreground">Passwort setzen</h1>
              <p className="mt-1 text-sm text-muted-foreground">Wählen Sie ein sicheres Passwort für Ihr Konto.</p>
            </div>
            <Card className="shadow-sm">
              <CardHeader>
                <h2 className="text-center text-lg font-semibold">Neues Passwort</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Passwort (min. 8 Zeichen)</Label>
                    <Input id="password" type="password" placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
                  </div>
                  <Button type="submit" className="w-full" disabled={!ready || !password || !confirmPassword || loading}>
                    {!ready ? "Wird geladen..." : loading ? "Wird gespeichert..." : "Passwort speichern"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Praxis für Lösungs-Impulse AG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
