import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { generateRoadmap } from '@/lib/ai/roadmap-generator';

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

    // Fetch PRD for this project
    const { data: prd, error: prdError } = await supabaseAdmin
      .from('prds')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (prdError || !prd) {
      return NextResponse.json({ error: 'No PRD found for this project. Generate a PRD first.' }, { status: 400 });
    }

    // Generate roadmap using AI
    const roadmapData = await generateRoadmap(prd.content);

    // Save roadmap to database
    const { data: roadmap, error: roadmapError } = await supabaseAdmin
      .from('roadmaps')
      .insert({
        project_id: projectId,
        phases: roadmapData.phases,
      })
      .select()
      .single();

    if (roadmapError) throw roadmapError;

    return NextResponse.json({
      data: roadmap,
      success: true,
    });
  } catch (error: unknown) {
    console.error('Roadmap generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate roadmap';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
