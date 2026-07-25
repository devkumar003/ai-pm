"use client";

import { useState } from "react";
import {
  BarChart3,
  Sparkles,
  RefreshCw,
  Zap,
  TrendingUp,
  Minus,
  ArrowDown,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { PriorityItem } from "@/types";

const quadrantConfig = {
  quick_wins: {
    title: "⚡ Quick Wins",
    subtitle: "High Impact, Low Effort — DO FIRST",
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.2)",
  },
  big_bets: {
    title: "🎯 Big Bets",
    subtitle: "High Impact, High Effort — PLAN CAREFULLY",
    color: "#facc15",
    bg: "rgba(250, 204, 21, 0.08)",
    border: "rgba(250, 204, 21, 0.2)",
  },
  fill_ins: {
    title: "📝 Fill-Ins",
    subtitle: "Low Impact, Low Effort — DO IF TIME",
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  money_pit: {
    title: "🚫 Money Pit",
    subtitle: "Low Impact, High Effort — AVOID",
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.2)",
  },
};

const priorityIcon = {
  critical: <Zap size={14} />,
  high: <TrendingUp size={14} />,
  medium: <Minus size={14} />,
  low: <ArrowDown size={14} />,
};

export default function PrioritiesPage() {
  const { activeProject, tasks, priorityItems, setPriorityItems } =
    useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (!activeProject) {
      alert("Please create a project first.");
      return;
    }
    if (tasks.length === 0) {
      alert("Please generate tasks first before running prioritization.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.id }),
      });
      const json = await res.json();
      if (json.success) {
        setPriorityItems(json.data);
      } else {
        alert(json.error || "Failed to prioritize");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate priority matrix");
    } finally {
      setIsGenerating(false);
    }
  }

  const getQuadrantItems = (quadrant: string) =>
    priorityItems.filter((item) => item.quadrant === quadrant);

  return (
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
            <BarChart3 size={38} color="#facc15" />
            Priority Matrix
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            AI-powered Impact vs. Effort analysis for your tasks
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !activeProject || tasks.length === 0}
          className="btn-gold-pill"
          style={{ opacity: isGenerating || !activeProject || tasks.length === 0 ? 0.6 : 1 }}
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
              <Sparkles size={16} /> Analyze Priorities
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
            <BarChart3 size={28} color="#09090b" />
          </div>
          <h3
            className="font-serif"
            style={{ fontSize: "24px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}
          >
            Analyzing task priorities...
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Evaluating impact and effort for each task
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
      {!isGenerating && priorityItems.length === 0 && (
        <div
          className="input-card"
          style={{ padding: "60px", textAlign: "center", marginBottom: "32px" }}
        >
          <BarChart3
            size={48}
            color="#facc15"
            style={{ marginBottom: "16px", opacity: 0.8 }}
          />
          <h3
            className="font-serif"
            style={{ fontSize: "24px", fontWeight: 500, marginBottom: "12px", color: "var(--text-primary)" }}
          >
            No priority analysis yet
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
            Generate tasks first, then run the priority analysis to get
            AI-powered recommendations.
          </p>
        </div>
      )}

      {/* Priority Matrix Grid */}
      {!isGenerating && priorityItems.length > 0 && (
        <>
          {/* Axis labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Impact →
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {/* Effort label */}
            <div
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Effort →
            </div>

            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gap: "16px",
              }}
            >
              {(
                Object.entries(quadrantConfig) as [
                  keyof typeof quadrantConfig,
                  (typeof quadrantConfig)[keyof typeof quadrantConfig]
                ][]
              ).map(([key, config]) => {
                const items = getQuadrantItems(key);
                return (
                  <div
                    key={key}
                    style={{
                      padding: "20px",
                      background: config.bg,
                      border: `1px solid ${config.border}`,
                      borderRadius: "var(--radius-lg)",
                      minHeight: "200px",
                    }}
                  >
                    <div style={{ marginBottom: "16px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: config.color,
                          marginBottom: "4px",
                        }}
                      >
                        {config.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontWeight: 500,
                        }}
                      >
                        {config.subtitle}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {items.map((item: PriorityItem) => (
                        <div
                          key={item.id}
                          style={{
                            padding: "10px 14px",
                            background: "var(--bg-card)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-default)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--text-primary)",
                                marginBottom: "4px",
                              }}
                            >
                              {item.name}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--text-muted)",
                                display: "flex",
                                gap: "8px",
                              }}
                            >
                              <span>Impact: {item.impact}/10</span>
                              <span>Effort: {item.effort}/10</span>
                            </div>
                          </div>
                          <span
                            className={`badge badge-${item.priority}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {priorityIcon[item.priority]}
                            {item.priority}
                          </span>
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "var(--text-muted)",
                            fontSize: "12px",
                          }}
                        >
                          No tasks in this quadrant
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div
            className="glass-card-static"
            style={{
              padding: "20px 24px",
              marginTop: "24px",
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              fontSize: "13px",
            }}
          >
            {(
              Object.entries(quadrantConfig) as [
                keyof typeof quadrantConfig,
                (typeof quadrantConfig)[keyof typeof quadrantConfig]
              ][]
            ).map(([key, config]) => (
              <span
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: config.color,
                  }}
                />
                {config.title.replace(/^.+\s/, "")}:{" "}
                <strong>{getQuadrantItems(key).length}</strong>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
