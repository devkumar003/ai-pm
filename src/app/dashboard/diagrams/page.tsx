"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  GitBranch,
  Sparkles,
  RefreshCw,
  Download,
  Share2,
  Server,
  Database,
  Users,
  Brain,
  ArrowRightLeft,
  Copy,
  Check,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";

const diagramTypes = [
  {
    id: "user_flow",
    label: "User Flow",
    icon: Users,
    description: "Complete user journey through the product",
    color: "#6366f1",
  },
  {
    id: "architecture",
    label: "System Architecture",
    icon: Server,
    description: "High-level system components and data flow",
    color: "#10b981",
  },
  {
    id: "entity_relationship",
    label: "ER Diagram",
    icon: Database,
    description: "Database entities and relationships",
    color: "#f59e0b",
  },
  {
    id: "sequence",
    label: "Sequence Diagram",
    icon: ArrowRightLeft,
    description: "Interaction flow between system components",
    color: "#ec4899",
  },
  {
    id: "mindmap",
    label: "Feature Mindmap",
    icon: Brain,
    description: "Visual feature breakdown of the product",
    color: "#8b5cf6",
  },
];

export default function DiagramsPage() {
  const { activeProject, activePRD, diagramsByType, setDiagramByType, clearDiagramByType } = useProjectStore();
  const [selectedType, setSelectedType] = useState("user_flow");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  // Derive current mermaid code from the selected type
  const mermaidCode = diagramsByType[selectedType] || "";

  const renderDiagram = useCallback(async () => {
    if (!mermaidCode || !diagramRef.current) return;
    setRenderError(null);

    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#6366f1",
          primaryTextColor: "#f1f1f4",
          primaryBorderColor: "#4f46e5",
          lineColor: "#6366f1",
          secondaryColor: "#1e1e2e",
          tertiaryColor: "#111118",
          background: "#111118",
          mainBkg: "#1a1a2e",
          nodeBorder: "#4f46e5",
          clusterBkg: "#16162a",
          clusterBorder: "#2d2d4a",
          titleColor: "#f1f1f4",
          edgeLabelBackground: "#1a1a2e",
          nodeTextColor: "#f1f1f4",
        },
        flowchart: { curve: "basis", padding: 20 },
        sequence: { actorMargin: 50, messageMargin: 40 },
      });

      renderIdRef.current += 1;
      const id = `mermaid-diagram-${renderIdRef.current}`;
      diagramRef.current.innerHTML = "";

      const { svg } = await mermaid.render(id, mermaidCode);
      diagramRef.current.innerHTML = svg;

      // Make SVG responsive
      const svgEl = diagramRef.current.querySelector("svg");
      if (svgEl) {
        svgEl.style.maxWidth = "100%";
        svgEl.style.height = "auto";
        svgEl.style.minHeight = "300px";
      }
    } catch (err) {
      console.error("Mermaid render error:", err);
      setRenderError(
        err instanceof Error ? err.message : "Failed to render diagram"
      );
    }
  }, [mermaidCode]);

  // Clear the rendered diagram container and re-render when the selected type changes
  useEffect(() => {
    // Clear the previous rendered diagram immediately
    if (diagramRef.current) {
      diagramRef.current.innerHTML = "";
    }
    setRenderError(null);

    if (mermaidCode) {
      renderDiagram();
    }
  }, [selectedType, mermaidCode, renderDiagram]);

  async function handleGenerate() {
    if (!activeProject) {
      alert("Please create a project first.");
      return;
    }
    if (!activePRD) {
      alert("Please generate a PRD first before creating diagrams.");
      return;
    }

    setIsGenerating(true);
    setRenderError(null);
    // Clear the current type's diagram while generating
    clearDiagramByType(selectedType);

    try {
      const res = await fetch("/api/ai/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProject.id,
          diagramType: selectedType,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setDiagramByType(selectedType, json.data.mermaidCode);
      } else {
        alert(json.error || "Failed to generate diagram");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate diagram. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownloadSVG() {
    if (!diagramRef.current) return;
    const svgEl = diagramRef.current.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedType}_diagram.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDownloadPNG() {
    if (!diagramRef.current) return;
    const svgEl = diagramRef.current.querySelector("svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      if (ctx) {
        ctx.fillStyle = "#111118";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${selectedType}_diagram.png`;
      a.click();
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const currentType = diagramTypes.find((t) => t.id === selectedType);

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
            <GitBranch
              size={24}
              style={{
                display: "inline",
                marginRight: "10px",
                color: "var(--primary-light)",
              }}
            />
            AI Diagrams
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Auto-generate architecture diagrams, user flows, and ER diagrams
            from your PRD
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {mermaidCode && (
            <>
              <button onClick={handleDownloadSVG} className="btn-ghost">
                <Download size={16} /> SVG
              </button>
              <button onClick={handleDownloadPNG} className="btn-ghost">
                <Download size={16} /> PNG
              </button>
              <button onClick={handleCopyCode} className="btn-ghost">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </>
          )}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !activeProject}
            className="btn-primary"
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
                <Sparkles size={16} /> Generate Diagram
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagram Type Selector */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {diagramTypes.map((type) => {
          const isSelected = selectedType === type.id;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                padding: "16px",
                background: isSelected
                  ? `${type.color}15`
                  : "var(--bg-secondary)",
                border: isSelected
                  ? `2px solid ${type.color}`
                  : "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all var(--transition-fast)",
                color: "var(--text-primary)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <Icon
                  size={18}
                  color={isSelected ? type.color : "var(--text-muted)"}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isSelected ? type.color : "var(--text-primary)",
                  }}
                >
                  {type.label}
                </span>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {type.description}
              </p>
            </button>
          );
        })}
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
              background: `linear-gradient(135deg, ${currentType?.color || "#6366f1"}, #8b5cf6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          >
            <Share2 size={28} color="white" />
          </div>
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            Generating {currentType?.label}...
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            AI is analyzing your PRD and creating a visual diagram
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

      {/* Empty State */}
      {!isGenerating && !mermaidCode && (
        <div
          className="glass-card-static"
          style={{ padding: "60px", textAlign: "center" }}
        >
          <GitBranch
            size={48}
            color="var(--text-muted)"
            style={{ marginBottom: "16px" }}
          />
          <h3
            style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
          >
            No diagrams yet
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              maxWidth: "450px",
              margin: "0 auto",
            }}
          >
            {activeProject
              ? 'Select a diagram type above and click "Generate Diagram" to create AI-powered visual documentation from your PRD.'
              : "Create a project and generate a PRD first, then come back here to generate diagrams."}
          </p>
        </div>
      )}

      {/* Diagram Output */}
      {!isGenerating && mermaidCode && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Rendered Diagram */}
          <div
            className="glass-card-static gradient-border"
            style={{
              padding: "32px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                className="badge badge-status"
                style={{ background: `${currentType?.color}20`, color: currentType?.color }}
              >
                {currentType?.label}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                }}
              >
                Auto-generated from PRD · {activeProject?.name}
              </span>
            </div>

            {renderError ? (
              <div
                style={{
                  padding: "24px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                >
                  Failed to render diagram. The AI may have generated invalid
                  syntax.
                </p>
                <button onClick={handleGenerate} className="btn-primary">
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            ) : (
              <div
                ref={diagramRef}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                }}
              />
            )}
          </div>

          {/* Source Code */}
          <details
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <summary
              style={{
                padding: "16px 20px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📝 View Mermaid Source Code
            </summary>
            <div style={{ padding: "0 20px 20px" }}>
              <pre
                style={{
                  padding: "16px",
                  background: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono)",
                  overflow: "auto",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {mermaidCode}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
