"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Map,
  ListChecks,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Bot,
  Layers,
  Play,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    icon: FileText,
    title: "AI PRD Generator",
    description:
      "Enter a product idea and get a complete PRD with problem statement, features, user stories, and acceptance criteria.",
    gradient: "from-amber-400 to-yellow-500",
  },
  {
    icon: Map,
    title: "Roadmap Generator",
    description:
      "Auto-generate phased roadmaps with milestones, timelines, and feature distribution across sprints.",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    icon: ListChecks,
    title: "Task Breakdown",
    description:
      "Convert features into developer-ready tasks with estimates, dependencies, and acceptance criteria.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Priority Matrix",
    description:
      "AI-powered impact vs. effort analysis to prioritize your backlog with High, Medium, and Low tags.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: MessageSquare,
    title: "AI Product Assistant",
    description:
      'Chat with your product documents. Ask "Summarize my PRD" or "Suggest KPIs" and get instant answers.',
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Kanban Board",
    description:
      "Drag-and-drop task management with visual columns for Backlog, In Progress, Review, and Done.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const stats = [
  { value: "10x", label: "Faster PRD Creation" },
  { value: "85%", label: "Time Saved on Planning" },
  { value: "100%", label: "AI-Powered Insights" },
];

function LiveShowcaseWindow({ mounted }: { mounted: boolean }) {
  const [activeTab, setActiveTab] = useState<"prd" | "roadmap" | "kanban" | "chat">("prd");
  const [typedText, setTypedText] = useState("");
  const fullText = "Create an AI-powered food delivery marketplace with real-time driver tracking, AI meal recommendations, and dynamic surge pricing.";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "prd") return "roadmap";
        if (prev === "roadmap") return "kanban";
        if (prev === "kanban") return "chat";
        return "prd";
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "prd") {
      setTypedText("");
      let index = 0;
      const typeTimer = setInterval(() => {
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index += 2;
        } else {
          clearInterval(typeTimer);
        }
      }, 30);
      return () => clearInterval(typeTimer);
    }
  }, [activeTab]);

  return (
    <div
      className={`glass-card-static gradient-border animate-float ${mounted ? "animate-slide-up delay-400" : ""}`}
      style={{
        maxWidth: "960px",
        margin: "48px auto 0",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.9), 0 0 32px rgba(250, 204, 21, 0.2)",
        border: "1px solid rgba(250, 204, 21, 0.3)",
        background: "#000000",
      }}
    >
      {/* Window Header Bar */}
      <div
        style={{
          padding: "14px 20px",
          background: "rgba(18, 18, 24, 0.8)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: "13px", color: "var(--text-secondary)", marginLeft: "8px", fontWeight: 500 }}>
            ⚡ Orbit AI Workspace — Interactive Live Preview
          </span>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: "6px", background: "#000000", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          {(["prd", "roadmap", "kanban", "chat"] as const).map((tab) => {
            const labelMap = { prd: "📄 PRD Generator", roadmap: "🗺️ Sprint Roadmap", kanban: "📋 Kanban Board", chat: "💬 AI Assistant" };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? "var(--gradient-primary)" : "transparent",
                  color: isActive ? "#000000" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
              >
                {labelMap[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Window Content Area */}
      <div style={{ padding: "28px", minHeight: "280px", textAlign: "left", background: "#000000" }}>
        {activeTab === "prd" && (
          <div className="animate-fade-in">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span className="badge-medium animate-pulse-glow" style={{ padding: "4px 12px", fontSize: "12px" }}>
                <Sparkles size={12} style={{ display: "inline", marginRight: "4px" }} /> AI Generating...
              </span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Target Audience: Drivers & Foodies</span>
            </div>
            <div
              style={{
                padding: "16px",
                borderRadius: "12px",
                background: "rgba(18, 18, 24, 0.7)",
                border: "1px solid rgba(250, 204, 21, 0.2)",
                marginBottom: "20px",
                fontFamily: "monospace",
                fontSize: "14px",
                color: "var(--text-primary)",
                minHeight: "60px",
              }}
            >
              &gt; {typedText}
              <span className="animate-pulse" style={{ display: "inline-block", width: "8px", height: "15px", background: "#facc15", marginLeft: "4px", verticalAlign: "middle" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
              {[
                { title: "Real-time Driver GPS Tracking", status: "Auto-generated" },
                { title: "AI Meal Recommendation Engine", status: "Verified" },
                { title: "Dynamic Surge Pricing Algorithm", status: "High Priority" },
              ].map((feat, i) => (
                <div key={feat.title} className="animate-slide-right" style={{ animationDelay: `${i * 150}ms`, padding: "14px", borderRadius: "10px", background: "#060606", border: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} color="#facc15" />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{feat.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{feat.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="animate-fade-in">
            <h4 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={18} color="#facc15" /> Phased Product Execution Roadmap
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { phase: "Phase 1: Core Marketplace Engine", timeline: "Q1 2026", progress: "85%", width: "85%", color: "#facc15" },
                { phase: "Phase 2: AI Recommendation Layer", timeline: "Q2 2026", progress: "50%", width: "50%", color: "#fbbf24" },
                { phase: "Phase 3: Autonomous Fleet Dispatch", timeline: "Q3 2026", progress: "20%", width: "20%", color: "#f59e0b" },
              ].map((m, i) => (
                <div key={m.phase} className="animate-slide-up" style={{ animationDelay: `${i * 150}ms`, padding: "14px", borderRadius: "12px", background: "#060606", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{m.phase} ({m.timeline})</span>
                    <span style={{ color: "#facc15", fontWeight: 600 }}>{m.progress}</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "999px", overflow: "hidden" }}>
                    <div className="animate-pulse-glow" style={{ width: m.width, height: "100%", background: `linear-gradient(90deg, #facc15, ${m.color})`, borderRadius: "999px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "kanban" && (
          <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { col: "📝 To Do", color: "#facc15", cards: ["GPS Driver App UI Setup", "Stripe Checkout Integration"] },
              { col: "🚧 In Progress", color: "#f59e0b", cards: ["AI Surge Pricing Model", "User Notification Engine"] },
              { col: "✅ Done", color: "#10b981", cards: ["PRD Requirements Spec", "Database Architecture"] },
            ].map((col, idx) => (
              <div key={col.col} className="animate-bounce-subtle" style={{ animationDelay: `${idx * 200}ms`, background: "#060606", borderRadius: "12px", padding: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: col.color, marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{col.col}</span>
                  <span style={{ background: "rgba(255, 255, 255, 0.08)", padding: "2px 6px", borderRadius: "6px", fontSize: "11px", color: "var(--text-secondary)" }}>{col.cards.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.cards.map((c) => (
                    <div key={c} style={{ padding: "10px", background: "#000000", borderRadius: "8px", border: "1px solid rgba(250, 204, 21, 0.15)", fontSize: "12px", color: "var(--text-primary)", fontWeight: 500 }}>
                      {c}
                      <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", background: "rgba(250, 204, 21, 0.15)", color: "#facc15", padding: "2px 6px", borderRadius: "4px" }}>High Impact</span>
                        <Check size={12} color="#facc15" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "chat" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="animate-slide-right" style={{ alignSelf: "flex-end", maxWidth: "80%", padding: "12px 16px", borderRadius: "14px", borderTopRightRadius: "4px", background: "rgba(250, 204, 21, 0.15)", border: "1px solid rgba(250, 204, 21, 0.3)", fontSize: "13px", color: "var(--text-primary)" }}>
              Summarize the core surge pricing acceptance criteria from my PRD.
            </div>
            <div className="animate-slide-up" style={{ alignSelf: "flex-start", maxWidth: "85%", padding: "14px 18px", borderRadius: "14px", borderTopLeftRadius: "4px", background: "#060606", border: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "13px", color: "var(--text-primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", color: "#facc15", fontWeight: 600 }}>
                <Sparkles size={14} /> AI Product Assistant
              </div>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                ✨ <strong>Surge Pricing Criteria:</strong><br />
                1. Multiplier automatically adjusts when order-to-driver ratio exceeds 1.8x within a 3km radius.<br />
                2. Price cap is enforced at 2.5x base fare to prevent user drop-off.<br />
                3. Real-time push notifications alert users before confirmation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Ambient background blobs & floating golden particles */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          className="animate-float-slow animate-glow-pulse"
          style={{
            position: "absolute",
            top: "-15%",
            left: "-10%",
            width: "650px",
            height: "650px",
            background:
              "radial-gradient(circle, rgba(250, 204, 21, 0.09) 0%, transparent 70%)",
            filter: "blur(85px)",
          }}
        />
        <div
          className="animate-float-reverse animate-glow-pulse"
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "550px",
            height: "550px",
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
            filter: "blur(85px)",
          }}
        />
        <div
          className="animate-pulse-glow"
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "850px",
            height: "450px",
            background:
              "radial-gradient(ellipse, rgba(250, 204, 21, 0.05) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />

        {/* Floating Golden Dust Particles */}
        <div className="animate-float delay-100" style={{ position: "absolute", top: "20%", left: "15%", width: 6, height: 6, borderRadius: "50%", background: "#facc15", opacity: 0.4, boxShadow: "0 0 12px #facc15" }} />
        <div className="animate-float-slow delay-300" style={{ position: "absolute", top: "60%", right: "20%", width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", opacity: 0.3, boxShadow: "0 0 16px #fbbf24" }} />
        <div className="animate-float-reverse delay-500" style={{ position: "absolute", bottom: "30%", left: "25%", width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", opacity: 0.5, boxShadow: "0 0 10px #f59e0b" }} />
        <div className="animate-float delay-200" style={{ position: "absolute", top: "45%", right: "12%", width: 7, height: 7, borderRadius: "50%", background: "#facc15", opacity: 0.35, boxShadow: "0 0 14px #facc15" }} />
      </div>

      {/* Navigation */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            className="animate-pulse-glow"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={20} color="#09090b" />
          </div>
          <span
            style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Orbit AI
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isSignedIn ? (
            <Link href="/dashboard" className="btn-primary animate-pulse-glow">
              Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="btn-ghost">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary animate-pulse-glow">
                Get Started Free <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "70px 30px 50px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
        className={mounted ? "animate-fade-in" : ""}
      >


        {/* Staggered Heading Reveal */}
        <h1
          className={mounted ? "animate-slide-up delay-100" : ""}
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 4.3rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-0.02em",
          }}
        >
          Your AI-Powered{" "}
          <span
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            className="animate-gradient"
          >
            Product Management
          </span>{" "}
          Workspace
        </h1>

        <p
          className={mounted ? "animate-slide-up delay-200" : ""}
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            maxWidth: "660px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          Generate PRDs, roadmaps, sprint plans, and task breakdowns in seconds — not hours. Let AI handle the heavy lifting while you focus on strategy.
        </p>

        {/* Staggered CTA Buttons */}
        <div
          className={mounted ? "animate-slide-up delay-300" : ""}
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="btn-primary animate-pulse-glow"
            style={{ padding: "15px 36px", fontSize: "16px", borderRadius: "999px" }}
          >
            <Sparkles size={18} />
            Start Building Free
          </Link>
          <a
            href="#features"
            className="btn-secondary"
            style={{ padding: "15px 36px", fontSize: "16px", borderRadius: "999px", borderColor: "rgba(250, 204, 21, 0.25)" }}
          >
            See Features
            <ChevronRight size={18} />
          </a>
        </div>

        {/* Animated Live Showcase Window */}
        <LiveShowcaseWindow mounted={mounted} />

        {/* Staggered Animated Stats Row */}
        <div
          className={mounted ? "animate-slide-up delay-500" : ""}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "56px",
            marginTop: "64px",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                transition: "transform 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div
                style={{
                  fontSize: "40px",
                  fontWeight: 800,
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animated Features Grid */}
      <section
        id="features"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 40px",
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            className={mounted ? "animate-slide-up" : ""}
            style={{
              fontSize: "34px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Everything you need to{" "}
            <span
              style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ship faster
            </span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
            AI-powered tools that transform how product managers work
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`feature-card-interactive glass-card ${mounted ? "animate-slide-up" : ""}`}
              style={{
                padding: "32px",
                animationDelay: `${index * 120}ms`,
                animationFillMode: "backwards",
                cursor: "default",
                borderRadius: "20px",
              }}
            >
              <div
                className="feature-icon-wrapper"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, var(--primary), var(--accent))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  boxShadow: "0 0 16px rgba(250, 204, 21, 0.25)",
                }}
              >
                <feature.icon size={26} color="#000000" />
              </div>
              <h3
                style={{
                  fontSize: "19px",
                  fontWeight: 600,
                  marginBottom: "10px",
                  color: "var(--text-primary)",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Animated How it works */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 40px",
          maxWidth: "1060px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2 style={{ fontSize: "34px", fontWeight: 700, marginBottom: "16px" }}>
            How it works
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
            From idea to execution in three simple steps
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            position: "relative",
          }}
        >
          {[
            {
              step: "01",
              icon: Zap,
              title: "Describe Your Idea",
              desc: 'Type something like "Build a food delivery app" and let AI do the rest.',
            },
            {
              step: "02",
              icon: Shield,
              title: "Review & Refine",
              desc: "AI generates your PRD, roadmap, and tasks. Customize anything you want.",
            },
            {
              step: "03",
              icon: Clock,
              title: "Execute & Track",
              desc: "Use the Kanban board to manage tasks and chat with AI for ongoing support.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              style={{ textAlign: "center", position: "relative" }}
              className={`step-card-interactive ${mounted ? "animate-slide-up" : ""}`}
            >
              <div
                className="animate-pulse-glow"
                style={{
                  fontSize: "52px",
                  fontWeight: 800,
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "16px",
                  opacity: 0.45,
                }}
              >
                {item.step}
              </div>
              <div
                className="step-icon-wrapper"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid rgba(250, 204, 21, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 0 16px rgba(250, 204, 21, 0.12)",
                }}
              >
                <item.icon size={26} color="#facc15" />
              </div>
              <h3
                style={{
                  fontSize: "19px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Animated CTA Section */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card-static gradient-border animate-pulse-glow feature-card-interactive"
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            padding: "64px 40px",
            textAlign: "center",
            borderRadius: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Ready to 10x your product management?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "36px",
              fontSize: "16px",
            }}
          >
            Join the future of product management. Start generating PRDs in seconds.
          </p>
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="btn-primary animate-pulse-glow"
            style={{ padding: "16px 38px", fontSize: "16px", borderRadius: "999px" }}
          >
            <Sparkles size={18} />
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          padding: "32px 40px",
          borderTop: "1px solid var(--border-default)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          color: "var(--text-muted)",
          fontSize: "13px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Sparkles size={14} color="var(--primary)" />
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>AI Product Manager</span>
        </div>

      </footer>
    </div>
  );
}

