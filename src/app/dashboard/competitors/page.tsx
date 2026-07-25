"use client";

import { useState } from "react";
import {
  Swords,
  Sparkles,
  RefreshCw,
  Plus,
  X,
  Shield,
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { CompetitorAnalysis } from "@/lib/ai/competitor-analysis";

export default function CompetitorAnalysisPage() {
  const { activeProject } = useProjectStore();
  const [competitors, setCompetitors] = useState<string[]>([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);

  function addCompetitor() {
    if (competitors.length >= 5) return;
    setCompetitors([...competitors, ""]);
  }

  function removeCompetitor(index: number) {
    if (competitors.length <= 1) return;
    setCompetitors(competitors.filter((_, i) => i !== index));
  }

  function updateCompetitor(index: number, value: string) {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  }

  async function handleGenerate() {
    const validCompetitors = competitors.filter((c) => c.trim());
    if (validCompetitors.length === 0) {
      alert("Please enter at least one competitor.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProject?.id,
          competitors: validCompetitors,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAnalysis(json.data);
      } else {
        alert(json.error || "Failed to generate analysis");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate competitor analysis.");
    } finally {
      setIsGenerating(false);
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "yes":
        return <CheckCircle2 size={16} color="#10b981" />;
      case "no":
        return <XCircle size={16} color="#ef4444" />;
      case "partial":
        return <Clock size={16} color="#f59e0b" />;
      case "planned":
        return <Clock size={16} color="#6366f1" />;
      default:
        return <XCircle size={16} color="#6b7280" />;
    }
  };

  const swotConfig = [
    {
      key: "strengths" as const,
      title: "Strengths",
      icon: Shield,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.08)",
      border: "rgba(16, 185, 129, 0.2)",
    },
    {
      key: "weaknesses" as const,
      title: "Weaknesses",
      icon: AlertTriangle,
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.08)",
      border: "rgba(239, 68, 68, 0.2)",
    },
    {
      key: "opportunities" as const,
      title: "Opportunities",
      icon: Lightbulb,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.08)",
      border: "rgba(99, 102, 241, 0.2)",
    },
    {
      key: "threats" as const,
      title: "Threats",
      icon: Zap,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.08)",
      border: "rgba(245, 158, 11, 0.2)",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}
          >
            <Swords
              size={24}
              style={{
                display: "inline",
                marginRight: "10px",
                color: "var(--primary-light)",
              }}
            />
            Competitor Analysis
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            AI-powered SWOT analysis and feature comparison against your
            competitors
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div
        className="glass-card-static"
        style={{ padding: "24px", marginBottom: "32px" }}
      >
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "12px",
            color: "var(--text-secondary)",
          }}
        >
          Enter competitor names or product URLs
        </label>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          {competitors.map((comp, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  minWidth: "28px",
                  borderRadius: "8px",
                  background: "var(--bg-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                }}
              >
                {index + 1}
              </div>
              <input
                type="text"
                value={comp}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                placeholder={`e.g., "Notion", "Jira", "Linear" or a URL`}
                className="input-field"
                style={{ flex: 1 }}
              />
              {competitors.length > 1 && (
                <button
                  onClick={() => removeCompetitor(index)}
                  style={{
                    width: "28px",
                    height: "28px",
                    minWidth: "28px",
                    borderRadius: "6px",
                    border: "none",
                    background: "rgba(239, 68, 68, 0.1)",
                    color: "#ef4444",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {competitors.length < 5 && (
            <button onClick={addCompetitor} className="btn-ghost">
              <Plus size={16} /> Add Competitor
            </button>
          )}

          <button
            onClick={handleGenerate}
            disabled={
              isGenerating || competitors.every((c) => !c.trim())
            }
            className="btn-primary"
          >
            {isGenerating ? (
              <>
                <RefreshCw
                  size={16}
                  style={{ animation: "spin-slow 1s linear infinite" }}
                />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Analyze Competitors
              </>
            )}
          </button>
        </div>

        {/* Quick suggestions */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ fontSize: "12px", color: "var(--text-muted)", paddingTop: "4px" }}
          >
            Popular:
          </span>
          {["Notion", "Jira", "Linear", "Asana", "Monday.com", "ClickUp"].map(
            (s) => (
              <button
                key={s}
                onClick={() => {
                  const emptyIdx = competitors.findIndex((c) => !c.trim());
                  if (emptyIdx !== -1) {
                    updateCompetitor(emptyIdx, s);
                  } else if (competitors.length < 5) {
                    setCompetitors([...competitors, s]);
                  }
                }}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "9999px",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Loading */}
      {isGenerating && (
        <div
          className="glass-card-static"
          style={{ padding: "60px", textAlign: "center" }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 20px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ef4444, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          >
            <Swords size={28} color="white" />
          </div>
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            Analyzing competitors...
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Generating SWOT analysis, feature comparison, and strategic
            recommendations
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

      {/* Analysis Output */}
      {!isGenerating && analysis && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* Summary */}
          <div
            className="glass-card-static gradient-border"
            style={{ padding: "24px" }}
          >
            <div className="badge badge-status" style={{ marginBottom: "12px" }}>
              AI Competitive Intelligence
            </div>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              {analysis.summary}
            </p>
          </div>

          {/* Competitor Profiles */}
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Target size={18} color="var(--primary-light)" /> Competitor
              Profiles
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {analysis.competitors.map((comp, i) => (
                <div
                  key={i}
                  className="glass-card-static"
                  style={{ padding: "20px" }}
                >
                  <h4
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: `hsl(${(i * 72) % 360}, 60%, 50%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {comp.name[0]}
                    </div>
                    {comp.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginBottom: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {comp.description}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#10b981",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        Strengths
                      </div>
                      {comp.strengths.map((s, j) => (
                        <div
                          key={j}
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            marginBottom: "2px",
                            paddingLeft: "8px",
                            borderLeft: "2px solid #10b981",
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#ef4444",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        Weaknesses
                      </div>
                      {comp.weaknesses.map((w, j) => (
                        <div
                          key={j}
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            marginBottom: "2px",
                            paddingLeft: "8px",
                            borderLeft: "2px solid #ef4444",
                          }}
                        >
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SWOT Analysis */}
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Shield size={18} color="var(--primary-light)" /> SWOT Analysis
              (Your Product)
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {swotConfig.map((quadrant) => {
                const Icon = quadrant.icon;
                const items = analysis.swot[quadrant.key];
                return (
                  <div
                    key={quadrant.key}
                    style={{
                      padding: "20px",
                      background: quadrant.bg,
                      border: `1px solid ${quadrant.border}`,
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: quadrant.color,
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Icon size={16} /> {quadrant.title}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {items.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{
                              color: quadrant.color,
                              marginTop: "2px",
                              minWidth: "6px",
                            }}
                          >
                            •
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature Comparison Matrix */}
          <div>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <TrendingUp size={18} color="var(--primary-light)" /> Feature
              Comparison Matrix
            </h3>
            <div
              className="glass-card-static"
              style={{ overflow: "auto", padding: 0 }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid var(--border-default)",
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        background: "var(--bg-tertiary)",
                      }}
                    >
                      Feature
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "14px 16px",
                        fontWeight: 600,
                        color: "#6366f1",
                        background: "rgba(99, 102, 241, 0.05)",
                        minWidth: "100px",
                      }}
                    >
                      ⭐ Your Product
                    </th>
                    {analysis.competitors.map((comp) => (
                      <th
                        key={comp.name}
                        style={{
                          textAlign: "center",
                          padding: "14px 16px",
                          fontWeight: 600,
                          color: "var(--text-secondary)",
                          background: "var(--bg-tertiary)",
                          minWidth: "100px",
                        }}
                      >
                        {comp.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysis.featureComparison.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--border-default)",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {row.feature}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          padding: "12px 16px",
                          background: "rgba(99, 102, 241, 0.03)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          {statusIcon(row.yourProduct)}
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                              textTransform: "capitalize",
                            }}
                          >
                            {row.yourProduct}
                          </span>
                        </div>
                      </td>
                      {analysis.competitors.map((comp) => (
                        <td
                          key={comp.name}
                          style={{
                            textAlign: "center",
                            padding: "12px 16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            {statusIcon(row.competitors[comp.name])}
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                textTransform: "capitalize",
                              }}
                            >
                              {row.competitors[comp.name] || "N/A"}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations & Differentiators */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "16px",
            }}
          >
            {/* Recommendations */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#6366f1",
                }}
              >
                <Lightbulb size={18} /> Strategic Recommendations
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {analysis.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-sm)",
                      borderLeft: "3px solid #6366f1",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#6366f1",
                        minWidth: "20px",
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Differentiators */}
            <div className="glass-card-static" style={{ padding: "24px" }}>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#10b981",
                }}
              >
                <Award size={18} /> Key Differentiators
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {analysis.differentiators.map((diff, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px 14px",
                      background: "rgba(16, 185, 129, 0.05)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(16, 185, 129, 0.15)",
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      color="#10b981"
                      style={{ marginTop: "1px", minWidth: "16px" }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {diff}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div
            className="glass-card-static"
            style={{
              padding: "12px 20px",
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CheckCircle2 size={14} color="#10b981" /> Yes
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <XCircle size={14} color="#ef4444" /> No
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={14} color="#f59e0b" /> Partial
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={14} color="#6366f1" /> Planned
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
