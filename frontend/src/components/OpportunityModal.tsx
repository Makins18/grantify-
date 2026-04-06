"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Target,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Zap,
    Clock,
    Globe,
    DollarSign,
    PenTool,
    ShieldCheck,
    Cpu
} from "lucide-react";
import { Opportunity } from "./LazyOpportunityCard";
import { useSubscription } from "@/context/SubscriptionContext";

interface Props {
    opp: Opportunity | null;
    onClose: () => void;
    onDraft: (opp: Opportunity) => void;
}

export default function OpportunityModal({ opp, onClose, onDraft }: Props) {
    const { stealthMode } = useSubscription();
    if (!opp) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-5xl max-h-[95vh] glass-card rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_120px_rgba(0,229,255,0.15)] border-white/10"
                >
                    {/* Header Image/Background */}
                    <div className="h-40 bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-3 bg-black/40 hover:bg-black/60 rounded-2xl transition-all backdrop-blur-md border border-white/10 group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                        </button>
                        <div className="absolute -bottom-8 left-12 p-5 glass-card rounded-3xl border-primary/40 shadow-2xl bg-slate-900/80 backdrop-blur-2xl">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-background shadow-lg shadow-primary/30">
                                <Zap size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-14 pt-16 space-y-12 scrollbar-thin scrollbar-thumb-white/10">
                        {/* Title & Core Meta */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                        <ShieldCheck size={12} className="text-primary" />
                                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{opp.type}</span>
                                    </div>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{opp.id}</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black max-w-3xl leading-[1.1] tracking-tight">{opp.title}</h2>
                            </div>

                            <div className="flex items-center gap-5 p-5 glass-card rounded-[2rem] border-white/10 pr-10 bg-white/5 shadow-inner">
                                <MatchGauge score={opp.aiScore} />
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">{stealthMode ? 'Alignment Efficiency' : 'Vector Space Match'}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black tracking-tighter">{opp.aiScore}%</span>
                                        <span className="text-sm font-bold text-primary italic">{stealthMode ? 'Optimal' : 'Match'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatItem icon={<Globe className="text-primary" size={20} />} label="Territory" value={opp.country} />
                            <StatItem icon={<DollarSign className="text-emerald-400" size={20} />} label="Valuation" value={opp.value} />
                            <StatItem icon={<Clock className="text-amber-400" size={20} />} label="Deadlock" value={opp.deadline} />
                            <StatItem icon={<Cpu className="text-secondary" size={20} />} label="Logic Tier" value={opp.aiScore > 90 ? "Top Alpha" : "Strategic"} />
                        </div>

                        {/* AI Intelligence Section */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20">
                                    <Target size={22} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">{stealthMode ? 'Proprietary Inference Engine' : 'Advanced RAG Analysis'}</h3>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="p-8 rounded-[2.5rem] bg-emerald-500/[0.03] border border-emerald-500/10 space-y-5 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                                            <CheckCircle2 size={20} className="text-emerald-400" />
                                        </div>
                                        <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">Growth Catalysts</p>
                                    </div>
                                    <ul className="space-y-4">
                                        <ReasonItem text="Matches your high-frequency deployment history in similar verticals." />
                                        <ReasonItem text="High semantic overlap with your previous 'Project Odyssey' documentation." />
                                        <ReasonItem text="Your technical architecture satisfies 98% of the 'Digital Backbone' requirement." />
                                    </ul>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-amber-500/[0.03] border border-amber-500/10 space-y-5 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-xl">
                                            <AlertCircle size={20} className="text-amber-400" />
                                        </div>
                                        <p className="text-sm font-black text-amber-400 uppercase tracking-widest">Risk Mitigation</p>
                                    </div>
                                    <ul className="space-y-4">
                                        <ReasonItem text="Compressed timeline: Requires rapid resource allocation within 72 hours." />
                                        <ReasonItem text="Pending compliance validation for regional data residency." />
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Tags */}
                        <div className="flex flex-wrap gap-3">
                            {['Grounded', 'Verified', 'ChromaV2', 'Gemini-1.5'].map(tag => (
                                <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-10 bg-slate-900/40 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-3xl">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-4 text-slate-400 border border-white/5 shadow-inner">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                                    <Cpu size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Active Grounding</span>
                                    <span className="text-[10px] opacity-60">Verified via ChromaDB Enterprise & Gemini V2</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={onClose}
                                className="px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex-1 md:flex-none border border-white/10"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={() => onDraft(opp)}
                                className="px-10 py-5 bg-primary text-background rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group flex-1 md:flex-none shadow-xl shadow-primary/30"
                            >
                                <PenTool size={18} />
                                Generate EOI Draft
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function MatchGauge({ score }: { score: number }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--secondary)" />
                    </linearGradient>
                </defs>
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                    fill="transparent"
                />
                <motion.circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: "circOut", delay: 0.3 }}
                />
            </svg>
            <div className="absolute flex flex-col items-center leading-none">
                <span className="text-[10px] font-black text-primary opacity-50 uppercase tracking-tighter">AI</span>
                <span className="text-lg font-black tracking-tighter text-white">{score}</span>
            </div>

            {/* Pulse effect */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full -z-10"
            />
        </div>
    );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">{icon}</div>
            <div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">{label}</p>
                <p className="text-sm font-black text-white truncate">{value}</p>
            </div>
        </div>
    );
}

function ReasonItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-4 text-[13px] text-slate-400 leading-relaxed font-medium">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_8px_var(--primary)]" />
            {text}
        </li>
    );
}
