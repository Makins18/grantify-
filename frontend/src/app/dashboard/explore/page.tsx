"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, Zap, SlidersHorizontal } from "lucide-react";
import { LazyOpportunityCard, Opportunity } from "@/components/LazyOpportunityCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import AudioReader from "@/components/AudioReader";
import OpportunityModal from "@/components/OpportunityModal";
import EOIComposer from "@/components/EOIComposer";
import { AnimatePresence } from "framer-motion";

import { ALL_OPPORTUNITIES } from "@/lib/data";
import OpportunityCard from "@/components/OpportunityCard";

const CATEGORIES = ["All", "Tenders", "Grants", "Scholarships"];

export default function ExplorePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary font-bold tracking-widest">LOADING INTELLIGENCE...</div></div>}>
            <ExploreContent />
        </Suspense>
    );
}

function ExploreContent() {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get("filter");

    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState(
        filterParam === "grants" ? "Grants" : filterParam === "tenders" ? "Tenders" : "All"
    );
    const [loading, setLoading] = useState(true);
    const [allResults, setAllResults] = useState<Opportunity[]>([]);
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
    const [composingOpp, setComposingOpp] = useState<Opportunity | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                // Simulate fast fetch or use shared data
                if (!cancelled) setAllResults(ALL_OPPORTUNITIES);
            } catch {
                if (!cancelled) setAllResults(ALL_OPPORTUNITIES);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = allResults.filter(o => {
        const matchCat = activeCategory === "All" || o.type === activeCategory.slice(0, -1) as any || o.type === activeCategory;
        const matchQ = !query || o.title.toLowerCase().includes(query.toLowerCase()) || o.country.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQ;
    });

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-black tracking-tight mb-2">Strategic Discovery</h1>
                <p className="text-zinc-500 font-medium">Harness semantic vector search to find high-probability opportunities across Africa.</p>
            </header>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group max-w-3xl mb-8">
                <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative flex items-center glass-card rounded-[2rem] border-zinc-200 dark:border-white/10 shadow-2xl p-2 bg-white dark:bg-[#121214]">
                    <Search className="ml-5 text-zinc-500 shrink-0" size={22} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by keyword, region, or sector..."
                        className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-lg placeholder:text-zinc-600 font-medium text-zinc-900 dark:text-white"
                    />
                    <button type="submit" className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center gap-2 shrink-0">
                        Search <ArrowRight size={18} />
                    </button>
                </div>
            </form>

            {/* Category Tabs */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border ${activeCategory === cat
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "glass-card border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                            }`}
                    >
                        {cat}
                        {!loading && (
                            <span className="ml-2 text-[10px] opacity-70">
                                ({allResults.filter(o => cat === "All" || o.type === cat || o.type + "s" === cat || o.type === cat.slice(0, -1)).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Results */}
            {loading ? (
                <SkeletonGrid count={8} />
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 space-y-4 opacity-50">
                    <Zap className="mx-auto" size={48} />
                    <h3 className="text-xl font-bold">No results found</h3>
                    <p className="text-zinc-500">Try different keywords or category filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((opp, i) => (
                        <OpportunityCard key={opp.id} opp={opp} index={i} onOpen={o => setSelectedOpp(o)} />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedOpp && (
                    <OpportunityModal opp={selectedOpp} onClose={() => setSelectedOpp(null)} onDraft={o => { setSelectedOpp(null); setComposingOpp(o); }} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {composingOpp && <EOIComposer opp={composingOpp} onClose={() => setComposingOpp(null)} />}
            </AnimatePresence>
        </div>
    );
}
