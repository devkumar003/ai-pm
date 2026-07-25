import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Orbit AI | Smart Workspace for Product Managers",
  description:
    "AI-powered workspace that helps Product Managers generate PRDs, roadmaps, sprint plans, task breakdowns, and priority matrices in seconds.",
  keywords: [
    "product management",
    "AI",
    "PRD generator",
    "roadmap",
    "sprint planning",
    "task management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "#facc15",
          colorBackground: "#000000",
          borderRadius: "12px",
        },
        elements: {
          rootBox: {
            color: "#f1f1f4",
          },
          cardBox: {
            backgroundColor: "#000000",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(250, 204, 21, 0.15)",
          },
          card: {
            backgroundColor: "#000000",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6)",
          },
          headerTitle: {
            color: "#f1f1f4",
            fontSize: "1.35rem",
            fontWeight: "700",
          },
          headerSubtitle: {
            color: "#9ca3af",
          },
          socialButtonsBlockButton: {
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#f1f1f4",
          },
          socialButtonsBlockButtonText: {
            color: "#f1f1f4",
            fontWeight: "500",
          },
          dividerLine: {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
          dividerText: {
            color: "#6b7280",
          },
          formFieldLabel: {
            color: "#f1f1f4",
            fontWeight: "500",
          },
          formFieldInput: {
            backgroundColor: "#0a0a0a",
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "#f1f1f4",
          },
          formButtonPrimary: {
            background: "linear-gradient(135deg, #fde047, #facc15, #eab308)",
            border: "none",
            color: "#09090b",
            fontWeight: "600",
            boxShadow: "0 0 20px rgba(250, 204, 21, 0.3)",
          },
          footer: {
            backgroundColor: "#000000",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          },
          footerAction: {
            backgroundColor: "#000000",
          },
          footerActionText: {
            color: "#9ca3af",
          },
          footerActionLink: {
            color: "#facc15",
            fontWeight: "600",
          },
        },
      }}
    >
      <html lang="en" data-theme="dark">
        <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
