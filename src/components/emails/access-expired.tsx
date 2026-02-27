import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AccessExpiredEmailProps {
  fullName: string;
  email: string;
  expiredCourses: string[];
}

export const AccessExpiredEmail = ({
  fullName,
  email,
  expiredCourses,
}: AccessExpiredEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Ihr Zugang zum PLI Lernportal ist abgelaufen</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>PLI Lernportal</Heading>
          
          <Text style={greeting}>Hallo {fullName},</Text>
          
          <Text style={text}>
            wir möchten Sie darüber informieren, dass Ihr Zugang zum PLI Lernportal abgelaufen ist.
          </Text>
          
          {expiredCourses.length > 0 && (
            <Section style={expiredSection}>
              <Heading style={h2}>Abgelaufene Kurse</Heading>
              <ul style={courseList}>
                {expiredCourses.map((courseName, index) => (
                  <li key={index} style={courseItem}>
                    {courseName}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          
          <Section style={infoSection}>
            <Text style={text}>
              Für eine Verlängerung Ihres Zugangs wenden Sie sich bitte an:
            </Text>
            
            <div style={contactBox}>
              <Text style={contactText}>
                <strong>Marianne Flury</strong><br />
                Praxis für Lösungs-Impulse<br />
                E-Mail: info@elevize.ai
              </Text>
            </div>
          </Section>
          
          <Text style={helpText}>
            Wir freuen uns darauf, Sie bald wieder im Lernportal begrüßen zu dürfen!
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
  color: "#dc2626", // Red-600
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

const expiredSection = {
  backgroundColor: "#fef2f2", // Red-50
  border: "1px solid #fecaca", // Red-200
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const courseList = {
  margin: "8px 0 0 0",
  padding: "0 0 0 20px",
};

const courseItem = {
  color: "#dc2626", // Red-600
  fontSize: "16px",
  lineHeight: "24px",
  margin: "4px 0",
};

const infoSection = {
  margin: "32px 0",
};

const contactBox = {
  backgroundColor: "#f0fdfa", // Teal-50
  border: "1px solid #5eead4", // Teal-300
  borderRadius: "8px",
  padding: "20px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const contactText = {
  color: "#1f2937", // Gray-800
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const helpText = {
  color: "#6b7280", // Gray-500
  fontSize: "16px",
  lineHeight: "24px",
  margin: "32px 0",
  textAlign: "center" as const,
  fontStyle: "italic",
};

const footer = {
  color: "#6b7280", // Gray-500
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0",
  textAlign: "center" as const,
};