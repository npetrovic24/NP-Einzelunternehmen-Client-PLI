import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  fullName: string;
  email: string;
  password?: string;
  passwordSetLink?: string;
  role: "admin" | "dozent" | "participant";
  courses: { id: string; name: string }[];
  loginUrl: string;
}

export const WelcomeEmail = ({
  fullName,
  email,
  password,
  passwordSetLink,
  role,
  courses,
  loginUrl,
}: WelcomeEmailProps) => {
  const getGreeting = () => {
    switch (role) {
      case "admin":
        return "Ihr Admin-Zugang zum PLI Lernportal wurde erfolgreich eingerichtet.";
      case "dozent":
        return "Sie wurden als Dozent im PLI Lernportal freigeschaltet.";
      case "participant":
      default:
        return "Herzlich willkommen im Lernportal der Praxis für Lösungs-Impulse!";
    }
  };

  const getAdditionalInfo = () => {
    switch (role) {
      case "admin":
        return "Sie haben Zugriff auf das Admin-Panel zur Verwaltung aller Benutzer und Inhalte.";
      case "dozent":
        return "Sie können Teilnehmer verwalten und haben Zugriff auf alle Kursinhalte.";
      case "participant":
      default:
        return "Wir freuen uns, Sie in unserem Lernportal begrüßen zu dürfen.";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>
        {role === "participant"
          ? "Willkommen im PLI Lernportal!"
          : `Ihr ${role === "admin" ? "Admin-" : "Dozenten-"}Zugang wurde eingerichtet`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>PLI Lernportal</Heading>
          
          <Text style={greeting}>Hallo {fullName},</Text>
          
          <Text style={text}>{getGreeting()}</Text>
          
          <Text style={text}>{getAdditionalInfo()}</Text>
          
          <Section style={credentialsSection}>
            <Heading style={h2}>Ihre Zugangsdaten</Heading>
            {passwordSetLink ? (
              <>
                <Text style={credentials}>
                  <strong>E-Mail:</strong> {email}
                </Text>
                <Text style={text}>
                  Bitte klicken Sie auf den folgenden Button, um Ihr persönliches Passwort festzulegen:
                </Text>
                <Section style={buttonSection}>
                  <Link href={passwordSetLink} style={button}>
                    Passwort setzen
                  </Link>
                </Section>
              </>
            ) : (
              <Text style={credentials}>
                <strong>E-Mail:</strong> {email}<br />
                <strong>Passwort:</strong> {password}
              </Text>
            )}
          </Section>
          
          {courses.length > 0 && role === "participant" && (
            <Section style={coursesSection}>
              <Heading style={h2}>Ihre zugewiesenen Kurse</Heading>
              <ul style={courseList}>
                {courses.map((course) => (
                  <li key={course.id} style={courseItem}>
                    {course.name}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          
          {!passwordSetLink && (
            <Section style={buttonSection}>
              <Link href={loginUrl} style={button}>
                Jetzt anmelden
              </Link>
            </Section>
          )}
          
          <Text style={helpText}>
            {role === "participant" 
              ? "Sollten Sie Fragen haben, wenden Sie sich gerne an Marianne Flury."
              : "Bei Fragen stehen wir Ihnen gerne zur Verfügung."
            }
          </Text>
          
          {!passwordSetLink && (
            <Text style={securityNote}>
              <strong>Sicherheitshinweis:</strong> Bitte ändern Sie Ihr Passwort nach der ersten Anmeldung.
            </Text>
          )}
          
          <Text style={footer}>
            Mit freundlichen Grüßen<br />
            Ihr Team der Praxis für Lösungs-Impulse
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const h1 = {
  color: "#0d9488", // Teal-600
  fontSize: "28px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const h2 = {
  color: "#0f766e", // Teal-700
  fontSize: "18px",
  fontWeight: "bold",
  margin: "16px 0 8px",
};

const greeting = {
  color: "#1f2937", // Gray-800
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const text = {
  color: "#374151", // Gray-700
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const credentialsSection = {
  backgroundColor: "#f0fdfa", // Teal-50
  border: "1px solid #5eead4", // Teal-300
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const credentials = {
  color: "#1f2937", // Gray-800
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
  fontFamily: "monospace",
};

const coursesSection = {
  margin: "24px 0",
};

const courseList = {
  margin: "8px 0 0 0",
  padding: "0 0 0 20px",
};

const courseItem = {
  color: "#374151", // Gray-700
  fontSize: "16px",
  lineHeight: "24px",
  margin: "4px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0d9488", // Teal-600
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  lineHeight: "50px",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "0 32px",
};

const helpText = {
  color: "#6b7280", // Gray-500
  fontSize: "14px",
  lineHeight: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const securityNote = {
  color: "#dc2626", // Red-600
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const footer = {
  color: "#6b7280", // Gray-500
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0",
  textAlign: "center" as const,
};