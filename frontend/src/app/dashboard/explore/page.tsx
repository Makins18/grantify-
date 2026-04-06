"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowRight, Zap, SlidersHorizontal } from "lucide-react";
import { LazyOpportunityCard, Opportunity } from "@/components/LazyOpportunityCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import OpportunityModal from "@/components/OpportunityModal";
import EOIComposer from "@/components/EOIComposer";
import { AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Tenders", "Grants", "Scholarships"];

const DEMO: Opportunity[] = [
    { id: 1, title: "Lagos Smart City Infrastructure", country: "Nigeria", type: "Tender", value: "₦5.8B", deadline: "Mar 12, 2026", aiScore: 98 },
    { id: 2, title: "Sustainable Agriculture Tech Grant", country: "Kenya", type: "Grant", value: "$250K", deadline: "Apr 05, 2026", aiScore: 94 },
    { id: 3, title: "African Youth Leadership Scholarship", country: "Pan-Africa", type: "Scholarship", value: "Full", deadline: "May 20, 2026", aiScore: 91 },
    { id: 4, title: "Solar Energy Expansion — Gauteng", country: "South Africa", type: "Tender", value: "R12.4M", deadline: "Mar 30, 2026", aiScore: 89 },
    { id: 5, title: "Digital Health Innovation Grant", country: "Ghana", type: "Grant", value: "$180K", deadline: "Jun 10, 2026", aiScore: 87 },
    { id: 6, title: "Pan-African Fintech Accelerator", country: "Pan-Africa", type: "Grant", value: "$500K", deadline: "Apr 22, 2026", aiScore: 85 },
    { id: 7, title: "Kigali Smart Mobility Tender", country: "Rwanda", type: "Tender", value: "$3.2M", deadline: "May 01, 2026", aiScore: 83 },
    { id: 8, title: "East Africa STEM Postgrad Scholarship", country: "East Africa", type: "Scholarship", value: "Full+", deadline: "Jul 15, 2026", aiScore: 80 },
    { id: 9, title: "Nigeria Road Infrastructure Bid", country: "Nigeria", type: "Tender", value: "₦12B", deadline: "Sep 10, 2026", aiScore: 74 },
    { id: 10, title: "Africa CDC Health Systems Award", country: "Pan-Africa", type: "Grant", value: "$2M", deadline: "Oct 01, 2026", aiScore: 72 },
    { id: 11, title: "Nairobi Water Treatment Tender", country: "Kenya", type: "Tender", value: "$8.4M", deadline: "Aug 01, 2026", aiScore: 78 },
    { id: 12, title: "West Africa Digital Inclusion Grant", country: "Ghana", type: "Grant", value: "$300K", deadline: "Jun 25, 2026", aiScore: 76 },
];

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

    // Fetch from backend; fall back to local demo data
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const API = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3001";
                const res = await fetch(`${API}/api/v1/opportunities`);
                const data = await res.json();
                if (!cancelled) setAllResults(data?.length > 0 ? data : DEMO);
            } catch {
                if (!cancelled) setAllResults(DEMO);
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

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); /* filtering is reactive */ };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-bold mb-2">Strategic Discovery</h1>
                <p className="text-slate-400">Harness semantic vector search to find high-probability opportunities across Africa.</p>
            </header>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative group max-w-3xl mb-8">
                <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative flex items-center glass-card rounded-[2rem] border-white/10 shadow-2xl p-2">
                    <Search className="ml-5 text-slate-500 shrink-0" size={22} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search by keyword, region, or sector..."
                        className="flex-1 bg-transparent border-none outline-none px-5 py-4 text-lg placeholder:text-slate-600 font-medium"
                    />
                    <button type="submit" className="px-8 py-4 bg-primary text-background font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center gap-2 shrink-0">
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
                                ? "bg-primary text-background border-primary shadow-lg shadow-primary/20"
                                : "glass-card border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
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
                <div className="h-8 w-px bg-white/10 mx-2" />
                <button className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-2xl text-slate-400 border border-white/5 hover:text-white text-sm font-bold">
                    <SlidersHorizontal size={16} /> Filters
                </button>
            </div>

            {/* Results */}
            {loading ? (
                <SkeletonGrid count={8} />
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 space-y-4 opacity-50">
                    <Zap className="mx-auto" size={48} />
                    <h3 className="text-xl font-bold">No results found</h3>
                    <p className="text-slate-500">Try different keywords or category filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map((opp, i) => (
                        <LazyOpportunityCard key={opp.id} opp={opp} index={i} onOpen={o => setSelectedOpp(o)} />
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
