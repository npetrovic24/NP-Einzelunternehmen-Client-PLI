import { Resend } from "resend";
import { WelcomeEmail } from "@/components/emails/welcome";
import { PasswordResetEmail } from "@/components/emails/password-reset";
import { AccessExpiredEmail } from "@/components/emails/access-expired";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "PLI Lernportal <pli@elevize.ai>";

export interface WelcomeEmailData {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "dozent" | "participant";
  courses?: { id: string; name: string }[];
  loginUrl?: string;
}

export interface PasswordResetEmailData {
  fullName: string;
  email: string;
  newPassword: string;
  loginUrl?: string;
}

export interface AccessExpiredEmailData {
  fullName: string;
  email: string;
  expiredCourses?: string[];
}

/**
 * Sends welcome email to new user based on their role
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  try {
    const loginUrl = data.loginUrl || "https://pli-portal.vercel.app/login";
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      subject: getWelcomeSubject(data.role),
      react: WelcomeEmail({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        courses: data.courses || [],
        loginUrl,
      }),
    });

    console.log(`✅ Welcome email sent to ${data.email} (${data.role})`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${data.email}:`, error);
    // Don't throw - email failures shouldn't block user creation
  }
}

/**
 * Sends password reset email
 */
export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
  try {
    const loginUrl = data.loginUrl || "https://pli-portal.vercel.app/login";
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      subject: "Ihr Passwort wurde zurückgesetzt",
      react: PasswordResetEmail({
        fullName: data.fullName,
        email: data.email,
        newPassword: data.newPassword,
        loginUrl,
      }),
    });

    console.log(`✅ Password reset email sent to ${data.email}`);
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${data.email}:`, error);
    // Don't throw - email failures shouldn't block password reset
  }
}

/**
 * Sends access expired email
 */
export async function sendAccessExpiredEmail(data: AccessExpiredEmailData): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [data.email],
      subject: "Ihr Zugang ist abgelaufen",
      react: AccessExpiredEmail({
        fullName: data.fullName,
        email: data.email,
        expiredCourses: data.expiredCourses || [],
      }),
    });

    console.log(`✅ Access expired email sent to ${data.email}`);
  } catch (error) {
    console.error(`❌ Failed to send access expired email to ${data.email}:`, error);
    // Don't throw - email failures shouldn't block access checks
  }
}

/**
 * Gets appropriate welcome email subject based on role
 */
function getWelcomeSubject(role: string): string {
  switch (role) {
    case "admin":
      return "Ihr Admin-Zugang wurde eingerichtet";
    case "dozent":
      return "Sie wurden als Dozent freigeschaltet";
    case "participant":
    default:
      return "Willkommen im Lernportal der Praxis für Lösungs-Impulse";
  }
}