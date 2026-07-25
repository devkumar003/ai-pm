import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: userId,
        name,
        description: description || '',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
