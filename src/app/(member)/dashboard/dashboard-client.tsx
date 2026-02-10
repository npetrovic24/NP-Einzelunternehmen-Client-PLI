"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, Layers } from "lucide-react";
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
      {/* Hero section */}
      <div className="bg-gradient-to-r from-[#0099A8] to-[#007A87] px-6 py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold text-white lg:text-3xl">
            Willkommen zurück{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-2 text-white/80">
            Deine freigeschalteten Lehrgänge im Überblick.
          </p>
        </div>
      </div>

      {/* Course grid */}
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
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
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="group overflow-hidden border-t-4 border-t-primary transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  <div className="relative aspect-[16/9] bg-muted">
                    {course.thumbnail_url ? (
                      <Image
                        src={course.thumbnail_url}
                        alt={course.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent to-muted">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
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
                      {course.accessibleUnitCount > 0 && (
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
