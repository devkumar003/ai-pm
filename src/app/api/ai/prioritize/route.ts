import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { generatePriorityMatrix } from '@/lib/ai/priority-matrix';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Fetch tasks for this project
    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (tasksError) throw tasksError;

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks found. Generate tasks first.' }, { status: 400 });
    }

    // Generate priority matrix
    const priorityData = await generatePriorityMatrix(tasks);

    // Update task priorities in database
    for (const item of priorityData.items) {
      await supabaseAdmin
        .from('tasks')
        .update({ priority: item.priority })
        .eq('id', item.id);
    }

    return NextResponse.json({
      data: priorityData.items,
      success: true,
    });
  } catch (error: unknown) {
    console.error('Priority matrix error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate priority matrix';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
