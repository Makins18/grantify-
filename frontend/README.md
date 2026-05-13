# 🌟 Grantify: Nigeria's Intelligence Core for Funding

Grantify is a premium, AI-powered platform designed specifically for Nigerian students and innovators. It leverages cutting-edge Retrieval-Augmented Generation (RAG) and neural synthesis to help users discover, verify, and apply for life-changing grants and scholarships without the noise of scams.

![Grantify Preview](https://images.unsplash.com/photo-1523240715630-341e42e74287?q=80&w=2070&auto=format&fit=crop)

## 🚀 Key Features

- **🎯 Strategic Discovery**: Semantic vector search to find high-probability opportunities across Africa.
- **✨ AI Draft Engine**: Neural synthesis that converts document context into winning proposals instantly.
- **🛡️ Vetted Integrity**: 100% scam-free platform with manual verification by a compliance team.
- **🎧 Audio Briefs**: AI-generated audio summaries for quick consumption of grant requirements.
- **🌚 Stealth Mode**: Premium accessibility feature for sensitive application environments.
- **⚡ Real-time Analytics**: Success predictors based on historical deployment logs.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (for premium animations)
- **AI/ML**: Google Gemini (LLM), ChromaDB (Vector Store), RAG Architecture
- **State/Auth**: React Context API, Supabase
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google AI API Key (Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/grantify.git
   cd grantify/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   GOOGLE_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture & DRY Principles

The project is built with a focus on **Clean Code** and **DRY** principles:

- **Shared Component Library**: Centralized components like `OpportunityCard`, `FeatureCard`, and `BackgroundGlow` ensure visual consistency.
- **Consolidated Navigation**: A single `DashboardNavItem` manages logic for all sidebar and mobile navigation variants.
- **Unified Types**: Shared interfaces in `src/lib/types.ts` ensure data integrity across the frontend.
- **Intelligent Layouts**: Nested Next.js layouts minimize redundant header/footer logic.

## 🤝 Contributing

We welcome contributions from the Nigerian developer community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the next generation of Nigerian leaders.
