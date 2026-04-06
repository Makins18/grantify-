"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart3, Award, MapPin, Calendar, Star, MoreVertical } from "lucide-react";

export interface Opportunity {
    id: number | string;
    title: string;
    country: string;
    type: string;
    value: string;
    deadline: string;
    aiScore: number;
    is_priority?: boolean;
}

interface Props {
    opp: Opportunity;
    index: number;
    onOpen: (opp: Opportunity) => void;
}

export function LazyOpportunityCard({ opp, index, onOpen }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    // Trigger animation once the card enters the viewport
    const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
            onClick={() => onOpen(opp)}
            className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
        >
            <div className="flex items-start gap-5">
                <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center shrink-0 border-l-4 border-l-primary">
                    {opp.type === "Tender" ? (
                        <BarChart3 className="text-primary w-6 h-6" />
                    ) : (
                        <Award className="text-secondary w-6 h-6" />
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg">{opp.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">
                            {opp.type}
                        </span>
                        {opp.is_priority && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase tracking-widest flex items-center gap-1 animate-pulse">
                                <Star size={10} fill="currentColor" /> Priority Access
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {opp.country}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {opp.deadline}</span>
                        <span className="font-bold text-slate-300">{opp.value}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                {/* Unique Grantify Success Predictor */}
                <div className="hidden lg:flex flex-col items-center gap-1 group/predictor">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <motion.circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray="150.8"
                                initial={{ strokeDashoffset: 150.8 }}
                                animate={inView ? { strokeDashoffset: 150.8 - (150.8 * (opp.aiScore || 85)) / 100 } : { strokeDashoffset: 150.8 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-secondary"
                            />
                        </svg>
                        <span className="absolute text-[10px] font-black text-white">{opp.aiScore}%</span>
                    </div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter group-hover/predictor:text-secondary transition-colors text-center leading-none">
                        Success<br/>Predictor
                    </span>
                </div>

                <div className="text-right hidden md:block">
                    <div className="flex items-center gap-2 justify-end text-primary mb-1">
                        <Star size={14} fill="currentColor" />
                        <span className="font-bold">{opp.aiScore}% Match</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        Grantify Analyzed
                    </p>
                </div>
                <button className="px-6 py-2 bg-white/5 rounded-xl font-bold hover:bg-primary hover:text-background transition-all border border-white/5 shadow-xl">
                    Apply Now
                </button>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>
        </motion.div>
    );
}
