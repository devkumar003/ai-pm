import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, status, order } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (order !== undefined) updates.order = order;

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
