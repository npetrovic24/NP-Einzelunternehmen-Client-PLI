"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";
import {
  createMember,
  updateMember,
  toggleMemberStatus,
  resetMemberPassword,
} from "@/lib/actions/members";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Search,
  KeyRound,
  Shield,
  ShieldOff,
  Loader2,
  Pencil,
  CalendarIcon,
  X,
} from "lucide-react";
import Link from "next/link";

interface CourseOption {
  id: string;
  name: string;
}

interface CourseAssignment {
  courseId: string;
  expiresAt: string | null;
}

interface MembersClientProps {
  initialMembers: Profile[];
  courses: CourseOption[];
}

export function MembersClient({ initialMembers, courses }: MembersClientProps) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetMember, setResetMember] = useState<Profile | null>(null);
  const [editMember, setEditMember] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [courseAssignments, setCourseAssignments] = useState<CourseAssignment[]>([]);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Reset form state
  const [newResetPassword, setNewResetPassword] = useState("");

  const filteredMembers = useMemo(() => {
    if (!search) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }, [members, search]);

  const activeCount = members.filter((m) => m.is_active && m.role !== "admin").length;
  const participantCount = members.filter((m) => m.role !== "admin").length;

  function toggleCourseAssignment(courseId: string) {
    setCourseAssignments((prev) => {
      const existing = prev.find((ca) => ca.courseId === courseId);
      if (existing) {
        return prev.filter((ca) => ca.courseId !== courseId);
      }
      return [...prev, { courseId, expiresAt: null }];
    });
  }

  function setCourseExpiration(courseId: string, date: Date | undefined) {
    setCourseAssignments((prev) =>
      prev.map((ca) =>
        ca.courseId === courseId
          ? { ...ca, expiresAt: date ? date.toISOString() : null }
          : ca
      )
    );
  }

  async function handleCreate() {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      toast.error("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    setLoading(true);
    const result = await createMember({
      email: newEmail,
      password: newPassword,
      fullName: newName,
      courseAssignments: courseAssignments.length > 0 ? courseAssignments : undefined,
    });
    setLoading(false);

    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Teilnehmer "${newName}" wurde angelegt.`);
    if (result.data) {
      setMembers((prev) => [
        {
          id: result.data.id,
          email: newEmail,
          full_name: newName,
          role: "participant",
          is_active: true,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
    setCreateOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setCourseAssignments([]);
  }

  async function handleEdit() {
    if (!editMember || !editName.trim() || !editEmail.trim()) {
      toast.error("Bitte alle Felder ausfüllen.");
      return;
    }

    setLoading(true);
    const result = await updateMember(editMember.id, {
      fullName: editName,
      email: editEmail,
    });
    setLoading(false);

    if ("error" in result && result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Teilnehmer "${editName}" wurde aktualisiert.`);
    setMembers((prev) =>
      prev.map((m) =>
        m.id === editMember.id
          ? { ...m, full_name: editName, email: editEmail }
          : m
      )
    );
    setEditOpen(false);
    setEditMember(null);
  }

  async function handleToggle(member: Profile) {
    const newStatus = !member.is_active;
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, is_active: newStatus } : m))
    );

    const result = await toggleMemberStatus(member.id, newStatus);
    if (result.error) {
      toast.error(result.error);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, is_active: !newStatus } : m
        )
      );
      return;
    }

    toast.success(
      newStatus
        ? `${member.full_name} wurde aktiviert.`
        : `${member.full_name} wurde deaktiviert.`
    );
  }

  async function handleResetPassword() {
    if (!resetMember || !newResetPassword.trim()) return;
    if (newResetPassword.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    setLoading(true);
    const result = await resetMemberPassword(resetMember.id, newResetPassword);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Passwort für ${resetMember.full_name} wurde zurückgesetzt.`);
    setResetOpen(false);
    setResetMember(null);
    setNewResetPassword("");
  }

  function openResetDialog(member: Profile) {
    setResetMember(member);
    setNewResetPassword("");
    setResetOpen(true);
  }

  function openEditDialog(member: Profile) {
    setEditMember(member);
    setEditName(member.full_name);
    setEditEmail(member.email);
    setEditOpen(true);
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teilnehmer</h1>
          <p className="text-sm text-muted-foreground">
            {participantCount} Teilnehmer total, {activeCount} aktiv
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Neuer Teilnehmer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neuen Teilnehmer anlegen</DialogTitle>
              <DialogDescription>
                Erstelle einen neuen Teilnehmer mit E-Mail und Passwort.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Vorname Nachname"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Passwort * (min. 8 Zeichen)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              {/* Course assignments */}
              {courses.length > 0 && (
                <div className="grid gap-2">
                  <Label>Kurse zuweisen (optional)</Label>
                  <div className="space-y-2 rounded-md border p-3 max-h-60 overflow-y-auto">
                    {courses.map((course) => {
                      const assignment = courseAssignments.find(
                        (ca) => ca.courseId === course.id
                      );
                      const isSelected = !!assignment;
                      return (
                        <div key={course.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`course-${course.id}`}
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleCourseAssignment(course.id)
                              }
                            />
                            <label
                              htmlFor={`course-${course.id}`}
                              className="flex-1 text-sm cursor-pointer"
                            >
                              {course.name}
                            </label>
                          </div>
                          {isSelected && (
                            <div className="ml-6 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Gültig bis:
                              </span>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                  >
                                    <CalendarIcon className="mr-1 h-3 w-3" />
                                    {assignment?.expiresAt
                                      ? new Date(
                                          assignment.expiresAt
                                        ).toLocaleDateString("de-CH")
                                      : "Kein Ablauf"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      assignment?.expiresAt
                                        ? new Date(assignment.expiresAt)
                                        : undefined
                                    }
                                    onSelect={(date) =>
                                      setCourseExpiration(course.id, date)
                                    }
                                    disabled={(date) => date < new Date()}
                                  />
                                </PopoverContent>
                              </Popover>
                              {assignment?.expiresAt && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() =>
                                    setCourseExpiration(course.id, undefined)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Abbrechen
              </Button>
              <Button onClick={handleCreate} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Anlegen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Nach Name oder E-Mail suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Erstellt am</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {search ? "Keine Teilnehmer gefunden." : "Noch keine Teilnehmer vorhanden."}
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className={!member.is_active ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">
                    {member.full_name || "–"}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={member.role === "admin" ? "default" : "secondary"}
                    >
                      {member.role === "admin" ? (
                        <><Shield className="mr-1 h-3 w-3" />Admin</>
                      ) : (
                        "Teilnehmer"
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={member.is_active}
                        onCheckedChange={() => handleToggle(member)}
                        disabled={member.role === "admin"}
                      />
                      <span className="text-sm">
                        {member.is_active ? (
                          <span className="text-green-600">Aktiv</span>
                        ) : (
                          <span className="text-red-500">Inaktiv</span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(member.created_at).toLocaleDateString("de-CH")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {member.role !== "admin" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(member)}
                            title="Bearbeiten"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openResetDialog(member)}
                            title="Passwort zurücksetzen"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/admin/members/${member.id}/access`}
                            >
                              {member.is_active ? (
                                <Shield className="mr-1.5 h-3.5 w-3.5" />
                              ) : (
                                <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                              )}
                              Zugriff
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passwort zurücksetzen</DialogTitle>
            <DialogDescription>
              Neues Passwort für {resetMember?.full_name || resetMember?.email} setzen.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-password">Neues Passwort (min. 8 Zeichen)</Label>
              <Input
                id="reset-password"
                type="password"
                placeholder="••••••••"
                value={newResetPassword}
                onChange={(e) => setNewResetPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleResetPassword} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Zurücksetzen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teilnehmer bearbeiten</DialogTitle>
            <DialogDescription>
              Name und E-Mail von {editMember?.full_name} ändern.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Vorname Nachname"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">E-Mail</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="name@example.com"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
