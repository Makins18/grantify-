"use client";

import { useState } from "react";
import { Search, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsSearching(true);
        setTimeout(() => {
            router.push(`/dashboard?q=${encodeURIComponent(query)}`);
        }, 600);
    };

    return (
        <div className="flex-1 bg-white dark:bg-[#0A0A0B] relative overflow-hidden font-sans">
            {/* ── Background Elements ── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            {/* ── Hero Section ── */}
            <section className="relative z-10 pt-20 md:pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-8 inline-block">
                                Nigeria's Intelligence Core for Funding
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-zinc-900 dark:text-white">
                                Scholarships <br />
                                <span className="text-zinc-400 dark:text-biege-600">Without the Noise.</span>
                            </h1>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-xl mb-12 font-medium leading-relaxed">
                                The intelligent, scam-free engine for Nigerian students. 
                                AI-powered writing, verified integrity, and global opportunities at your fingertips.
                            </p>

                            {/* Search Interface */}
                            <div className="max-w-xl relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <form onSubmit={handleSearch} className="relative bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-white/10 rounded-2xl p-2 flex items-center shadow-xl">
                                    <div className="pl-4 text-zinc-400">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="What are you looking to fund?"
                                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-500 text-lg font-medium"
                                    />
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                                    >
                                        {isSearching ? <Loader2 size={16} className="animate-spin" /> : "Discover"}
                                    </button>
                                </form>

                                <div className="mt-6 flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                                    <span className="text-zinc-400">Trending:</span>
                                    {["UNILAG", "Engineering", "Masters", "STEM"].map((t) => (
                                        <button key={t} className="hover:text-primary transition-colors">#{t}</button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 bg-zinc-100 dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Sparkles size={48} className="text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Vector Synthesis</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Matching your profile with <br/> neural precision.</p>
                                </div>
                                
                                {/* Floating Badges */}
                                <div className="absolute top-12 right-12 bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-white/5 animate-bounce-slow">
                                    <ShieldCheck className="text-primary mb-2" size={24} />
                                    <div className="h-1.5 w-12 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                </div>
                                <div className="absolute bottom-12 left-12 bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-white/5 animate-float">
                                    <div className="flex gap-1 mb-2">
                                        {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary/40" />)}
                                    </div>
                                    <div className="h-1.5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                </div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Feature Grid ── */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={Sparkles}
                            title="AI Draft Engine"
                            desc="Convert document context into winning proposals instantly with neural synthesis. Our models are trained on successful Nigerian grant applications."
                        />
                        <FeatureCard 
                            icon={Search}
                            title="Vector Search"
                            desc="RAG-powered matching finds opportunities specifically for your unique profile, avoiding the clutter of irrelevant grants."
                        />
                        <FeatureCard 
                            icon={ShieldCheck}
                            title="Vetted Integrity"
                            desc="100% scam-free platform. Every grant is manually verified by our Nigerian compliance team to ensure legitimate funding paths."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}


function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-primary/20 transition-all group"
        >
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <Icon size={24} className="text-zinc-500 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
