export type UserRole = "admin" | "dozent" | "participant";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  category_tags: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Unit {
  id: string;
  course_id: string;
  module_id: string | null;
  name: string;
  sort_order: number;
  created_at: string;
}

export type ContentBlockType = "canva_embed" | "file" | "text" | "link";

export interface ContentBlock {
  id: string;
  unit_id: string;
  type: ContentBlockType;
  content: Record<string, unknown>;
  sort_order: number;
  created_at: string;
}

export interface AccessGrant {
  id: string;
  user_id: string;
  course_id: string | null;
  module_id: string | null;
  unit_id: string | null;
  is_granted: boolean;
  expires_at: string | null;
  created_at: string;
}

// PLI-10: Reflexionen & KI-Feedback

export interface Assignment {
  id: string;
  unit_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export type SubmissionStatus = "pending" | "in_review" | "reviewed";

export interface Submission {
  id: string;
  user_id: string;
  assignment_id: string;
  content: string;
  file_url: string | null;
  status: SubmissionStatus;
  assigned_to: string | null;
  submitted_at: string;
}

export interface SubmissionWithDetails extends Submission {
  user?: Pick<Profile, "id" | "full_name" | "email">;
  assignment?: Assignment & {
    unit?: Unit & {
      course?: Course;
      module?: Module | null;
    };
  };
  feedback?: Feedback[];
}

export interface Feedback {
  id: string;
  submission_id: string;
  reviewer_id: string;
  content: string;
  is_ai_generated: boolean;
  created_at: string;
  reviewer?: Pick<Profile, "id" | "full_name">;
}
