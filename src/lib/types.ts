export type UserRole = "admin" | "participant";

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
