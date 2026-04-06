"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronRight, Clock, Target, ArrowUpRight, Search, Trash2, PenTool } from "lucide-react";
import EOIComposer from "@/components/EOIComposer";
import { Opportunity } from "@/components/LazyOpportunityCard";
import { supabase } from "@/lib/supabaseClient";

interface Draft {
    id: string | number; title: string; country: string; type: string; value: string;
    deadline: string; aiScore: number; status: string; progress: number; lastEdit: string;
}

const STATUS_COLOR: Record<string, string> = {
    "Drafting": "text-primary bg-primary/10 border-primary/20",
    "Review": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    "Under Revision": "text-rose-400 bg-rose-400/10 border-rose-400/20",
    "Submitted": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function ApplicationsPage() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [query, setQuery] = useState("");
    const [composingOpp, setComposingOpp] = useState<Opportunity | null>(null);

    useEffect(() => {
        const fetchDrafts = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            
            const [ { data: apps }, { data: saved } ] = await Promise.all([
                supabase.from('applications').select('*').eq('user_id', user.id),
                supabase.from('saved_opportunities').select('*').eq('user_id', user.id)
            ]);

            if (apps && saved && apps.length > 0) {
                const merged = apps.map(app => {
                    const opp = saved.find(s => s.opportunity_id === app.opportunity_id) || {} as any;
                    return {
                        id: app.id,
                        title: opp.title || 'Unknown Opportunity',
                        country: opp.country || 'Unknown',
                        type: opp.type || 'Grant',
                        value: opp.value || '-',
                        deadline: opp.deadline || '-',
                        aiScore: opp.ai_score || 0,
                        status: app.status || 'Drafting',
                        progress: app.progress || 0,
                        lastEdit: app.last_edit ? new Date(app.last_edit).toLocaleDateString() : 'Just now'
                    };
                });
                setDrafts(merged);
            } else {
                setDrafts([
                    { id: 1, title: "Lagos Smart City Infrastructure", country: "Nigeria", type: "Tender", value: "₦5.8B", deadline: "Mar 12, 2026", aiScore: 98, status: "Drafting", progress: 65, lastEdit: "14 mins ago" },
                    { id: 2, title: "African Youth Leadership Scholarship", country: "Pan-Africa", type: "Scholarship", value: "Full", deadline: "May 20, 2026", aiScore: 91, status: "Review", progress: 90, lastEdit: "2 hours ago" },
                ]);
            }
        };
        fetchDrafts();
    }, []);

    const filtered = drafts.filter(d =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.country.toLowerCase().includes(query.toLowerCase())
    );

    const removeDraft = async (id: string | number) => {
        setDrafts(d => d.filter(x => x.id !== id));
        if (typeof id === 'string') {
            await supabase.from('applications').delete().eq('id', id);
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4 text-slate-500">
                        <a href="/dashboard" className="text-sm hover:text-white transition-colors">Dashboard</a>
                        <ChevronRight size={14} />
                        <span className="text-sm text-white">My Applications</span>
                    </div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FileText className="text-primary" /> Application Portfolio
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm">Track and refine your active drafts and submitted interests.</p>
                </div>
                <div className="flex gap-3 self-start md:self-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Filter applications..."
                            className="pl-10 pr-4 py-2.5 glass-card rounded-xl border-none outline-none focus:ring-1 ring-primary/50 text-sm w-64"
                        />
                    </div>
                    <a href="/dashboard/explore" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background rounded-xl font-bold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-primary/20">
                        <PenTool size={16} /> New Draft
                    </a>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total Drafts", value: String(drafts.length) },
                    { label: "In Progress", value: String(drafts.filter(d => d.status === "Drafting" || d.status === "Under Revision").length) },
                    { label: "In Review", value: String(drafts.filter(d => d.status === "Review").length) },
                    { label: "Submitted", value: String(drafts.filter(d => d.status === "Submitted").length) },
                ].map(({ label, value }) => (
                    <div key={label} className="glass-card rounded-2xl p-4 border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{label}</p>
                        <p className="text-3xl font-black">{value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <AnimatePresence initial={false}>
                    {filtered.map(app => (
                        <motion.div
                            key={app.id}
                            layout
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="group glass-card rounded-3xl p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="space-y-3 flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="p-2.5 bg-primary/20 text-primary rounded-xl shrink-0"><FileText size={18} /></div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold truncate">{app.title}</h3>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{app.country}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_COLOR[app.status] ?? "text-slate-400 bg-white/5 border-white/10"}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-5 flex-wrap">
                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                        <Target size={11} className="text-secondary" /> RAG Indexed
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                        <Clock size={11} className="text-primary" /> {app.lastEdit}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto shrink-0">
                                <div className="flex-1 md:w-44 space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-slate-500">Readiness</span>
                                        <span className="text-primary">{app.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${app.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${app.progress === 100 ? "bg-emerald-400" : "bg-primary"}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setComposingOpp({ id: app.id, title: app.title, country: app.country, type: app.type as any, value: app.value, deadline: app.deadline, aiScore: app.aiScore })}
                                        className="p-3 bg-primary/10 hover:bg-primary hover:text-background text-primary rounded-2xl transition-all"
                                        title="Resume Editing"
                                    >
                                        <ArrowUpRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => removeDraft(app.id)}
                                        className="p-3 glass-card hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove Draft"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="text-center py-28 glass-card rounded-3xl border-dashed border-white/10">
                        <FileText size={48} className="mx-auto mb-4 text-slate-600" />
                        <p className="text-lg font-bold">No Applications Found</p>
                        <p className="text-sm text-slate-500 mt-2">Start by exploring opportunities and drafting an EOI.</p>
                        <a href="/dashboard/explore" className="inline-block mt-8 px-8 py-3 bg-primary text-background font-bold rounded-xl hover:scale-[1.02] transition-all">
                            Explore Opportunities
                        </a>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {composingOpp && <EOIComposer opp={composingOpp} onClose={() => setComposingOpp(null)} />}
            </AnimatePresence>
        </div>
    );
}
