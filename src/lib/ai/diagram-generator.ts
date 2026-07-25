import { geminiModel } from '@/lib/gemini';

export type DiagramType = 'user_flow' | 'architecture' | 'entity_relationship' | 'sequence' | 'mindmap';

const diagramPrompts: Record<DiagramType, string> = {
  user_flow: `Generate a Mermaid.js FLOWCHART (using "graph TD") that shows the complete user flow for this product.
Include:
- Entry points (landing page, sign-up, login)
- Core user journeys through key features
- Decision points (e.g., "Is user authenticated?")
- Error/edge case paths
- Exit points

Use this format:
graph TD
    A["Start"] --> B{"Decision?"}
    B -->|"Yes"| C["Action"]
    B -->|"No"| D["Other Action"]

IMPORTANT: Always wrap labels in double quotes inside brackets like ["Label"] or {"Label?"}. Never use parentheses for labels.`,

  architecture: `Generate a Mermaid.js FLOWCHART (using "graph TB") that shows the system architecture for this product.
Include:
- Frontend layer (UI components)
- Backend layer (API, services)
- Database layer
- External services/APIs
- Data flow arrows with labels

Use subgraphs to group related components:
graph TB
    subgraph "Frontend"
        A["React App"]
    end
    subgraph "Backend"
        B["API Server"]
    end
    A --> B

IMPORTANT: Always wrap labels in double quotes inside brackets like ["Label"]. Never use parentheses for labels.`,

  entity_relationship: `Generate a Mermaid.js ENTITY RELATIONSHIP diagram (using "erDiagram") that models the database schema for this product.
Include:
- All core entities (users, products, orders, etc.)
- Relationships between entities with cardinality
- Key attributes for each entity

Use this format:
erDiagram
    USER ||--o{ ORDER : "places"
    ORDER ||--|{ LINE_ITEM : "contains"
    USER {
        string id
        string name
        string email
    }`,

  sequence: `Generate a Mermaid.js SEQUENCE DIAGRAM (using "sequenceDiagram") that shows the main interaction flow for this product.
Include:
- Key actors (User, Frontend, Backend, Database, External API)
- The primary happy-path interaction
- Authentication flow
- Key API calls with descriptions
- Response handling

Use this format:
sequenceDiagram
    actor User
    participant FE as "Frontend"
    participant BE as "Backend"
    participant DB as "Database"
    User->>FE: Opens app
    FE->>BE: GET /api/data
    BE->>DB: SELECT query
    DB-->>BE: Results
    BE-->>FE: JSON response
    FE-->>User: Renders UI`,

  mindmap: `Generate a Mermaid.js MINDMAP (using "mindmap") that visualizes the feature breakdown for this product.
Include:
- Product name at the center
- Major feature categories as branches
- Individual features as sub-branches  
- Key sub-features or details as leaves

Use this format:
mindmap
  root("Product Name")
    Feature Category 1
      Feature A
      Feature B
    Feature Category 2
      Feature C
      Feature D`,
};

export async function generateDiagram(prdContent: string, diagramType: DiagramType): Promise<string> {
  const typePrompt = diagramPrompts[diagramType];

  const systemPrompt = `You are an expert software architect and Mermaid.js diagram specialist. Based on the following PRD content, generate a diagram.

RULES:
1. Return ONLY the raw Mermaid.js code. No markdown fences, no explanations, no commentary.
2. The diagram must be valid Mermaid.js syntax that renders without errors.
3. Keep node IDs short (A, B, C or descriptive like "auth", "db").
4. Always quote labels that contain special characters.
5. Do NOT use HTML tags in labels.
6. Make the diagram comprehensive but readable (15-30 nodes max for flowcharts).

${typePrompt}

PRD Content:
${prdContent}`;

  const result = await geminiModel.generateContent(systemPrompt);
  let text = result.response.text().trim();

  // Strip markdown fences if the model adds them
  text = text.replace(/^```mermaid\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  return text;
}
