"use client";

import { useState } from "react";
import {
  Map,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { RoadmapPhase } from "@/types";

const phaseColors = ["#facc15", "#fbbf24", "#f59e0b", "#d97706"];

export default function RoadmapPage() {
  const { activeProject, activeRoadmap, setActiveRoadmap, activePRD } =
    useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const phases = (activeRoadmap?.phases as RoadmapPhase[]) || [];

  async function handleGenerate() {
    if (!activeProject) {
      alert("Please create a project and generate a PRD first.");
      return;
    }
    if (!activePRD) {
      alert("Please generate a PRD first before creating a roadmap.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.id }),
      });
      const json = await res.json();
      if (json.success) {
        setActiveRoadmap(json.data);
      } else {
        alert(json.error || "Failed to generate roadmap");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "36px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            className="font-serif"
            style={{ fontSize: "42px", fontWeight: 500, marginBottom: "12px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "16px" }}
          >
            <Map size={38} color="#facc15" />
            Product Roadmap
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            {activeProject
              ? `Roadmap for ${activeProject.name}`
              : "Generate a PRD first to create a roadmap"}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !activeProject}
          className="btn-gold-pill"
          style={{ opacity: isGenerating || !activeProject ? 0.6 : 1 }}
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
              <Sparkles size={16} />{" "}
              {phases.length > 0 ? "Regenerate" : "Generate"} Roadmap
            </>
          )}
        </button>
      </div>

      {/* Loading */}
      {isGenerating && (
        <div
          className="input-card"
          style={{ padding: "60px", textAlign: "center", marginBottom: "32px" }}
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
            <Map size={28} color="#09090b" />
          </div>
          <h3 className="font-serif" style={{ fontSize: "24px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}>
            Building your roadmap...
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Analyzing PRD features and creating phased delivery plan
          </p>
          <div
            className="ai-thinking"
            style={{ justifyContent: "center", marginTop: "24px" }}
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && phases.length === 0 && (
        <div
          className="input-card"
          style={{ padding: "60px", textAlign: "center", marginBottom: "32px" }}
        >
          <Map
            size={48}
            color="#facc15"
            style={{ marginBottom: "16px", opacity: 0.8 }}
          />
          <h3
            className="font-serif"
            style={{ fontSize: "24px", fontWeight: 500, marginBottom: "12px", color: "var(--text-primary)" }}
          >
            No roadmap yet
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            {activeProject
              ? "Click 'Generate Roadmap' to create an AI-powered product roadmap from your PRD."
              : "Create a project and generate a PRD first, then come back here."}
          </p>
        </div>
      )}

      {/* Timeline */}
      {!isGenerating && phases.length > 0 && (
        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              left: "24px",
              top: "40px",
              bottom: "40px",
              width: "2px",
              background:
                "linear-gradient(to bottom, var(--primary), var(--accent), #facc15, #f59e0b)",
              opacity: 0.3,
            }}
          />

          {phases.map((phase, index) => {
            const color = phaseColors[index % phaseColors.length];
            const isExpanded = expandedPhase === phase.id;

            return (
              <div
                key={phase.id || index}
                className="animate-slide-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "backwards",
                  position: "relative",
                  paddingLeft: "56px",
                  marginBottom: "24px",
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "24px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: color,
                    border: "3px solid var(--bg-primary)",
                    boxShadow: `0 0 12px ${color}60`,
                    zIndex: 2,
                  }}
                />

                <div className="glass-card-static" style={{ overflow: "hidden" }}>
                  {/* Phase Header */}
                  <div
                    style={{
                      padding: "20px 24px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() =>
                      setExpandedPhase(isExpanded ? null : phase.id || `phase-${index}`)
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: `${color}20`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "16px",
                          fontWeight: 700,
                          color: color,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginBottom: "2px",
                          }}
                        >
                          {phase.name}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            fontSize: "13px",
                            color: "var(--text-muted)",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Clock size={12} /> {phase.duration}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Flag size={12} /> {phase.milestones?.length || 0}{" "}
                            milestones
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className={`badge badge-${index === 0 ? "high" : "medium"}`}>
                        {phase.startDate} → {phase.endDate}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={18} color="var(--text-muted)" />
                      ) : (
                        <ChevronDown size={18} color="var(--text-muted)" />
                      )}
                    </div>
                  </div>

                  {/* Phase Details (expanded) */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 24px 24px",
                        borderTop: "1px solid var(--border-default)",
                        paddingTop: "20px",
                      }}
                    >
                      {/* Description */}
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "14px",
                          lineHeight: 1.7,
                          marginBottom: "20px",
                        }}
                      >
                        {phase.description}
                      </p>

                      {/* Features */}
                      {phase.features?.length > 0 && (
                        <div style={{ marginBottom: "20px" }}>
                          <h4
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "var(--text-muted)",
                              marginBottom: "8px",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Features
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            {phase.features.map((f, fi) => (
                              <div
                                key={fi}
                                style={{
                                  padding: "6px 12px",
                                  background: `${color}15`,
                                  border: `1px solid ${color}30`,
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  color: color,
                                }}
                              >
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Milestones */}
                      {phase.milestones?.length > 0 && (
                        <div>
                          <h4
                            style={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "var(--text-muted)",
                              marginBottom: "8px",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Milestones
                          </h4>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            {phase.milestones.map((m, mi) => (
                              <div
                                key={mi}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "10px",
                                  padding: "10px 14px",
                                  background: "var(--bg-tertiary)",
                                  borderRadius: "8px",
                                }}
                              >
                                {m.completed ? (
                                  <CheckCircle2
                                    size={16}
                                    color="#10b981"
                                    style={{ marginTop: "2px", minWidth: "16px" }}
                                  />
                                ) : (
                                  <Circle
                                    size={16}
                                    color="var(--text-muted)"
                                    style={{ marginTop: "2px", minWidth: "16px" }}
                                  />
                                )}
                                <div>
                                  <div
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {m.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--text-muted)",
                                      marginTop: "2px",
                                    }}
                                  >
                                    {m.description}
                                    {m.date && ` · ${m.date}`}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
