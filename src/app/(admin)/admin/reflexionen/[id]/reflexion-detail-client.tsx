"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Wand2,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  Sparkles,
} from "lucide-react";
import {
  createFeedback,
  generateAiFeedback,
  updateSubmissionStatus,
} from "@/lib/actions/submissions";

interface Submission {
  id: string;
  content: string;
  status: string;
  submitted_at: string;
  file_url: string | null;
  assigned_to: string | null;
  user?: { id: string; full_name: string; email: string };
  assignment?: {
    title: string;
    description: string | null;
    unit?: {
      name: string;
      course?: { name: string };
      module?: { name: string } | null;
    };
  };
  feedback?: Array<{
    id: string;
    content: string;
    is_ai_generated: boolean;
    created_at: string;
    reviewer?: { id: string; full_name: string };
  }>;
}

interface Props {
  submission: Submission;
}

const statusConfig = {
  pending: { label: "Offen", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  in_review: { label: "In Bearbeitung", icon: Eye, color: "text-blue-600", bg: "bg-blue-100" },
  reviewed: { label: "Erledigt", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
};

export function ReflexionDetailClient({ submission }: Props) {
  const router = useRouter();
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const config = statusConfig[submission.status as keyof typeof statusConfig] || statusConfig.pending;
  const hasFeedback = submission.feedback && submission.feedback.length > 0;

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      // Set status to in_review
      if (submission.status === "pending") {
        await updateSubmissionStatus(submission.id, "in_review");
      }

      const result = await generateAiFeedback(submission.id);
      setFeedbackContent(result.feedback);
      toast.success(`KI-Feedback für ${result.studentName} generiert`);
    } catch (err: any) {
      toast.error(err.message || "Fehler bei der KI-Generierung");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) {
      toast.error("Bitte schreibe ein Feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createFeedback({
        submissionId: submission.id,
        content: feedbackContent.trim(),
        isAiGenerated: false, // even if AI-generated, it was reviewed
      });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        setShowSuccess(true);
        toast.success("Feedback gesendet!");
      }
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Senden");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Feedback gesendet! ✅</h2>
          <p className="text-muted-foreground mb-6">
            {submission.user?.full_name} kann das Feedback jetzt sehen.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/admin/reflexionen")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Übersicht
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/reflexionen">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Link>
        </Button>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
          <config.icon className="w-3.5 h-3.5" />
          {config.label}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left: Reflexion content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Meta info + Student */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>{submission.assignment?.unit?.course?.name}</span>
              {submission.assignment?.unit?.module?.name && (
                <>
                  <span>·</span>
                  <span>{submission.assignment.unit.module.name}</span>
                </>
              )}
              <span>·</span>
              <span>{submission.assignment?.unit?.name}</span>
            </div>
            <h2 className="text-xl font-semibold">{submission.assignment?.title}</h2>
            {submission.assignment?.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {submission.assignment.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium text-foreground">{submission.user?.full_name || "Unbekannt"}</span>
              <span>·</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(submission.submitted_at).toLocaleDateString("de-CH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Submission content */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Eingereichte Reflexion</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: submission.content }}
              />
              {submission.file_url && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Anhang herunterladen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Feedback panel (sticky) */}
        <div className="xl:w-[520px] xl:shrink-0 xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto space-y-6">
          {/* Existing feedback */}
          {hasFeedback && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  Bereits gesendetes Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submission.feedback!.map((fb) => (
                  <div key={fb.id} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {fb.reviewer?.full_name || "Team PLI®"}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(fb.created_at).toLocaleDateString("de-CH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {fb.is_ai_generated && (
                        <Badge variant="outline" className="text-xs">KI-unterstützt</Badge>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                      {fb.content}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Feedback form */}
          {!hasFeedback && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Feedback schreiben</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerateAi}
                    disabled={isGenerating || isSubmitting}
                    className="gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        KI generiert...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        KI-Feedback generieren
                      </>
                    )}
                  </Button>
                </div>

                <Textarea
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  placeholder="Feedback hier schreiben oder per KI generieren lassen..."
                  rows={18}
                  className="resize-y min-h-[300px]"
                  disabled={isSubmitting}
                />

                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting || !feedbackContent.trim()}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Feedback absenden
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
