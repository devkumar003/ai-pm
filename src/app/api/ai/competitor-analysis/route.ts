import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabaseAdmin from '@/lib/supabase';
import { generateCompetitorAnalysis } from '@/lib/ai/competitor-analysis';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, competitors } = await req.json();

    if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
      return NextResponse.json(
        { error: 'At least one competitor is required' },
        { status: 400 }
      );
    }

    // Get product description from PRD if projectId is provided
    let productDescription = '';

    if (projectId) {
      const { data: prd } = await supabaseAdmin
        .from('prds')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (prd) {
        productDescription = JSON.stringify(prd.content);
      }

      // Also get project name
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('name, description')
        .eq('id', projectId)
        .single();

      if (project) {
        productDescription = `Product: ${project.name}. ${project.description}. PRD Details: ${productDescription}`;
      }
    }

    if (!productDescription) {
      productDescription = 'A new product (no PRD available yet)';
    }

    const analysis = await generateCompetitorAnalysis(productDescription, competitors);

    return NextResponse.json({
      data: analysis,
      success: true,
    });
  } catch (error: unknown) {
    console.error('Competitor analysis error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate competitor analysis';
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 }
    );
  }
}
