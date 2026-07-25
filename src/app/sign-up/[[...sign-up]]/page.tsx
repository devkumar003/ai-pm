import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        position: "relative",
        padding: "24px",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <SignUp
        appearance={{
          theme: dark,
          variables: {
            colorPrimary: "#facc15",
            colorBackground: "#000000",
          },
          elements: {
            rootBox: { margin: "0 auto" },
            cardBox: {
              backgroundColor: "#000000",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              boxShadow:
                "0 16px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(250, 204, 21, 0.15)",
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
              background: "linear-gradient(135deg, #facc15, #f59e0b)",
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
      />
    </div>
  );
}
