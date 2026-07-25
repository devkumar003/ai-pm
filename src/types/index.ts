// ============================================================
// Core Types for AI Product Manager
// ============================================================

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PRD {
  id: string;
  project_id: string;
  title: string;
  content: PRDContent;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PRDContent {
  problemStatement: string;
  targetAudience: string;
  objectives: string[];
  features: Feature[];
  userStories: UserStory[];
  acceptanceCriteria: AcceptanceCriterion[];
  successMetrics: string[];
  constraints: string[];
  timeline: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  category: string;
}

export interface UserStory {
  id: string;
  persona: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
}

export interface AcceptanceCriterion {
  id: string;
  feature: string;
  criteria: string;
  testCase: string;
}

export interface Roadmap {
  id: string;
  project_id: string;
  phases: RoadmapPhase[];
  created_at: string;
  updated_at: string;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  features: string[];
  milestones: Milestone[];
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  estimated_hours: number;
  assignee: string;
  sprint: string;
  feature: string;
  acceptance_criteria: string[];
  dependencies: string[];
  created_at: string;
  updated_at: string;
  order: number;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface ChatMessage {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface PriorityItem {
  id: string;
  name: string;
  impact: number;   // 1-10
  effort: number;   // 1-10
  priority: Priority;
  quadrant: 'quick_wins' | 'big_bets' | 'fill_ins' | 'money_pit';
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Store types
export interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  activePRD: PRD | null;
  activeRoadmap: Roadmap | null;
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}
