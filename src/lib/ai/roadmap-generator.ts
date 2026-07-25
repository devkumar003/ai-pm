import { geminiModelJSON } from '@/lib/gemini';
import { PRDContent } from '@/types';

export async function generateRoadmap(prd: PRDContent) {
  const systemPrompt = `You are an expert Product Manager. Based on the provided PRD, generate a detailed product roadmap with phases and milestones.

Return a JSON object with this EXACT structure:
{
  "phases": [
    {
      "id": "phase1",
      "name": "Phase name (e.g., 'MVP Launch')",
      "description": "What this phase accomplishes",
      "duration": "e.g., '4 weeks'",
      "startDate": "Week 1",
      "endDate": "Week 4",
      "features": ["Feature names from the PRD included in this phase"],
      "milestones": [
        {
          "id": "m1",
          "name": "Milestone name",
          "date": "Target date/week",
          "description": "What this milestone represents",
          "completed": false
        }
      ],
      "status": "not_started"
    }
  ]
}

Generate 3-4 phases:
- Phase 1: MVP / Core Features (4-6 weeks)
- Phase 2: Enhanced Features (4-6 weeks)  
- Phase 3: Scale & Polish (4-6 weeks)
- Phase 4 (optional): Advanced / Future (ongoing)

Each phase should have 2-3 milestones. Distribute the PRD features logically across phases based on priority and dependencies.`;

  const result = await geminiModelJSON.generateContent([
    systemPrompt,
    `Generate a roadmap for this PRD:\n${JSON.stringify(prd, null, 2)}`,
  ]);

  const text = result.response.text();
  return JSON.parse(text);
}
