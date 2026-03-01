"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  MessageCircle,
  PenLine,
  ChevronRight,
  FileText,
  Sparkles,
} from "lucide-react";

type Tab = "offen" | "feedback";

interface Submission {
  id: string;
  content: string;
  status: string;
  submitted_at: string;
  file_url: string | null;
  assignment?: {
    title: string;
    unit?: {
      id: string;
      name: string;
      course_id: string;
      course?: { id: string; name: string };
      module?: { name: string } | null;
    };
  };
  feedback?: Array<{
    id: string;
    content: string;
    created_at: string;
    reviewer?: { full_name: string };
  }>;
}

interface ReflexionenClientProps {
  submissions: Submission[];
}

export function ReflexionenClient({ submissions }: ReflexionenClientProps) {
  const [tab, setTab] = useState<Tab>("offen");

  const openSubmissions = submissions.filter(
    (s) => s.status === "pending" || s.status === "in_review"
  );
  const feedbackSubmissions = submissions.filter(
    (s) => s.status === "reviewed"
  );

  const current = tab === "offen" ? openSubmissions : feedbackSubmissions;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Meine Reflexionen
        </h1>
        <p className="mt-1 text-muted-foreground">
          Übersicht deiner eingereichten Reflexionen und Feedback.
        </p>
      </div>

      <div>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "offen" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("offen")}
            className={tab === "offen" ? "bg-[#0099A8] hover:bg-[#007A87]" : ""}
          >
            <Clock className="w-4 h-4 mr-2" />
            Offen ({openSubmissions.length})
          </Button>
          <Button
            variant={tab === "feedback" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("feedback")}
            className={tab === "feedback" ? "bg-[#0099A8] hover:bg-[#007A87]" : ""}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Feedback erhalten ({feedbackSubmissions.length})
          </Button>
        </div>

        {/* Submissions list */}
        {current.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 p-16 text-center bg-muted/20">
            <MessageCircle className="mx-auto mb-4 h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              {tab === "offen"
                ? "Keine offenen Reflexionen. Gut gemacht!"
                : "Noch kein Feedback erhalten."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {current.map((s) => {
              const courseId = s.assignment?.unit?.course_id || s.assignment?.unit?.course?.id;
              const unitId = s.assignment?.unit?.id;

              return (
                <Link
                  key={s.id}
                  href={courseId && unitId ? `/courses/${courseId}/units/${unitId}` : "#"}
                >
                  <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0099A8]/10 mt-0.5">
                          {s.status === "reviewed" ? (
                            <Sparkles className="h-5 w-5 text-[#0099A8]" />
                          ) : (
                            <FileText className="h-5 w-5 text-[#0099A8]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {s.assignment?.title || "Reflexion"}
                            </span>
                            <Badge
                              variant={s.status === "reviewed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {s.status === "pending"
                                ? "Wird gelesen"
                                : s.status === "in_review"
                                  ? "In Bearbeitung"
                                  : "Feedback erhalten"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {s.assignment?.unit?.course?.name}
                            {s.assignment?.unit?.module?.name && ` · ${s.assignment.unit.module.name}`}
                            {` · ${s.assignment?.unit?.name}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(s.submitted_at).toLocaleDateString("de-CH", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          {s.status === "reviewed" && s.feedback?.[0] && (
                            <div className="mt-2 p-3 bg-[#0099A8]/5 rounded-lg">
                              <p className="text-xs text-muted-foreground font-medium mb-1">
                                Feedback von {s.feedback[0].reviewer?.full_name || "Team PLI®"}
                              </p>
                              <div
                                className="text-sm text-foreground line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: s.feedback[0].content }}
                              />
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
