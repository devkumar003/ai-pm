# 🤖 AI Product Manager

An AI-powered product management platform that automates PRD creation, roadmap planning, task breakdown, and more — helping teams go from idea to execution in minutes.

🔗 **Live Demo:** [https://ai-project-manager-blue.vercel.app](https://ai-project-manager-blue.vercel.app)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **AI PRD Generator** | Enter a product idea and get a complete PRD with problem statement, features, user stories, and acceptance criteria |
| 🗺️ **Roadmap Generator** | Auto-generate phased roadmaps with milestones, timelines, and feature distribution across sprints |
| ✅ **Task Breakdown** | Convert features into developer-ready tasks with estimates, dependencies, and acceptance criteria |
| 📊 **Priority Matrix** | AI-powered impact vs. effort analysis to prioritize your backlog using the Eisenhower method |
| 🔍 **Competitor Analysis** | Get AI-driven competitive landscape analysis with market positioning insights |
| 📐 **Diagram Generator** | Auto-generate architecture and flow diagrams using Mermaid visualization |
| 💬 **AI Chat Assistant** | Chat with your product documents — ask questions, get summaries, and receive strategic suggestions |
| 📋 **Kanban Board** | Drag-and-drop task management with visual columns for Backlog, In Progress, Review, and Done |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **AI Engine** | Google Gemini AI (`@google/generative-ai`) |
| **Authentication** | Clerk (`@clerk/nextjs`) |
| **Database** | Supabase (PostgreSQL) |
| **State Management** | Zustand |
| **Animations** | Framer Motion |
| **Diagrams** | Mermaid.js |
| **Drag & Drop** | dnd-kit |
| **PDF Export** | jsPDF + html2canvas |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Supabase](https://supabase.com) account
- A [Clerk](https://clerk.com) account
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/devkumar003/ai-project-manager.git
cd ai-pm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Set up the database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Or use the setup script
node scripts/setup-db.mjs
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
ai-pm/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/              # AI feature endpoints
│   │   │   │   ├── chat/
│   │   │   │   ├── competitor-analysis/
│   │   │   │   ├── generate-diagram/
│   │   │   │   ├── generate-prd/
│   │   │   │   ├── generate-roadmap/
│   │   │   │   ├── generate-tasks/
│   │   │   │   └── prioritize/
│   │   │   ├── projects/         # CRUD API routes
│   │   │   ├── prds/
│   │   │   ├── roadmaps/
│   │   │   └── tasks/
│   │   ├── dashboard/
│   │   │   ├── chat/             # AI Chat Assistant
│   │   │   ├── competitors/      # Competitor Analysis
│   │   │   ├── diagrams/         # Diagram Generator
│   │   │   ├── prd/              # PRD Generator
│   │   │   ├── priorities/       # Priority Matrix
│   │   │   ├── roadmap/          # Roadmap Planner
│   │   │   └── tasks/            # Kanban Task Board
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── lib/
│   │   ├── ai/                   # AI service functions
│   │   ├── gemini.ts             # Gemini client config
│   │   └── supabase.ts           # Supabase client config
│   ├── store/                    # Zustand state stores
│   └── types/                    # TypeScript interfaces
├── supabase/
│   └── schema.sql                # Database schema
└── scripts/
    └── setup-db.mjs              # DB setup automation
```

---

## 📸 How It Works

1. **Sign Up / Sign In** — Authenticate using Clerk
2. **Create a Project** — Enter your product idea or description
3. **Generate PRD** — AI creates a detailed Product Requirements Document
4. **Plan Roadmap** — Auto-generate phased milestones and timelines
5. **Break Down Tasks** — Convert features into actionable development tasks
6. **Prioritize** — Use AI-powered priority matrix to rank your backlog
7. **Manage Tasks** — Drag and drop tasks across Kanban board columns
8. **Chat with AI** — Ask questions about your project and get strategic advice

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built using Next.js, Google Gemini AI, and Supabase
</p>
