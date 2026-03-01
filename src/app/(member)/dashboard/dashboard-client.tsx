"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Layers, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseWithCounts } from "@/lib/access";

interface DashboardClientProps {
  userName: string;
  courses: CourseWithCounts[];
}

export function DashboardClient({ userName, courses }: DashboardClientProps) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Willkommen zurück{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Deine freigeschalteten Lehrgänge im Überblick.
        </p>
      </div>

      {/* Course grid */}
      <div>
        {courses.length === 0 ? (
          <Card className="mx-auto max-w-md border-dashed animate-fade-in-up">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-foreground">
                Noch keine Lehrgänge
              </p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                Du hast noch keine Lehrgänge freigeschaltet. Sobald dir ein
                Lehrgang zugewiesen wird, erscheint er hier.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={course.isExpired ? "#" : `/courses/${course.id}`}
                className={course.isExpired ? "pointer-events-none" : ""}
              >
                <Card
                  className={`group overflow-hidden border-t-4 transition-all duration-200 ${
                    course.isExpired
                      ? "border-t-muted opacity-60 grayscale"
                      : "border-t-primary hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  <div className="relative aspect-[16/9] bg-muted">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url}
                        alt={course.name}
                        fill
                        className={`object-cover transition-transform duration-300 ${
                          course.isExpired ? "" : "group-hover:scale-[1.03]"
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent to-muted">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    {course.isExpired && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Badge
                          variant="destructive"
                          className="text-sm px-3 py-1"
                        >
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          Zugang abgelaufen
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h2
                      className={`font-semibold transition-colors ${
                        course.isExpired
                          ? "text-muted-foreground"
                          : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {course.name}
                    </h2>
                    {course.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {course.category_tags &&
                          course.category_tags.length > 0 &&
                          course.category_tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {tag}
                            </Badge>
                          ))}
                      </div>
                      {!course.isExpired && course.accessibleUnitCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Layers className="h-3 w-3" />
                          {course.accessibleUnitCount} Tage
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
