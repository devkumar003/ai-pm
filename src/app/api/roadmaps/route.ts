import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    let query = supabaseAdmin.from('roadmaps').select('*').order('created_at', { ascending: false });
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch roadmaps';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
