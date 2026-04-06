"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, BrainCircuit, Zap, ShieldCheck } from "lucide-react";
import GrantCard from "@/components/GrantCard";

const API_MOCK_DATA = [
  {
    id: "G-2026-001",
    title: "Federal Government MSME Scholarship",
    type: "Scholarship",
    value: "Full Tuition",
    deadline: "June 12, 2026",
    matchScore: 96,
    effortLevel: "Medium" as const,
    verificationStatus: "Verified" as const,
    trustScore: 0.99,
    description: "Full tuition coverage for Nigerian entrepreneurs in STEM and business. Targeted at under-represented regions. Requires NIN verification and university transcript.",
    audioUrl: "/mock_voice_note_1.mp3",
    evidence: {
      domain_verified: true,
      ssl_status: "Active",
      red_flags: [],
      ai_reasoning: "Domain cross-referenced with federal database. Institutional sponsor verified."
    }
  },
  {
    id: "G-2026-002",
    title: "NNPC/Chevron Joint Venture Scholarship",
    type: "Scholarship",
    value: "₦1.5M/Year",
    deadline: "July 01, 2026",
    matchScore: 92,
    effortLevel: "High" as const,
    verificationStatus: "Verified" as const,
    trustScore: 0.95,
    description: "Funding for Nigerian undergraduates in Engineering and Geosciences. Strict CGPA cutoffs apply.",
    audioUrl: "/mock_voice_note_2.mp3",
    evidence: {
      domain_verified: true,
      ssl_status: "Active",
      red_flags: [],
      ai_reasoning: "Sponsor is a vetted Tier-1 corporation. Historical data confirms yearly disbursements."
    }
  },
  {
    id: "G-2026-003",
    title: "Lagos Tech Innovation Grant 2026",
    type: "Grant",
    value: "₦5.0M",
    deadline: "Aug 15, 2026",
    matchScore: 84,
    effortLevel: "Low" as const,
    verificationStatus: "Uncertain" as const,
    trustScore: 0.65,
    description: "Seed capital for promising Nigerian tech startups resolving local traffic and mobility issues.",
    audioUrl: "/mock_voice_note_3.mp3",
    evidence: {
      domain_verified: false,
      ssl_status: "Active",
      red_flags: ["New domain registered 30 days ago", "Uses standard Gmail contact"],
      ai_reasoning: "The grant appears legitimate but lacks an official government domain. Under manual review."
    }
  },
  {
    id: "G-2026-004",
    title: "Fast-Track Visa Scholarship (UK)",
    type: "Scholarship",
    value: "£5,000",
    deadline: "Apply Now",
    matchScore: 12,
    effortLevel: "Low" as const,
    verificationStatus: "Scam" as const,
    trustScore: 0.12,
    description: "Guaranteed UK visa and scholarship for Nigerian students. Just pay a small application processing fee.",
    audioUrl: "/mock_voice_note_4.mp3",
    evidence: {
      domain_verified: false,
      ssl_status: "Expired",
      red_flags: ["Requires ₦15,000 processing fee", "False promises of guaranteed visa"],
      ai_reasoning: "Confirmed scam pattern. Real scholarships never require application processing fees."
    }
  }
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(API_MOCK_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI Vector Search delay
    setLoading(true);
    const t = setTimeout(() => {
      if (!query) {
        setResults(API_MOCK_DATA);
      } else {
        const lower = query.toLowerCase();
        setResults(API_MOCK_DATA.filter(g => 
          g.title.toLowerCase().includes(lower) || 
          g.description.toLowerCase().includes(lower)
        ));
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar / Search Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-slate-800 p-4 md:px-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="w-8 h-8 flex items-center justify-center bg-primary text-background rounded-lg font-black text-xl tracking-tighter">G</div>
          <span className="font-black text-xl tracking-tighter hidden md:block">Grantify</span>
        </div>
        
        {/* Main Search Bar */}
        <div className="flex-1 w-full max-w-3xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search matching scholarships..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-primary/50 text-white rounded-full py-3.5 pl-12 pr-6 shadow-xl focus:shadow-primary/5 outline-none transition-all"
          />
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <span className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Spam Guard Active
          </span>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
            ME
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 border-b border-primary/30 pb-2 inline-block">
              Intelligent Matches
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              {loading ? "RAG Engine querying vector database..." : `Found ${results.length} verified opportunities for you.`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Zap className="w-3 h-3 text-secondary" />
            Sorted by AI Match
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-48 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center">
            <BrainCircuit className="w-16 h-16 text-slate-700 mb-6" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Verified Matches Found</h3>
            <p className="text-slate-500 max-w-md">Our agents couldn't find any verified grants matching your exact criteria. We filter out hundreds of scams daily.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map(grant => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default async function Dashboard() {
  // Simulate heavy server-side RAG Engine query or Redis Miss (2.5 seconds)
  // This explicitly triggers the new Gemini-style `loading.tsx` suspense boundary.
  await new Promise((resolve) => setTimeout(resolve, 2500));

  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold">Resyncing Cache...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
