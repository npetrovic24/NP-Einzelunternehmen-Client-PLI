"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PenLine, Save, Trash2, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { upsertAssignment, deleteAssignment } from "@/lib/actions/submissions";
import type { Assignment } from "@/lib/types";

interface Props {
  unitId: string;
  initialAssignment: Assignment | null;
}

export function AssignmentEditor({ unitId, initialAssignment }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialAssignment?.title || "");
  const [description, setDescription] = useState(initialAssignment?.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [assignment, setAssignment] = useState(initialAssignment);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Titel ist erforderlich");
      return;
    }

    setIsSaving(true);
    try {
      const result = await upsertAssignment({
        unitId,
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Reflexionsaufgabe gespeichert");
        setAssignment({ ...assignment, title, description } as Assignment);
        setIsEditing(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAssignment(unitId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Reflexionsaufgabe entfernt");
        setAssignment(null);
        setTitle("");
        setDescription("");
        setIsEditing(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Löschen");
    } finally {
      setIsDeleting(false);
    }
  };

  // No assignment yet — show add button
  if (!assignment && !isEditing) {
    return (
      <Card className="border-dashed border-2 mt-6">
        <CardContent className="p-6 text-center">
          <PenLine className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Dieser Tag hat noch keine Reflexionsaufgabe.
          </p>
          <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Reflexionsaufgabe hinzufügen
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show existing assignment (view mode)
  if (assignment && !isEditing) {
    return (
      <Card className="mt-6 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <PenLine className="h-4 w-4 text-primary" />
              Reflexionsaufgabe
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTitle(assignment.title);
                  setDescription(assignment.description || "");
                  setIsEditing(true);
                }}
              >
                Bearbeiten
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-sm">{assignment.title}</p>
          {assignment.description && (
            <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
          )}
          <div className="flex items-center gap-1.5 mt-3 text-xs text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Teilnehmer sehen diese Aufgabe auf der Lehrgangsseite
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="h-4 w-4 text-primary" />
          {assignment ? "Reflexionsaufgabe bearbeiten" : "Neue Reflexionsaufgabe"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Reflexion Tag 3"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="description">Aufgabenstellung (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was sollen die Teilnehmer reflektieren? Z.B. 'Beschreibe deine wichtigste Erkenntnis von heute...'"
            rows={4}
            className="mt-1 resize-y"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              if (!assignment) {
                setTitle("");
                setDescription("");
              }
            }}
          >
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim()} className="gap-2">
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
