"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Database,
    Globe,
    Search,
    Cpu,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";

interface PulseEvent {
    id: string;
    type: "discovery" | "intelligence" | "analysis" | "verification";
    message: string;
    time: string;
}

const STEALTH_POOL = [
    { type: "discovery", message: "New strategic opportunity identified in Lagos" },
    { type: "intelligence", message: "Knowledge base updated with regional insights" },
    { type: "analysis", message: "Strategic compatibility score optimized for your profile" },
    { type: "verification", message: "Market verification completed for Infrastructure project" },
];

const ENGINE_POOL = [
    { type: "scrape", message: "Spider-07 completed crawl of Nigeria Tenders Portal" },
    { type: "vector", message: "Faiss index updated: 14 new embeddings synchronized" },
    { type: "ai", message: "Gemini 1.5 Flash: Strategic fit inference complete (98%)" },
    { type: "search", message: "Semantic search: Top-K results retrieved from Redis" },
];

export default function SystemPulse() {
    const [events, setEvents] = useState<PulseEvent[]>([]);

    const { stealthMode } = useSubscription();

    useEffect(() => {
        const pool = stealthMode ? STEALTH_POOL : ENGINE_POOL;
        // Initial events
        const initial = pool.slice(0, 3).map((e, i) => ({
            ...e,
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } as PulseEvent));
        setEvents(initial);

        // Random event interval
        const interval = setInterval(() => {
            const randomBase = pool[Math.floor(Math.random() * pool.length)];
            const newEvent: PulseEvent = {
                ...randomBase,
                id: Math.random().toString(36).substr(2, 9),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: randomBase.type as any
            };

            setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
        }, 8000);

        return () => clearInterval(interval);
    }, [stealthMode]);

    return (
        <div className="glass-card rounded-3xl p-6 space-y-4 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary animate-pulse">
                        <RefreshCw size={16} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">System Pulse</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Real-Time</span>
                </div>
            </div>

            <div className="space-y-3 min-h-[220px]">
                <AnimatePresence mode="popLayout">
                    {events.map((event) => {
                        const label = stealthMode
                            ? event.type
                            : (event.type === "discovery" ? "scrape" :
                                event.type === "intelligence" ? "vector" :
                                    event.type === "analysis" ? "ai" : "search");

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="flex items-start gap-4 p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5"
                            >
                                <div className={`mt-1 p-2 rounded-lg ${getIconBg(event.type)} ${getIconColor(label)}`}>
                                    {getIcon(event.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${getIconColor(label)}`}>
                                            {label}
                                        </span>
                                        <span className="text-[9px] text-slate-600 font-mono tracking-tighter">{event.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-tight truncate">{event.message}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                <span>Global Connectivity</span>
                <span className="text-emerald-500">99.9% Up</span>
            </div>
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case "discovery": return <Globe size={12} />;
        case "intelligence": return <Database size={12} />;
        case "analysis": return <Cpu size={12} />;
        case "verification": return <Search size={12} />;
        default: return <Zap size={12} />;
    }
}

function getIconBg(type: string) {
    switch (type) {
        case "discovery": return "bg-blue-500/10";
        case "intelligence": return "bg-purple-500/10";
        case "analysis": return "bg-primary/10";
        case "verification": return "bg-secondary/10";
        default: return "bg-white/5";
    }
}

function getIconColor(type: string) {
    switch (type) {
        case "scrape": return "text-blue-400";
        case "vector": return "text-purple-400";
        case "ai": return "text-primary";
        case "search": return "text-secondary";
        default: return "text-slate-400";
    }
}
