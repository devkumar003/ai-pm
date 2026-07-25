"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ListChecks,
  Sparkles,
  RefreshCw,
  Clock,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { Task, TaskStatus } from "@/types";

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "backlog", title: "📋 Backlog", color: "#6b7280" },
  { id: "todo", title: "📝 To Do", color: "#facc15" },
  { id: "in_progress", title: "🚧 In Progress", color: "#f59e0b" },
  { id: "review", title: "👀 Review", color: "#fbbf24" },
  { id: "done", title: "✅ Done", color: "#10b981" },
];

function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", status: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        padding: "14px 16px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        cursor: "grab",
        transition: "all var(--transition-fast)",
      }}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
            flex: 1,
          }}
        >
          {task.title}
        </span>
        <GripVertical
          size={14}
          color="var(--text-muted)"
          style={{ minWidth: "14px" }}
        />
      </div>

      {task.description && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        {task.estimated_hours > 0 && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              color: "var(--text-muted)",
            }}
          >
            <Clock size={10} /> {task.estimated_hours}h
          </span>
        )}
        {task.feature && (
          <span
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              background: "var(--bg-tertiary)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {task.feature}
          </span>
        )}
      </div>
    </div>
  );
}

// Droppable column wrapper so empty columns can accept drops
function DroppableColumn({
  column,
  columnTasks,
  isActiveOver,
}: {
  column: (typeof columns)[number];
  columnTasks: Task[];
  isActiveOver: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", status: column.id },
  });

  const highlighted = isOver || isActiveOver;

  return (
    <div
      style={{
        minWidth: "280px",
        flex: 1,
      }}
    >
      {/* Column Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          marginBottom: "12px",
          background: `${column.color}10`,
          borderRadius: "var(--radius-md)",
          borderBottom: `2px solid ${column.color}`,
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {column.title}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: column.color,
            background: `${column.color}20`,
            padding: "2px 8px",
            borderRadius: "9999px",
          }}
        >
          {columnTasks.length}
        </span>
      </div>

      {/* Column Body — this is the droppable zone */}
      <div ref={setNodeRef}>
        <SortableContext
          items={columnTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minHeight: "100px",
              padding: "4px",
              borderRadius: "var(--radius-md)",
              background: highlighted
                ? `${column.color}10`
                : columnTasks.length === 0
                  ? "var(--bg-tertiary)"
                  : "transparent",
              border: highlighted
                ? `2px dashed ${column.color}`
                : columnTasks.length === 0
                  ? "1px dashed var(--border-default)"
                  : "none",
              transition: "all 0.2s ease",
            }}
          >
            {columnTasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
            {columnTasks.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                }}
              >
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function TaskBoardPage() {
  const { activeProject, tasks, setTasks, activePRD } = useProjectStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Auto-scroll the board container while dragging near the edges
  useEffect(() => {
    if (!activeId) {
      // Stop auto-scrolling when not dragging
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const EDGE_THRESHOLD = 80; // px from edge to start scrolling
    const SCROLL_SPEED = 12; // px per frame

    function handlePointerMove(e: PointerEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX;

      // Cancel any existing auto-scroll
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }

      const distFromLeft = x - rect.left;
      const distFromRight = rect.right - x;

      if (distFromLeft < EDGE_THRESHOLD || distFromRight < EDGE_THRESHOLD) {
        const direction = distFromLeft < EDGE_THRESHOLD ? -1 : 1;
        const intensity = direction === -1
          ? 1 - distFromLeft / EDGE_THRESHOLD
          : 1 - distFromRight / EDGE_THRESHOLD;

        function scrollStep() {
          if (!container) return;
          container.scrollLeft += direction * SCROLL_SPEED * Math.max(intensity, 0.3);
          autoScrollRef.current = requestAnimationFrame(scrollStep);
        }
        autoScrollRef.current = requestAnimationFrame(scrollStep);
      }
    }

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [activeId]);

  async function handleGenerate() {
    if (!activeProject) {
      alert("Please create a project and generate a PRD first.");
      return;
    }
    if (!activePRD) {
      alert("Please generate a PRD first before creating tasks.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.id }),
      });
      const json = await res.json();
      if (json.success) {
        setTasks(json.data);
      } else {
        alert(json.error || "Failed to generate tasks");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate tasks");
    } finally {
      setIsGenerating(false);
    }
  }

  const getColumnTasks = useCallback(
    (columnId: TaskStatus) => tasks.filter((t) => t.status === columnId),
    [tasks]
  );

  // Helper: find which column an id belongs to (could be a column id or a task id)
  function findColumnForId(id: string | number): TaskStatus | null {
    // Check if it's a column id directly
    if (columns.some((c) => c.id === id)) return id as TaskStatus;
    // Otherwise find the task and return its status
    const task = tasks.find((t) => t.id === id);
    return task ? task.status : null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    setOverColumnId(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const targetColumn = findColumnForId(over.id as string);
    setOverColumnId(targetColumn);

    if (targetColumn && activeTask.status !== targetColumn) {
      // Move the task to the new column immediately for visual feedback
      setTasks(
        tasks.map((t) =>
          t.id === active.id ? { ...t, status: targetColumn } : t
        )
      );
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active } = event;
    setActiveId(null);
    setOverColumnId(null);

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    // Persist to database
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          status: task.status,
        }),
      });
    } catch (err) {
      console.error("Failed to persist task update:", err);
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    setOverColumnId(null);
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

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
            <ListChecks size={38} color="#facc15" />
            Task Board
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            {tasks.length > 0
              ? `${tasks.length} tasks · Drag to reorder`
              : "Generate tasks from your PRD"}
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
              {tasks.length > 0 ? "Regenerate" : "Generate"} Tasks
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
            <ListChecks size={28} color="#09090b" />
          </div>
          <h3
            className="font-serif"
            style={{ fontSize: "24px", fontWeight: 500, marginBottom: "8px", color: "var(--text-primary)" }}
          >
            Breaking down features into tasks...
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Creating developer-ready tasks with estimates and acceptance criteria
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
      {!isGenerating && tasks.length === 0 && (
        <div
          className="input-card"
          style={{ padding: "60px", textAlign: "center", marginBottom: "32px" }}
        >
          <ListChecks
            size={48}
            color="#facc15"
            style={{ marginBottom: "16px", opacity: 0.8 }}
          />
          <h3
            className="font-serif"
            style={{ fontSize: "24px", fontWeight: 500, marginBottom: "12px", color: "var(--text-primary)" }}
          >
            No tasks yet
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
            Click &apos;Generate Tasks&apos; to create structured sprint tasks from your product requirements.
          </p>
        </div>
      )}

      {/* Kanban Board */}
      {!isGenerating && tasks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div
            ref={scrollContainerRef}
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "16px",
            }}
          >
            {columns.map((column) => {
              const columnTasks = getColumnTasks(column.id);
              return (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  columnTasks={columnTasks}
                  isActiveOver={overColumnId === column.id}
                />
              );
            })}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div
                style={{
                  padding: "14px 16px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--primary)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-glow)",
                  transform: "rotate(3deg)",
                }}
              >
                <span
                  style={{ fontSize: "13px", fontWeight: 600 }}
                >
                  {activeTask.title}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task summary */}
      {tasks.length > 0 && !isGenerating && (
        <div
          className="glass-card-static"
          style={{
            padding: "16px 24px",
            marginTop: "24px",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          <span>
            <AlertCircle
              size={14}
              style={{
                display: "inline",
                marginRight: "4px",
                verticalAlign: "middle",
              }}
            />
            Total: <strong>{tasks.length}</strong>
          </span>
          {columns.map((col) => (
            <span key={col.id}>
              <span style={{ color: col.color }}>●</span>{" "}
              {col.title.replace(/^.+\s/, "")}:{" "}
              <strong>{getColumnTasks(col.id).length}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
