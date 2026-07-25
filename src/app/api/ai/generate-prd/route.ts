import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { generatePRD } from '@/lib/ai/prd-generator';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, projectId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate PRD using AI
    const prdContent = await generatePRD(prompt);

    // If projectId provided, save to existing project; otherwise create new project
    let finalProjectId = projectId;

    if (!finalProjectId) {
      const { data: project, error: projectError } = await supabaseAdmin
        .from('projects')
        .insert({
          user_id: userId,
          name: prdContent.title || prompt.slice(0, 50),
          description: prompt,
        })
        .select()
        .single();

      if (projectError) throw projectError;
      finalProjectId = project.id;
    }

    // Save PRD to database
    const { data: prd, error: prdError } = await supabaseAdmin
      .from('prds')
      .insert({
        project_id: finalProjectId,
        title: prdContent.title,
        content: prdContent,
      })
      .select()
      .single();

    if (prdError) throw prdError;

    return NextResponse.json({
      data: { prd, projectId: finalProjectId },
      success: true,
    });
  } catch (error: unknown) {
    console.error('PRD generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate PRD';
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
