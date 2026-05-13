"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, BrainCircuit, Zap, ShieldCheck, Menu, X, ArrowLeft } from "lucide-react";
import GrantCard from "@/components/GrantCard";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import AudioReader from "@/components/AudioReader";

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

import { ALL_OPPORTUNITIES } from "@/lib/data";
import OpportunityCard from "@/components/OpportunityCard";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(ALL_OPPORTUNITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      if (!query) {
        setResults(ALL_OPPORTUNITIES);
      } else {
        const lower = query.toLowerCase();
        setResults(ALL_OPPORTUNITIES.filter(g =>
          g.title.toLowerCase().includes(lower) ||
          g.description?.toLowerCase().includes(lower)
        ));
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back,</h1>
          <p className="text-zinc-500 font-medium">Your intelligence core has identified {results.length} new matches.</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-black uppercase tracking-widest animate-pulse">
            <Zap size={14} /> AI Sync Active
        </div>
      </header>

      {/* Results Container */}
      <div className="space-y-6 max-w-5xl">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-48 bg-zinc-100 dark:bg-white/5 rounded-[2rem] animate-pulse border border-zinc-200 dark:border-white/5" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center px-4 opacity-50">
            <BrainCircuit className="w-16 h-16 text-zinc-300 mb-6" />
            <h3 className="text-xl font-bold">No High-Probability Matches</h3>
            <p className="text-sm text-zinc-500 max-w-md mt-2">Try adjusting your search criteria or checking back later as new opportunities are indexed hourly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {results.map((opp, i) => (
              <OpportunityCard key={opp.id} opp={opp} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold text-sm">Resyncing Cache...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
