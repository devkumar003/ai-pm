import { geminiModelJSON } from '@/lib/gemini';
import { Task } from '@/types';

export async function generatePriorityMatrix(tasks: Task[]) {
  const systemPrompt = `You are an expert Product Manager. Analyze the provided tasks and generate a priority matrix based on Impact vs Effort.

Return a JSON object with this EXACT structure:
{
  "items": [
    {
      "id": "task id from input",
      "name": "task title from input",
      "impact": 7,
      "effort": 3,
      "priority": "high|medium|low|critical",
      "quadrant": "quick_wins|big_bets|fill_ins|money_pit",
      "reasoning": "Brief explanation of why this task is prioritized this way"
    }
  ]
}

Quadrant definitions:
- quick_wins: High Impact, Low Effort (DO FIRST)
- big_bets: High Impact, High Effort (PLAN CAREFULLY)
- fill_ins: Low Impact, Low Effort (DO IF TIME PERMITS)
- money_pit: Low Impact, High Effort (AVOID/DEFER)

Impact scale (1-10): How much value does this deliver to users?
Effort scale (1-10): How much time/resources does this require?

Be realistic and consider dependencies between tasks.`;

  const result = await geminiModelJSON.generateContent([
    systemPrompt,
    `Prioritize these tasks:\n${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, description: t.description, estimated_hours: t.estimated_hours, feature: t.feature })), null, 2)}`,
  ]);

  const text = result.response.text();
  return JSON.parse(text);
}
