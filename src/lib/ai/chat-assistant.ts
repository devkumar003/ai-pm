import { geminiModel } from '@/lib/gemini';

interface ChatContext {
  prd?: string;
  roadmap?: string;
  tasks?: string;
}

export async function chatWithAssistant(
  messages: { role: 'user' | 'assistant'; content: string }[],
  context: ChatContext
) {
  const systemPrompt = `You are an AI Product Management Assistant. You help product managers with their work by answering questions, providing insights, and generating content related to their product documents.

You have access to the following project context:

${context.prd ? `## Current PRD:\n${context.prd}\n` : 'No PRD generated yet.'}
${context.roadmap ? `## Current Roadmap:\n${context.roadmap}\n` : 'No roadmap generated yet.'}
${context.tasks ? `## Current Tasks:\n${context.tasks}\n` : 'No tasks generated yet.'}

You can help with:
- Summarizing documents
- Generating user stories
- Suggesting KPIs and metrics
- Providing competitive analysis insights
- Answering product strategy questions
- Refining features and requirements
- Sprint planning suggestions
- Risk assessment

Be concise, actionable, and data-driven in your responses. Use markdown formatting for readability. When referencing specific features or tasks, mention them by name.`;

  const chatHistory = messages.map((msg) => ({
    role: msg.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.content }],
  }));

  const chat = geminiModel.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I\'m ready to help you with your product management needs! I have access to your project context and can assist with PRDs, roadmaps, tasks, and strategy. What would you like to work on?' }] },
      ...chatHistory.slice(0, -1),
    ],
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}
