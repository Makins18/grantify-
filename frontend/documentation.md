# 📖 Grantify Technical Documentation

## 🏗 Architecture Overview

Grantify is designed as a modern, AI-first web application. The architecture is split into a **Next.js 15 Frontend** and a **FastAPI/Python Backend** (Contextual Intelligence OS).

### Frontend Design System
The frontend follows a **"Premium Dark"** aesthetic, utilizing:
- **Tailwind CSS v4**: For high-performance, utility-first styling.
- **Framer Motion**: For micro-interactions, smooth transitions, and high-end animations.
- **Glassmorphism**: Extensive use of backdrop-blurs and semi-transparent layers to create depth.

### Component Philosophy (DRY)
The codebase follows strict Don't Repeat Yourself (DRY) principles:
- **`OpportunityCard`**: A polymorphic component used in both the dashboard and search results, handling different metadata structures automatically.
- **`DashboardLayout`**: A central wrapper that handles all navigation, theme toggling, and layout state, allowing sub-pages to focus purely on content.
- **`BackgroundGlow`**: A global design token component that provides consistent ambient lighting effects.

## 🧠 AI Integration

### 1. RAG (Retrieval-Augmented Generation)
The platform uses a Vector Database (ChromaDB) to index grant opportunities. When a user searches or visits their dashboard:
- The system embeds their profile and query.
- It performs a semantic search to find the most relevant "Grounded" opportunities.
- It calculates a **Match Score** (%) based on alignment.

### 2. Neural Proposal Synthesis
The `EOIComposer` component interacts with the `/api/generate` route (powered by Gemini 1.5 Flash):
- It passes the grant metadata and user-provided context.
- It uses a specific, persona-driven prompt to generate high-quality drafts.
- It supports different tones: **Professional**, **Persuasive**, and **Technical**.

### 3. Audio & Accessibility
- **AudioReader**: A custom-built audio engine that synchronizes AI-generated summaries with text highlights (Karaoke-style).
- **Stealth Mode**: A feature managed via `SubscriptionContext` that modifies UI terminology and visibility for use in public/monitored environments.

## 🛠 Project Structure

```text
src/
├── app/               # Next.js 15 App Router
│   ├── api/           # Serverless API routes (Gemini integration)
│   ├── dashboard/     # Internal application routes
│   └── page.tsx       # Public landing page
├── components/        # Shared UI components (DRY library)
├── context/           # React Contexts (Auth, Theme, Subscription)
├── lib/               # Shared utilities, constants, and data models
│   ├── data.ts        # Centralized demo/mock data
│   └── types.ts       # Global TypeScript interfaces
└── styles/            # Global CSS and Tailwind configurations
```

## 🔐 Security & Integrity

- **Spam Guard**: A custom AI pre-screening audit that checks domain SSL status, registration age, and contact patterns to flag potential scams.
- **Verification Status**: Opportunities are tagged as `Verified`, `Uncertain`, or `Scam` based on multi-factor analysis.
- **Evidence Log**: Transparent "AI Reasoning" provided for every verification status to build user trust.

## 🚀 Performance Optimizations

- **Lazy Loading**: Heavy components like `OpportunityCard` use `framer-motion` and `IntersectionObserver` to animate only when visible.
- **Memoization**: Expensive calculations (like word splitting in `AudioReader`) are wrapped in `useMemo`.
- **Skeleton States**: Custom skeleton screens provide perceived performance during AI synthesis.

---

*Last Updated: May 2026*
