"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Course, Profile, AccessGrant } from "@/lib/types";
import { setAccessGrant, updateGrantExpiration, setCourseAccessForAll } from "@/lib/actions/access";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  CalendarIcon,
  X,
} from "lucide-react";

interface CourseAccessClientProps {
  course: Course;
  members: Profile[];
  initialGrants: AccessGrant[];
}

export function CourseAccessClient({
  course,
  members,
  initialGrants,
}: CourseAccessClientProps) {
  const [grants, setGrants] = useState(initialGrants);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  function getMemberGrant(memberId: string): AccessGrant | undefined {
    return grants.find((g) => g.user_id === memberId);
  }

  function isMemberGranted(memberId: string): boolean {
    const grant = getMemberGrant(memberId);
    return grant ? grant.is_granted : false;
  }

  function isMemberExpired(memberId: string): boolean {
    const grant = getMemberGrant(memberId);
    if (!grant || !grant.is_granted || !grant.expires_at) return false;
    return new Date(grant.expires_at) < new Date();
  }

  const grantedCount = members.filter((m) => isMemberGranted(m.id) && !isMemberExpired(m.id)).length;

  async function handleToggle(memberId: string, newValue: boolean) {
    setLoadingIds((prev) => new Set([...prev, memberId]));

    const result = await setAccessGrant({
      userId: memberId,
      courseId: course.id,
      isGranted: newValue,
    });

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      setGrants((prev) => {
        const existing = prev.findIndex((g) => g.user_id === memberId);
        if (existing >= 0) {
          return prev.map((g, i) =>
            i === existing ? { ...g, is_granted: newValue } : g
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            user_id: memberId,
            course_id: course.id,
            module_id: null,
            unit_id: null,
            is_granted: newValue,
            expires_at: null,
            created_at: new Date().toISOString(),
          },
        ];
      });
    }

    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(memberId);
      return next;
    });
  }

  async function handleExpirationChange(memberId: string, date: Date | undefined) {
    const expiresAt = date ? date.toISOString() : null;
    setLoadingIds((prev) => new Set([...prev, `exp-${memberId}`]));

    const result = await updateGrantExpiration({
      userId: memberId,
      courseId: course.id,
      expiresAt,
    });

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      setGrants((prev) =>
        prev.map((g) =>
          g.user_id === memberId ? { ...g, expires_at: expiresAt } : g
        )
      );
    }

    setLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(`exp-${memberId}`);
      return next;
    });
  }

  async function handleBulkAction(isGranted: boolean) {
    setBulkLoading(true);

    const result = await setCourseAccessForAll(course.id, isGranted);

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      setGrants(
        members.map((m) => ({
          id: crypto.randomUUID(),
          user_id: m.id,
          course_id: course.id,
          module_id: null,
          unit_id: null,
          is_granted: isGranted,
          expires_at: null,
          created_at: new Date().toISOString(),
        }))
      );
      toast.success(
        isGranted
          ? "Alle Teilnehmer freigeschaltet."
          : "Alle Teilnehmer gesperrt."
      );
    }

    setBulkLoading(false);
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-2" asChild>
          <Link href={`/admin/courses/${course.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zu {course.name}
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Zugriffe: {course.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {grantedCount} von {members.length} Teilnehmern freigeschaltet
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction(true)}
              disabled={bulkLoading}
            >
              {bulkLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Alle freischalten
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction(false)}
              disabled={bulkLoading}
            >
              {bulkLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Alle sperren
            </Button>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              Noch keine Teilnehmer
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gültig bis</TableHead>
                <TableHead className="text-right">Zugriff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const hasAccess = isMemberGranted(member.id);
                const expired = isMemberExpired(member.id);
                const grant = getMemberGrant(member.id);
                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.full_name || "–"}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {expired ? (
                        <Badge variant="destructive">Abgelaufen</Badge>
                      ) : hasAccess ? (
                        <span className="inline-flex items-center gap-1 text-sm text-green-600">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                          Freigeschaltet
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-red-500">
                          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                          Gesperrt
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {hasAccess && (
                        <div className="flex items-center gap-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                disabled={loadingIds.has(`exp-${member.id}`)}
                              >
                                {loadingIds.has(`exp-${member.id}`) ? (
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                ) : (
                                  <CalendarIcon className="mr-1 h-3 w-3" />
                                )}
                                {grant?.expires_at
                                  ? new Date(grant.expires_at).toLocaleDateString("de-CH")
                                  : "Kein Ablauf"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  grant?.expires_at
                                    ? new Date(grant.expires_at)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  handleExpirationChange(member.id, date)
                                }
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          {grant?.expires_at && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleExpirationChange(member.id, undefined)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {loadingIds.has(member.id) && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        <Switch
                          checked={hasAccess && !expired}
                          onCheckedChange={(v) =>
                            handleToggle(member.id, v)
                          }
                          disabled={loadingIds.has(member.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
