"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    FileText,
    Sparkles,
    Copy,
    Download,
    ChevronRight,
    Send,
    Loader2,
    Trash2,
    Type
} from "lucide-react";
import { Opportunity } from "./LazyOpportunityCard";
import { useSubscription } from "@/context/SubscriptionContext";
import { HelpCircle, Info, Lock } from "lucide-react";

interface Props {
    opp: Opportunity | null;
    onClose: () => void;
}

export default function EOIComposer({ opp, onClose }: Props) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [tone, setTone] = useState("Professional");
    const { isPremium } = useSubscription();

    const IN_DEPTH_TIPS = [
        { title: "Compliance Core", tip: "Ensure section 4.2 specifically addresses the the local content policy in " + (opp?.country || "region") },
        { title: "Financial Narrative", tip: "Our intelligence suggests a focus on OpEx optimization over CapEx for this specific grant provider." },
        { title: "Technical Edge", tip: "Explicitly mention ISO-9001 certification to gain 5 extra points in the automated scoring phase." }
    ];

    useEffect(() => {
        if (opp) {
            setLoading(true);
            // Simulate AI generation
            setTimeout(() => {
                const draft = `
SUBJECT: Expression of Interest - ${opp.title}

Dear Procurement Committee,

We are pleased to submit this Expression of Interest for the ${opp.title} project. Having successfully executed several projects in the ${opp.country} region, our team is uniquely positioned to deliver exceptional value.

Our core approach aligns with the requirement for ${opp.type === "Tender" ? "efficient public infrastructure" : "sustainable development"}. We have identified that our technical capabilities in this sector will ensure a 99% uptime and compliance with all local regulations.

We look forward to providing a full technical and commercial proposal.

Sincerely,
[Your Name/Organization]
        `.trim();
                setContent(draft);
                setLoading(false);
            }, 2500);
        }
    }, [opp]);

    if (!opp) return null;

    return (
        <motion.div
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-background flex flex-col lg:flex-row"
        >
            {/* Left: Metadata Sidebar */}
            <div className="w-full md:w-[350px] border-r border-white/5 p-8 space-y-8 bg-white/[0.01]">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
                >
                    <X size={18} className="group-hover:rotate-90 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Exit Composer</span>
                </button>

                <div className="space-y-4">
                    <div className="p-4 glass-card rounded-2xl border-primary/20 bg-primary/5">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Context Target</p>
                        <h3 className="text-sm font-bold line-clamp-2">{opp.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl text-xs text-slate-400">
                        <FileText size={14} />
                        <span>Full Tender Specs Indexed</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Writing Controls</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <ToneButton label="Professional" active={tone === "Professional"} onClick={() => setTone("Professional")} />
                        <ToneButton label="Persuasive" active={tone === "Persuasive"} onClick={() => setTone("Persuasive")} />
                        <ToneButton label="Technical" active={tone === "Technical"} onClick={() => setTone("Technical")} />
                    </div>
                </div>

                <div className="mt-auto p-6 glass-card rounded-2xl bg-secondary/5 border-secondary/20">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                        <Sparkles size={16} />
                        <span className="text-xs font-bold">AI Assistant</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                        Drafting based on your historical success in {opp.country}. tone set to {tone}.
                    </p>
                </div>
            </div>

            {/* Middle: Workspace */}
            <div className="flex-1 flex flex-col bg-slate-900/20">
                <header className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                            <Type size={18} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">AI Draft Composer</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Contextual Intelligence Workspace</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-3 glass-card rounded-xl hover:bg-white/5 transition-colors" title="Copy to Clipboard">
                            <Copy size={18} />
                        </button>
                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                            <Download size={18} />
                            Export PDF
                        </button>
                        <button className="px-6 py-3 bg-primary text-background rounded-xl font-bold hover:bg-white hover:text-primary transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                            <Send size={18} />
                            Submit Interest
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="max-w-3xl mx-auto min-h-full glass-card rounded-[2rem] p-12 md:p-16 shadow-2xl relative">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg">Synthesizing Proposal...</p>
                                    <p className="text-sm text-slate-500">Analyzing {opp.title} requirements</p>
                                </div>
                            </div>
                        ) : (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-full bg-transparent border-none outline-none resize-none font-sans text-lg leading-relaxed text-slate-200 placeholder-slate-600"
                                placeholder="The AI is thinking..."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Premium Help */}
            <div className="w-full lg:w-[320px] border-l border-white/5 p-8 bg-white/[0.01] overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <HelpCircle size={18} className="text-secondary" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">In-Depth Guidance</h4>
                </div>

                {isPremium ? (
                    <div className="space-y-6">
                        {IN_DEPTH_TIPS.map((tip, i) => (
                            <div key={i} className="p-5 glass-card rounded-2xl border-white/5 bg-white/5">
                                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-emerald-500" /> {tip.title}
                                </p>
                                <p className="text-xs text-slate-400 leading-relaxed italic">"{tip.tip}"</p>
                            </div>
                        ))}
                        <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Info size={12} /> Pro Tip
                            </p>
                            <p className="text-xs text-slate-300">Submit before Thursday 2 PM to ensure priority human review based on historical logs.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                            <Lock size={24} className="text-slate-500" />
                        </div>
                        <div>
                            <h5 className="font-bold text-sm mb-2 text-white">Unlock Expert Insights</h5>
                            <p className="text-xs text-slate-500 leading-relaxed px-4">Our premium Intelligence Core provides section-by-section strategic guidance for winning bids.</p>
                        </div>
                        <a href="/dashboard/settings" className="w-full py-3 bg-secondary text-background font-bold rounded-xl text-xs uppercase tracking-widest hover:opacity-90 transition-all">Upgrade Now</a>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function CheckCircle2({ className, size }: { className?: string; size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function ToneButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between group ${active
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"
                }`}
        >
            {label}
            {active && <ChevronRight size={14} />}
        </button>
    );
}
