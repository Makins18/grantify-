"use client";

import { useState } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    // Redirect to dashboard with query param
    setTimeout(() => {
      router.push(`/dashboard?q=${encodeURIComponent(query)}`);
    }, 600);
  };

  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Absolute top navbar */}
      <nav className="absolute top-0 w-full flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</Link>
          <Link href="/b2b-sponsors" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">For Sponsors</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/dashboard" className="px-5 py-2.5 bg-primary text-background text-sm font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 md:w-20 md:h-20 mb-4" />
          <div className="flex items-end gap-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
              Grantify
            </h1>
            <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              Nigeria
            </span>
          </div>
          <p className="text-slate-400 mt-2">The Scam-Free Funding Engine for Nigerian Students</p>
        </div>

        {/* Search Engine */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I need a scholarship for a final year Engineering student in UNILAG..."
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-primary/50 rounded-full py-4 pl-14 pr-6 text-white placeholder-slate-500 shadow-xl focus:shadow-primary/10 transition-all outline-none text-base md:text-lg"
              autoFocus
            />
          </form>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : "Search Grants"}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-bold text-slate-300 hover:text-white transition-all"
            >
              I'm Feeling Lucky
            </Link>
          </div>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-16 flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-600">
          <span className="flex items-center gap-2">✓ RAG Powered</span>
          <span className="flex items-center gap-2 text-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            100% Scam-Free Vetted
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-slate-950/50 py-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Grantify. Operating across all 36 states.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">Privacy & Transparency</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Use</Link>
            <Link href="/b2b" className="text-primary hover:text-primary/80 font-bold">Partner Portal</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
