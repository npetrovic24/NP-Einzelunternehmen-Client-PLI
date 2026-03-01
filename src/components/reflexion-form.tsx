"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createSubmission } from "@/lib/actions/submissions";
import { toast } from "sonner";
import {
  PenLine,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Heart,
  Sparkles,
  ChevronDown,
  ChevronUp,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasFeedback = existingSubmission?.feedback && existingSubmission.feedback.length > 0;
  const [showFullReflexion, setShowFullReflexion] = useState(false);

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
                    className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap"
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
                  className={`mt-3 text-sm text-muted-foreground ${showFullReflexion ? "" : "line-clamp-3"}`}
                  dangerouslySetInnerHTML={{ __html: existingSubmission.content }}
                />
                <button
                  onClick={() => setShowFullReflexion(!showFullReflexion)}
                  className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  {showFullReflexion ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Weniger anzeigen
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Vollständig anzeigen
                    </>
                  )}
                </button>
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


  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Bitte schreibe deine Reflexion");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createSubmission({
        assignmentId: assignment.id,
        content: content.trim(),
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
