import { create } from 'zustand';
import { Project, PRD, Roadmap, Task, PriorityItem } from '@/types';

interface ProjectStore {
  // State
  projects: Project[];
  activeProject: Project | null;
  activePRD: PRD | null;
  activeRoadmap: Roadmap | null;
  tasks: Task[];
  priorityItems: PriorityItem[];
  diagramsByType: Record<string, string>;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  setActivePRD: (prd: PRD | null) => void;
  setActiveRoadmap: (roadmap: Roadmap | null) => void;
  setTasks: (tasks: Task[]) => void;
  setPriorityItems: (items: PriorityItem[]) => void;
  setDiagramByType: (diagramType: string, mermaidCode: string) => void;
  clearDiagramByType: (diagramType: string) => void;
  addProject: (project: Project) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskOrder: (taskId: string, newStatus: string, newOrder: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  projects: [],
  activeProject: null,
  activePRD: null,
  activeRoadmap: null,
  tasks: [],
  priorityItems: [],
  diagramsByType: {},
  isLoading: false,
  error: null,
};

export const useProjectStore = create<ProjectStore>((set) => ({
  ...initialState,

  setProjects: (projects) => set({ projects }),
  setActiveProject: (project) => set({ activeProject: project }),
  setActivePRD: (prd) => set({ activePRD: prd }),
  setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),
  setTasks: (tasks) => set({ tasks }),
  setPriorityItems: (items) => set({ priorityItems: items }),

  setDiagramByType: (diagramType, mermaidCode) =>
    set((state) => ({
      diagramsByType: { ...state.diagramsByType, [diagramType]: mermaidCode },
    })),

  clearDiagramByType: (diagramType) =>
    set((state) => {
      const updated = { ...state.diagramsByType };
      delete updated[diagramType];
      return { diagramsByType: updated };
    }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),

  updateTaskOrder: (taskId, newStatus, newOrder) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: newStatus as Task['status'], order: newOrder }
          : t
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
