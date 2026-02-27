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

interface PasswordResetEmailProps {
  fullName: string;
  email: string;
  newPassword: string;
  loginUrl: string;
}

export const PasswordResetEmail = ({
  fullName,
  email,
  newPassword,
  loginUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Ihr Passwort wurde zurückgesetzt - PLI Lernportal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>PLI Lernportal</Heading>
          
          <Text style={greeting}>Hallo {fullName},</Text>
          
          <Text style={text}>
            Ihr Passwort für das PLI Lernportal wurde erfolgreich zurückgesetzt.
          </Text>
          
          <Section style={credentialsSection}>
            <Heading style={h2}>Ihre neuen Zugangsdaten</Heading>
            <Text style={credentials}>
              <strong>E-Mail:</strong> {email}<br />
              <strong>Neues Passwort:</strong> {newPassword}
            </Text>
          </Section>
          
          <Section style={buttonSection}>
            <Link href={loginUrl} style={button}>
              Jetzt anmelden
            </Link>
          </Section>
          
          <Section style={warningSection}>
            <Text style={warningText}>
              <strong>Wichtiger Sicherheitshinweis:</strong><br />
              Bitte ändern Sie Ihr Passwort nach der Anmeldung zu einem eigenen, sicheren Passwort.
            </Text>
          </Section>
          
          <Text style={helpText}>
            Falls Sie diese Passwort-Änderung nicht veranlasst haben, wenden Sie sich bitte 
            umgehend an Ihren Administrator oder an Marianne Flury.
          </Text>
          
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

const warningSection = {
  backgroundColor: "#fef3c7", // Amber-100
  border: "1px solid #f59e0b", // Amber-500
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const warningText = {
  color: "#92400e", // Amber-800
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const helpText = {
  color: "#6b7280", // Gray-500
  fontSize: "14px",
  lineHeight: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const footer = {
  color: "#6b7280", // Gray-500
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0",
  textAlign: "center" as const,
};