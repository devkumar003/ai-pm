import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { generateDiagram, DiagramType } from '@/lib/ai/diagram-generator';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, diagramType } = await req.json();

    if (!projectId || !diagramType) {
      return NextResponse.json(
        { error: 'projectId and diagramType are required' },
        { status: 400 }
      );
    }

    // Fetch the PRD for this project
    const { data: prd, error: prdError } = await supabaseAdmin
      .from('prds')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (prdError || !prd) {
      return NextResponse.json(
        { error: 'No PRD found for this project. Generate a PRD first.' },
        { status: 404 }
      );
    }

    // Generate the diagram
    const mermaidCode = await generateDiagram(
      JSON.stringify(prd.content),
      diagramType as DiagramType
    );

    return NextResponse.json({
      data: {
        mermaidCode,
        diagramType,
        projectId,
      },
      success: true,
    });
  } catch (error: unknown) {
    console.error('Diagram generation error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate diagram';
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
