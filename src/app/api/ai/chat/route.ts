import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { chatWithAssistant } from '@/lib/ai/chat-assistant';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, projectId } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Build context from project data
    let context: { prd?: string; roadmap?: string; tasks?: string } = {};

    if (projectId) {
      const [prdRes, roadmapRes, tasksRes] = await Promise.all([
        supabaseAdmin.from('prds').select('content').eq('project_id', projectId).limit(1).single(),
        supabaseAdmin.from('roadmaps').select('phases').eq('project_id', projectId).limit(1).single(),
        supabaseAdmin.from('tasks').select('title, description, status, priority').eq('project_id', projectId),
      ]);

      context = {
        prd: prdRes.data ? JSON.stringify(prdRes.data.content, null, 2) : undefined,
        roadmap: roadmapRes.data ? JSON.stringify(roadmapRes.data.phases, null, 2) : undefined,
        tasks: tasksRes.data ? JSON.stringify(tasksRes.data, null, 2) : undefined,
      };
    }

    // Get AI response
    const response = await chatWithAssistant(messages, context);

    // Save messages to database
    if (projectId) {
      const lastUserMessage = messages[messages.length - 1];
      await supabaseAdmin.from('chat_messages').insert([
        {
          project_id: projectId,
          role: 'user',
          content: lastUserMessage.content,
        },
        {
          project_id: projectId,
          role: 'assistant',
          content: response,
        },
      ]);
    }

    return NextResponse.json({
      data: { response },
      success: true,
    });
  } catch (error: unknown) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : 'Failed to chat';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
