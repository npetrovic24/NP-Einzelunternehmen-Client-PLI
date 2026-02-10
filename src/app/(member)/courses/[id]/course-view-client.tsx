"use client";

import { Lock } from "lucide-react";
import type { Course, Module, Unit } from "@/lib/types";

interface UnitWithAccess extends Unit {
  hasAccess: boolean;
}

interface ModuleWithAccess extends Module {
  hasAccess: boolean;
}

interface CourseViewClientProps {
  course: Course;
  modules: ModuleWithAccess[];
  units: UnitWithAccess[];
  currentUnitId: string | null;
}

export function CourseViewClient({ course }: CourseViewClientProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in-up">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent">
        <Lock className="h-10 w-10 text-primary/60" />
      </div>
      <h2 className="text-lg font-semibold">{course.name}</h2>
      {course.description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {course.description}
        </p>
      )}
      <p className="mt-4 text-sm text-muted-foreground max-w-sm">
        Dieser Lehrgang hat noch keine freigeschalteten Inhalte.
        Bitte kontaktiere deinen Administrator.
      </p>
    </div>
  );
}
