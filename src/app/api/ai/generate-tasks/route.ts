import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { generateTasks } from '@/lib/ai/task-generator';

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

    // Fetch PRD for features
    const { data: prd, error: prdError } = await supabaseAdmin
      .from('prds')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (prdError || !prd) {
      return NextResponse.json({ error: 'No PRD found. Generate a PRD first.' }, { status: 400 });
    }

    // Generate tasks from features
    const taskData = await generateTasks(prd.content.features || []);

    // Save tasks to database
    const tasksToInsert = taskData.tasks.map((task: Record<string, unknown>, index: number) => ({
      project_id: projectId,
      title: task.title,
      description: task.description,
      status: task.status || 'backlog',
      priority: task.priority || 'medium',
      estimated_hours: task.estimated_hours || 0,
      assignee: task.assignee || '',
      sprint: task.sprint || '',
      feature: task.feature || '',
      acceptance_criteria: task.acceptance_criteria || [],
      dependencies: task.dependencies || [],
      order: index,
    }));

    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (tasksError) throw tasksError;

    return NextResponse.json({
      data: tasks,
      success: true,
    });
  } catch (error: unknown) {
    console.error('Task generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate tasks';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
