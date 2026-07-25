import { geminiModelJSON } from '@/lib/gemini';
import { Feature } from '@/types';

export async function generateTasks(features: Feature[]) {
  const systemPrompt = `You are a senior engineering manager. Convert the provided product features into detailed developer tasks suitable for sprint planning.

Return a JSON object with this EXACT structure:
{
  "tasks": [
    {
      "title": "Task title (actionable, e.g., 'Implement user authentication flow')",
      "description": "Detailed description of what needs to be done",
      "status": "backlog",
      "priority": "critical|high|medium|low",
      "estimated_hours": 8,
      "feature": "Parent feature name",
      "sprint": "Sprint 1|Sprint 2|Sprint 3",
      "assignee": "",
      "acceptance_criteria": ["criteria1", "criteria2"],
      "dependencies": ["other task titles this depends on"]
    }
  ]
}

For each feature, generate 2-4 development tasks. Include:
- Frontend tasks (UI components, pages)
- Backend tasks (API routes, database)
- Integration tasks (connecting frontend to backend)
- Testing tasks where appropriate

Assign realistic hour estimates (2-16 hours per task).
Distribute across Sprint 1 (high priority), Sprint 2 (medium), Sprint 3 (low/nice-to-have).`;

  const result = await geminiModelJSON.generateContent([
    systemPrompt,
    `Generate developer tasks for these features:\n${JSON.stringify(features, null, 2)}`,
  ]);

  const text = result.response.text();
  return JSON.parse(text);
}
