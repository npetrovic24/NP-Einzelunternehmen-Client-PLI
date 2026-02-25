"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  Eye,
  MessageCircle,
  Users,
  ChevronRight,
  Inbox,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "in_review" | "reviewed";

interface Submission {
  id: string;
  content: string;
  status: string;
  submitted_at: string;
  assigned_to: string | null;
  user?: { id: string; full_name: string; email: string };
  assignment?: {
    title: string;
    unit?: {
      name: string;
      course?: { name: string };
      module?: { name: string } | null;
    };
  };
  feedback?: Array<{ id: string }>;
}

interface Stats {
  pending: number;
  inReview: number;
  reviewed: number;
  totalStudents: number;
}

interface Props {
  submissions: Submission[];
  stats: Stats;
}

const statusConfig = {
  pending: { label: "Offen", variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
  in_review: { label: "In Bearbeitung", variant: "outline" as const, icon: Eye, color: "text-blue-600" },
  reviewed: { label: "Erledigt", variant: "default" as const, icon: CheckCircle2, color: "text-green-600" },
};

export function ReflexionenQueueClient({ submissions, stats }: Props) {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = filter === "all"
    ? submissions
    : submissions.filter((s) => s.status === filter);

  return (
    <div className="animate-fade-in">
      <h1 className="mb-6 text-2xl font-semibold">Reflexionen</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("pending")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              Offen
            </div>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("in_review")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Eye className="w-4 h-4 text-blue-600" />
              In Bearbeitung
            </div>
            <p className="text-2xl font-bold">{stats.inReview}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter("reviewed")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Erledigt
            </div>
            <p className="text-2xl font-bold">{stats.reviewed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              Teilnehmer
            </div>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        {(["all", "pending", "in_review", "reviewed"] as StatusFilter[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Alle" : statusConfig[f].label}
            {f !== "all" && (
              <span className="ml-1.5 text-xs">
                ({f === "pending" ? stats.pending : f === "in_review" ? stats.inReview : stats.reviewed})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Submissions list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/50 p-16 text-center bg-muted/20">
          <Inbox className="mx-auto mb-4 h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">
            Keine Reflexionen in dieser Ansicht.
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filtered.map((s) => {
                const config = statusConfig[s.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = config.icon;

                return (
                  <Link
                    key={s.id}
                    href={`/admin/reflexionen/${s.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group"
                  >
                    <StatusIcon className={`h-5 w-5 shrink-0 ${config.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm">
                          {s.user?.full_name || "Unbekannt"}
                        </span>
                        <Badge variant={config.variant} className="text-xs">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {s.assignment?.unit?.course?.name}
                        {s.assignment?.unit?.module?.name && ` · ${s.assignment.unit.module.name}`}
                        {` · ${s.assignment?.unit?.name}`}
                        {` — ${s.assignment?.title}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(s.submitted_at).toLocaleDateString("de-CH", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
