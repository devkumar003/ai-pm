"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Map,
  ListChecks,
  MessageSquare,
  Plus,
  Sparkles,
  ArrowRight,
  Clock,
  Folder,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { Project } from "@/types";

const quickActions = [
  {
    icon: FileText,
    title: "Generate PRD",
    description: "Create a product requirements document",
    href: "/dashboard/prd",
    color: "#facc15",
  },
  {
    icon: Map,
    title: "Build Roadmap",
    description: "Plan your product phases",
    href: "/dashboard/roadmap",
    color: "#f59e0b",
  },
  {
    icon: ListChecks,
    title: "Task Board",
    description: "Manage your development tasks",
    href: "/dashboard/tasks",
    color: "#fbbf24",
  },
  {
    icon: MessageSquare,
    title: "AI Assistant",
    description: "Chat with your product docs",
    href: "/dashboard/chat",
    color: "#10b981",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const {
    projects,
    setProjects,
    setActiveProject,
    setActivePRD,
    setActiveRoadmap,
    setTasks,
    activeProject,
  } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // Load full project data (PRD, roadmap, tasks) into the store
  const loadProjectData = useCallback(
    async (projectId: string, navigateTo?: string) => {
      setLoadingProjectId(projectId);
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const json = await res.json();
        if (json.success) {
          setActiveProject(json.data.project);
          setActivePRD(json.data.prd || null);
          setActiveRoadmap(json.data.roadmap || null);
          setTasks(json.data.tasks || []);

          if (navigateTo) {
            router.push(navigateTo);
          }
        }
      } catch (err) {
        console.error("Failed to load project data:", err);
      } finally {
        setLoadingProjectId(null);
      }
    },
    [router, setActiveProject, setActivePRD, setActiveRoadmap, setTasks]
  );

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      if (json.success) {
        setProjects(json.data || []);
        // Auto-load the first project's full data if none is active
        if (json.data?.length > 0 && !activeProject) {
          loadProjectData(json.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function createProject() {
    if (!newProjectName.trim()) return;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDesc,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setProjects([json.data, ...projects]);
        setActiveProject(json.data);
        setActivePRD(null);
        setActiveRoadmap(null);
        setTasks([]);
        setShowNewProject(false);
        setNewProjectName("");
        setNewProjectDesc("");
      }
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  }

  async function deleteProject(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this project and all its data?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const remaining = projects.filter((p) => p.id !== id);
      setProjects(remaining);
      if (activeProject?.id === id) {
        if (remaining.length > 0) {
          loadProjectData(remaining[0].id);
        } else {
          setActiveProject(null);
          setActivePRD(null);
          setActiveRoadmap(null);
          setTasks([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1
          className="font-serif"
          style={{
            fontSize: "42px",
            fontWeight: 500,
            marginBottom: "12px",
            color: "var(--text-primary)",
          }}
        >
          Welcome back 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
          Your AI-powered product management workspace is ready.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "16px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => router.push(action.href)}
              className="glass-card"
              style={{
                padding: "24px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  borderRadius: "10px",
                  background: `${action.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <action.icon size={20} color={action.color} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {action.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  {action.description}
                </div>
              </div>
              <ArrowRight
                size={16}
                color="var(--text-muted)"
                style={{ marginLeft: "auto", marginTop: "4px" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Your Projects
          </h2>
          <button
            onClick={() => setShowNewProject(true)}
            className="btn-gold-pill"
            style={{ padding: "10px 20px", fontSize: "13px" }}
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* New Project Form */}
        {showNewProject && (
          <div
            className="input-card"
            style={{ padding: "32px", marginBottom: "24px" }}
          >
            <h3
              className="font-serif"
              style={{
                fontSize: "24px",
                fontWeight: 500,
                marginBottom: "20px",
                color: "var(--text-primary)",
              }}
            >
              Create New Project
            </h3>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="input-field"
              style={{ marginBottom: "14px", fontSize: "15px" }}
              autoFocus
            />
            <textarea
              placeholder="Brief description (optional)..."
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="input-field"
              style={{ marginBottom: "20px", minHeight: "80px", fontSize: "15px" }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={createProject} className="btn-gold-pill">
                <Sparkles size={16} /> Create Project
              </button>
              <button
                onClick={() => setShowNewProject(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        {isLoading ? (
          <div style={{ display: "grid", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: "80px" }}
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="glass-card-static"
            style={{
              padding: "60px 40px",
              textAlign: "center",
            }}
          >
            <Folder
              size={48}
              color="var(--text-muted)"
              style={{ marginBottom: "16px" }}
            />
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              No projects yet
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "24px",
                fontSize: "14px",
              }}
            >
              Create your first project or generate a PRD to get started.
            </p>
            <button
              onClick={() => router.push("/dashboard/prd")}
              className="btn-primary"
            >
              <Sparkles size={16} /> Generate Your First PRD
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {projects.map((project: Project) => {
              const isActive = activeProject?.id === project.id;
              const isLoadingThis = loadingProjectId === project.id;
              return (
                <div
                  key={project.id}
                  className="glass-card"
                  style={{
                    padding: "20px 24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    borderColor: isActive
                      ? "var(--border-active)"
                      : undefined,
                  }}
                  onClick={() => loadProjectData(project.id, "/dashboard/prd")}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      borderRadius: "10px",
                      background: isActive
                        ? "var(--gradient-primary)"
                        : "var(--bg-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {isLoadingThis ? (
                      <Loader2
                        size={20}
                        color="white"
                        style={{ animation: "spin-slow 1s linear infinite" }}
                      />
                    ) : isActive ? (
                      <CheckCircle2 size={20} color="white" />
                    ) : (
                      <Folder size={20} color="var(--text-muted)" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {project.name}
                      {isActive && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "11px",
                            color: "#10b981",
                            fontWeight: 500,
                          }}
                        >
                          ● Active
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Clock size={12} />
                      {new Date(project.created_at).toLocaleDateString()}
                      {project.description && ` · ${project.description.slice(0, 50)}...`}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteProject(project.id, e)}
                    className="btn-ghost"
                    style={{ padding: "6px", color: "var(--text-muted)" }}
                  >
                    <Trash2 size={16} />
                  </button>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
