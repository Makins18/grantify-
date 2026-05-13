"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
    BarChart3, Award, MapPin, Calendar, Star, 
    Volume2, ShieldCheck, ShieldAlert, ShieldX 
} from "lucide-react";
import { Opportunity } from "@/lib/types";

interface Props {
    opp: Opportunity;
    index: number;
    onOpen?: (opp: Opportunity) => void;
}

export default function OpportunityCard({ opp, index, onOpen }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
    
    const score = opp.matchScore || opp.aiScore || 0;
    
    const statusIcon = {
        "Verified": <ShieldCheck className="text-primary w-4 h-4" />,
        "Uncertain": <ShieldAlert className="text-amber-500 w-4 h-4" />,
        "Scam": <ShieldX className="text-red-500 w-4 h-4" />
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.005 }}
            onClick={() => onOpen?.(opp)}
            className="glass-card p-6 rounded-3xl flex flex-col gap-6 group cursor-pointer border border-white/5 hover:border-primary/20 transition-all shadow-xl"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                        {opp.type === "Tender" ? (
                            <BarChart3 className="text-primary w-6 h-6" />
                        ) : (
                            <Award className="text-secondary w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{opp.title}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest">
                                {opp.type}
                            </span>
                            {opp.verificationStatus && (
                                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500 font-bold uppercase tracking-widest border border-white/5">
                                    {statusIcon[opp.verificationStatus]} {opp.verificationStatus}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500 font-medium">
                            <span className="flex items-center gap-1"><MapPin size={14} /> {opp.country}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> {opp.deadline}</span>
                            <span className="font-black text-zinc-900 dark:text-zinc-300">{opp.value}</span>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-2 text-primary">
                        <Star size={14} fill="currentColor" />
                        <span className="font-black">{score}% Match</span>
                    </div>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">AI Accuracy 99.8%</p>
                </div>
            </div>

            {opp.description && (
                <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                    {opp.description}
                </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                    {opp.audioUrl && (
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">
                            <Volume2 size={14} /> Audio Brief
                        </button>
                    )}
                    {opp.effortLevel && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Effort: <span className={opp.effortLevel === "High" ? "text-rose-500" : "text-emerald-500"}>{opp.effortLevel}</span>
                        </span>
                    )}
                </div>
                
                <button className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                    Quick Apply
                </button>
            </div>
        </motion.div>
    );
}
