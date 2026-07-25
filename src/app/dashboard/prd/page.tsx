"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  Target,
  Users,
  Layers,
  BookOpen,
  BarChart,
  AlertTriangle,
  Clock,
  Mic,
  MicOff,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { PRDContent } from "@/types";

export default function PRDPage() {
  const { activeProject, activePRD, setActivePRD, setActiveProject } = useProjectStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const prdRef = useRef<HTMLDivElement>(null);

  const prdContent = activePRD?.content as PRDContent | undefined;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          projectId: activeProject?.id,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActivePRD(json.data.prd);
        if (!activeProject) {
          // Refresh to get the new project
          const projRes = await fetch(`/api/projects/${json.data.projectId}`);
          const projJson = await projRes.json();
          if (projJson.success) {
            setActiveProject(projJson.data.project);
          }
        }
      } else {
        alert(json.error || "Failed to generate PRD");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate PRD. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleExportPDF() {
    if (!prdRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const canvas = await html2canvas(prdRef.current, {
      scale: 2,
      backgroundColor: "#000000",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(`${activePRD?.title || "PRD"}.pdf`);
  }

  function toggleVoiceInput() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    const recognition = new (SpeechRecognition as new () => SpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setPrompt((prev) => prev + " " + transcript);
    };

    recognition.start();

    // Auto-stop after 30 seconds
    setTimeout(() => {
      recognition.stop();
      setIsListening(false);
    }, 30000);
  }

  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onend: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    start: () => void;
    stop: () => void;
  }

  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1
          className="font-serif"
          style={{
            fontSize: "42px",
            fontWeight: 500,
            marginBottom: "14px",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <FileText size={38} color="#f1f1f4" />
          AI PRD Generator
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", letterSpacing: "0.01em" }}>
          Describe your product idea and AI will generate a comprehensive PRD.
        </p>
      </div>

      {/* Input Card Container */}
      <div className="input-card" style={{ padding: "32px", marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 500,
            marginBottom: "20px",
            color: "var(--text-primary)",
          }}
        >
          What do you want to build?
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g., "Build a food delivery app that connects local restaurants with customers for fast delivery"'
          style={{
            width: "100%",
            minHeight: "160px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "15px",
            lineHeight: "1.6",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />

        {isListening && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              fontSize: "13px",
              color: "#ef4444",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ef4444",
                animation: "pulse-glow 1s ease-in-out infinite",
              }}
            />
            Listening... Speak your product idea
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "28px",
            paddingTop: "4px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="btn-gold-pill"
              style={{ opacity: isGenerating || !prompt.trim() ? 0.6 : 1 }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw
                    size={16}
                    style={{ animation: "spin-slow 1s linear infinite" }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate PRD
                </>
              )}
            </button>

            {prdContent && (
              <button onClick={handleExportPDF} className="btn-secondary" style={{ borderRadius: "9999px" }}>
                <Download size={16} /> Export PDF
              </button>
            )}
          </div>

          <button
            onClick={toggleVoiceInput}
            style={{
              background: isListening ? "rgba(239, 68, 68, 0.15)" : "transparent",
              border: "none",
              color: isListening ? "#ef4444" : "var(--text-secondary)",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)",
            }}
            title="Voice input"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
        </div>
      </div>

      {/* Quick suggestions below card */}
      <div
        style={{
          display: "flex",
          gap: "28px",
          marginTop: "20px",
          marginBottom: "40px",
          flexWrap: "wrap",
          alignItems: "center",
          paddingLeft: "8px",
        }}
      >
        {[
          "Build a food delivery app",
          "Create a project management tool",
          "Design a fitness tracking platform",
          "Build an AI tutoring system",
        ].map((suggestion) => (
          <span
            key={suggestion}
            onClick={() => setPrompt(suggestion)}
            className="suggestion-chip"
          >
            {suggestion}
          </span>
        ))}
      </div>

      {/* Loading Animation */}
      {isGenerating && (
        <div
          className="glass-card-static"
          style={{
            padding: "60px 40px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              borderRadius: "16px",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          >
            <Sparkles size={28} color="white" />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            AI is crafting your PRD...
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Analyzing requirements, generating features, and creating user stories
          </p>
          <div
            className="ai-thinking"
            style={{ justifyContent: "center", marginTop: "20px" }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* PRD Output */}
      {prdContent && !isGenerating && (
        <div ref={prdRef}>
          {/* Title */}
          <div
            className="glass-card-static gradient-border"
            style={{ padding: "32px", marginBottom: "24px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div className="badge badge-status">AI Generated</div>
              {activeProject && (
                <div className="badge badge-medium">{activeProject.name}</div>
              )}
            </div>
            <h2 className="font-serif" style={{ fontSize: "32px", fontWeight: 500, color: "var(--text-primary)" }}>
              {activePRD?.title}
            </h2>
          </div>

          {/* Sections Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Problem Statement */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "var(--primary-light)",
                }}
              >
                <Target size={18} /> Problem Statement
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {prdContent.problemStatement}
              </p>
            </div>

            {/* Target Audience */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "#fbbf24",
                }}
              >
                <Users size={18} /> Target Audience
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                {prdContent.targetAudience}
              </p>
            </div>

            {/* Objectives */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "#10b981",
                }}
              >
                <CheckCircle2 size={18} /> Objectives
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {prdContent.objectives?.map((obj, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      color="#10b981"
                      style={{ marginTop: "3px", minWidth: "14px" }}
                    />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div
              className="glass-card-static"
              style={{ padding: "24px", gridColumn: "1 / -1" }}
            >
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "#f59e0b",
                }}
              >
                <Layers size={18} /> Features
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "12px",
                }}
              >
                {prdContent.features?.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        {feature.name}
                      </span>
                      <span className={`badge badge-${feature.priority}`}>
                        {feature.priority}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </p>
                    {feature.category && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          background: "var(--bg-secondary)",
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {feature.category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* User Stories */}
            <div
              className="glass-card-static"
              style={{ padding: "24px", gridColumn: "1 / -1" }}
            >
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "#f59e0b",
                }}
              >
                <BookOpen size={18} /> User Stories
              </h3>
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {prdContent.userStories?.map((story, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-default)",
                      borderLeft: "3px solid #f59e0b",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-primary)",
                        marginBottom: "8px",
                      }}
                    >
                      As a <strong>{story.persona}</strong>, I want to{" "}
                      <strong>{story.action}</strong> so that{" "}
                      <strong>{story.benefit}</strong>.
                    </p>
                    {story.acceptanceCriteria?.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            marginBottom: "4px",
                            fontWeight: 600,
                          }}
                        >
                          Acceptance Criteria:
                        </div>
                        {story.acceptanceCriteria.map((ac, j) => (
                          <div
                            key={j}
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "6px",
                              marginTop: "4px",
                            }}
                          >
                            <CheckCircle2
                              size={12}
                              color="var(--text-muted)"
                              style={{ marginTop: "2px", minWidth: "12px" }}
                            />
                            {ac}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "#06b6d4",
                }}
              >
                <BarChart size={18} /> Success Metrics
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {prdContent.successMetrics?.map((metric, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <BarChart
                      size={14}
                      color="#06b6d4"
                      style={{ marginTop: "3px", minWidth: "14px" }}
                    />
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            {/* Constraints & Timeline */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "#ef4444",
                }}
              >
                <AlertTriangle size={18} /> Constraints
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                {prdContent.constraints?.map((c, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <AlertTriangle
                      size={14}
                      color="#ef4444"
                      style={{ marginTop: "3px", minWidth: "14px" }}
                    />
                    {c}
                  </li>
                ))}
              </ul>
              {prdContent.timeline && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Clock size={16} color="var(--primary-light)" />
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      Estimated Timeline
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                      {prdContent.timeline}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
