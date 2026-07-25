import { geminiModelJSON } from '@/lib/gemini';

export interface CompetitorAnalysis {
  summary: string;
  competitors: {
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  }[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  featureComparison: {
    feature: string;
    yourProduct: 'yes' | 'no' | 'planned';
    competitors: Record<string, 'yes' | 'no' | 'partial'>;
  }[];
  recommendations: string[];
  differentiators: string[];
}

export async function generateCompetitorAnalysis(
  productDescription: string,
  competitors: string[]
): Promise<CompetitorAnalysis> {
  const systemPrompt = `You are a senior product strategist and competitive intelligence analyst. Analyze the following product against its competitors and generate a comprehensive competitive analysis.

Return a JSON object with this EXACT structure:
{
  "summary": "2-3 sentence executive summary of competitive landscape",
  "competitors": [
    {
      "name": "Competitor name",
      "description": "Brief description of the competitor (1-2 sentences)",
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2"]
    }
  ],
  "swot": {
    "strengths": ["Your product's strength vs competitors", ...],
    "weaknesses": ["Your product's weakness vs competitors", ...],
    "opportunities": ["Market opportunity based on competitor gaps", ...],
    "threats": ["Competitive threats to be aware of", ...]
  },
  "featureComparison": [
    {
      "feature": "Feature name",
      "yourProduct": "yes|no|planned",
      "competitors": {
        "CompetitorName1": "yes|no|partial",
        "CompetitorName2": "yes|no|partial"
      }
    }
  ],
  "recommendations": ["Strategic recommendation 1", ...],
  "differentiators": ["Key differentiator that makes your product unique", ...]
}

Generate:
- Analysis for each competitor provided
- 4-6 items per SWOT quadrant
- 8-12 features in the comparison matrix
- 4-6 strategic recommendations
- 3-5 key differentiators

Make the analysis insightful, actionable, and data-informed. Focus on genuine strategic insights rather than generic observations.`;

  const result = await geminiModelJSON.generateContent([
    systemPrompt,
    `My Product: ${productDescription}\n\nCompetitors to analyze: ${competitors.join(', ')}`,
  ]);

  const text = result.response.text();
  return JSON.parse(text);
}
