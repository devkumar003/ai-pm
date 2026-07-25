import { geminiModelJSON } from '@/lib/gemini';

export async function generatePRD(prompt: string) {
  const systemPrompt = `You are an expert Product Manager. Generate a comprehensive Product Requirements Document (PRD) based on the user's product idea.

Return a JSON object with this EXACT structure:
{
  "title": "Product name",
  "problemStatement": "Clear problem statement (2-3 sentences)",
  "targetAudience": "Who this product is for",
  "objectives": ["objective1", "objective2", ...],
  "features": [
    {
      "id": "f1",
      "name": "Feature name",
      "description": "Detailed description",
      "priority": "high|medium|low|critical",
      "category": "Category name"
    }
  ],
  "userStories": [
    {
      "id": "us1",
      "persona": "User type",
      "action": "What they want to do",
      "benefit": "Why they want to do it",
      "acceptanceCriteria": ["criteria1", "criteria2"]
    }
  ],
  "acceptanceCriteria": [
    {
      "id": "ac1",
      "feature": "Feature name",
      "criteria": "The acceptance criteria",
      "testCase": "How to test it"
    }
  ],
  "successMetrics": ["metric1", "metric2", ...],
  "constraints": ["constraint1", "constraint2", ...],
  "timeline": "Estimated timeline"
}

Generate at least:
- 6-8 features across different categories
- 5-7 user stories with detailed acceptance criteria  
- 8-10 acceptance criteria
- 4-6 success metrics
- 3-5 constraints

Make the content detailed, professional, and actionable. The PRD should be ready for engineering handoff.`;

  const result = await geminiModelJSON.generateContent([
    systemPrompt,
    `Generate a PRD for: ${prompt}`,
  ]);

  const text = result.response.text();
  return JSON.parse(text);
}
