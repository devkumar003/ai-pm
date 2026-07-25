import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch project with all related data
    const [projectRes, prdRes, roadmapRes, tasksRes] = await Promise.all([
      supabaseAdmin.from('projects').select('*').eq('id', id).eq('user_id', userId).single(),
      supabaseAdmin.from('prds').select('*').eq('project_id', id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('roadmaps').select('*').eq('project_id', id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('tasks').select('*').eq('project_id', id).order('order', { ascending: true }),
    ]);

    if (projectRes.error) throw projectRes.error;

    return NextResponse.json({
      data: {
        project: projectRes.data,
        prd: prdRes.data?.[0] || null,
        roadmap: roadmapRes.data?.[0] || null,
        tasks: tasksRes.data || [],
      },
      success: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
