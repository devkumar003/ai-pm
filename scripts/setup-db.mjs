const SUPABASE_URL = 'https://moffkimzzltrzbwqcqvc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZmZraW16emx0cnpid3FjcXZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3NzkyNywiZXhwIjoyMDk5NzUzOTI3fQ.BLieGleNlLDulMqp9aom3pnxo9TJwVgefRmwi2BvKOg';

const statements = [
  // Projects
  `CREATE TABLE IF NOT EXISTS projects (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`,
  // PRDs  
  `CREATE TABLE IF NOT EXISTS prds (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, project_id UUID REFERENCES projects(id) ON DELETE CASCADE, title TEXT NOT NULL, content JSONB NOT NULL DEFAULT '{}', version INTEGER DEFAULT 1, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`,
  // Roadmaps
  `CREATE TABLE IF NOT EXISTS roadmaps (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, project_id UUID REFERENCES projects(id) ON DELETE CASCADE, phases JSONB NOT NULL DEFAULT '[]', created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`,
  // Tasks
  `CREATE TABLE IF NOT EXISTS tasks (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, project_id UUID REFERENCES projects(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT DEFAULT '', status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')), priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')), estimated_hours REAL DEFAULT 0, assignee TEXT DEFAULT '', sprint TEXT DEFAULT '', feature TEXT DEFAULT '', acceptance_criteria JSONB DEFAULT '[]', dependencies JSONB DEFAULT '[]', "order" INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`,
  // Chat messages
  `CREATE TABLE IF NOT EXISTS chat_messages (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, project_id UUID REFERENCES projects(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK (role IN ('user', 'assistant')), content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`,
  // RLS
  `ALTER TABLE projects ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE prds ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE tasks ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY`,
];

async function run() {
  // First try to use the Supabase SQL API via POST /rest/v1/rpc
  // If that doesn't work, we test the connection
  
  for (const sql of statements) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ query: sql }),
      });
      // Ignore errors from rpc - it's expected to fail
    } catch(e) {}
  }

  // Test if tables exist
  const tables = ['projects', 'prds', 'roadmaps', 'tasks', 'chat_messages'];
  
  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?limit=0`, {
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
        },
      });
      
      if (res.ok) {
        console.log(`✅ Table '${table}' exists`);
      } else {
        const text = await res.text();
        console.log(`❌ Table '${table}' - Status ${res.status}: ${text.slice(0, 100)}`);
      }
    } catch(e) {
      console.log(`❌ Table '${table}' - Error: ${e.message}`);
    }
  }
}

run();
