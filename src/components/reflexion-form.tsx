"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createSubmission } from "@/lib/actions/submissions";
import { toast } from "sonner";
import {
  PenLine,
  Upload,
  X,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Heart,
  Sparkles,
} from "lucide-react";
import type { Assignment, Feedback } from "@/lib/types";

interface ReflexionFormProps {
  assignment: Assignment;
  existingSubmission?: {
    id: string;
    content: string;
    status: string;
    submitted_at: string;
    feedback?: Feedback[];
  } | null;
}

export function ReflexionForm({ assignment, existingSubmission }: ReflexionFormProps) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFeedback = existingSubmission?.feedback && existingSubmission.feedback.length > 0;

  // Already submitted — show status
  if (existingSubmission && !showSuccess) {
    return (
      <div className="space-y-4">
        {/* Feedback received */}
        {hasFeedback && (
          <Card className="shadow-sm border-l-4 border-l-[#0099A8] bg-gradient-to-r from-[#0099A8]/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0099A8]" />
                Feedback für dich
              </CardTitle>
            </CardHeader>
            <CardContent>
              {existingSubmission.feedback!.map((fb) => (
                <div key={fb.id}>
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {fb.reviewer?.full_name || "Team PLI®"}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(fb.created_at).toLocaleDateString("de-CH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: fb.content }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Submission status */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              {hasFeedback ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Deine Reflexion</span>
                  <Badge variant={hasFeedback ? "default" : "secondary"} className="text-xs">
                    {hasFeedback ? "Feedback erhalten" : "Wird gelesen"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Eingereicht am{" "}
                  {new Date(existingSubmission.submitted_at).toLocaleDateString("de-CH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div
                  className="mt-3 text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: existingSubmission.content }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <Card className="shadow-sm text-center">
        <CardContent className="p-8">
          <div className="w-16 h-16 rounded-full bg-[#0099A8]/10 mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#0099A8]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Wunderbar! 💚</h3>
          <p className="text-muted-foreground">
            Deine Reflexion ist eingegangen. Du bekommst Feedback, sobald sie gelesen wurde.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error("Datei zu gross. Maximal 10 MB.");
        return;
      }
      setFile(f);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Bitte schreibe deine Reflexion");
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl: string | undefined;

      // Upload file if present
      if (file) {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Nicht eingeloggt");

        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("reflection-files")
          .upload(path, file);

        if (uploadError) throw uploadError;
        fileUrl = path;
      }

      const result = await createSubmission({
        assignmentId: assignment.id,
        content: content.trim(),
        fileUrl,
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        setShowSuccess(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Einreichen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border-[#0099A8]/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PenLine className="h-4 w-4 text-[#0099A8]" />
          {assignment.title}
        </CardTitle>
        {assignment.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {assignment.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Teile hier deine Gedanken, Erfahrungen und Erkenntnisse..."
          minHeight="300px"
          disabled={isSubmitting}
        />

        {/* File upload */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />
          {file ? (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="w-5 h-5 text-[#0099A8] shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              {!isSubmitting && (
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4" />
              Datei hinzufügen (optional)
            </Button>
          )}
        </div>

        <Button
          className="w-full gap-2 bg-[#0099A8] hover:bg-[#007A87] text-white"
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Wird gesendet...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Reflexion einreichen
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
