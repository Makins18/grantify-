"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, Clock, Info, CheckCircle2, AlertCircle, Trash2, BellOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type NotifType = "match" | "system" | "alert" | "success";
interface Notification {
    id: string | number; type: NotifType; title: string; message: string; time: string; read: boolean;
}

const ICON: Record<NotifType, React.ReactNode> = {
    match: <CheckCircle2 size={18} />,
    alert: <AlertCircle size={18} />,
    success: <CheckCircle2 size={18} />,
    system: <Info size={18} />,
};
const COLOR: Record<NotifType, string> = {
    match: "bg-primary/20 text-primary",
    alert: "bg-amber-500/20 text-amber-400",
    success: "bg-emerald-500/20 text-emerald-400",
    system: "bg-blue-500/20 text-blue-400",
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifs = async () => {
            const { data } = await supabase.from('system_pulse').select('*').order('created_at', { ascending: false }).limit(20);
            if (data && data.length > 0) {
                setNotifications(data.map(d => ({
                    id: d.id,
                    type: (d.type === 'discovery' ? 'system' : d.type === 'analysis' ? 'match' : d.type === 'verification' ? 'success' : 'alert') as NotifType,
                    title: d.type.charAt(0).toUpperCase() + d.type.slice(1) + ' Alert',
                    message: d.message,
                    time: new Date(d.created_at).toLocaleTimeString(),
                    read: false
                })));
            } else {
                // Fallback to static if db is empty for demo purposes
                setNotifications([
                    { id: 1, type: "match", title: "New Strategic Fit Identified", message: "A 98% match for 'Lagos Smart City Infrastructure' has been detected by the RAG engine.", time: "2 mins ago", read: false },
                    { id: 2, type: "system", title: "Intelligence Core Updated", message: "ChromaDB synchronized with 24 new West African regional portal datasets via Gemini Embeddings.", time: "1 hour ago", read: true }
                ]);
            }
        };
        fetchNotifs();
    }, []);

    const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
    const markRead = (id: string | number) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    const remove = (id: string | number) => setNotifications(n => n.filter(x => x.id !== id));
    const unread = notifications.filter(n => !n.read).length;

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-4 text-slate-500">
                        <a href="/dashboard" className="text-sm hover:text-white transition-colors">Dashboard</a>
                        <ChevronRight size={14} />
                        <span className="text-sm text-white">Notifications</span>
                    </div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Bell className="text-primary" /> Intelligence Feed
                        {unread > 0 && (
                            <span className="px-3 py-1 bg-primary text-background text-xs font-black rounded-full">{unread} new</span>
                        )}
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm">Real-time alerts and strategic updates from your tracked opportunities.</p>
                </div>
                {unread > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-2 px-6 py-3 glass-card rounded-xl text-sm font-bold hover:bg-white/10 transition-all border border-white/10 self-start md:self-auto">
                        <BellOff size={16} /> Mark all read
                    </button>
                )}
            </header>

            <div className="max-w-4xl space-y-3">
                <AnimatePresence initial={false}>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => markRead(n.id)}
                            className={`group p-5 glass-card rounded-3xl border transition-all hover:bg-white/[0.03] flex items-start gap-4 cursor-pointer ${!n.read ? "bg-primary/[0.04] border-primary/10" : "bg-white/[0.01] border-white/5"
                                }`}
                        >
                            <div className={`p-3 rounded-2xl shrink-0 ${COLOR[n.type]}`}>{ICON[n.type]}</div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-bold text-sm leading-tight">{n.title}</h3>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0 whitespace-nowrap">
                                        <Clock size={10} /> {n.time}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                <button
                                    onClick={e => { e.stopPropagation(); remove(n.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-all rounded-lg hover:bg-rose-500/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                    <div className="text-center py-32 glass-card rounded-3xl border-dashed border-white/10">
                        <BellOff size={48} className="mx-auto mb-4 text-slate-600" />
                        <p className="text-lg font-bold text-slate-400">All caught up!</p>
                        <p className="text-sm text-slate-500 mt-1">No new alerts in the intelligence stream.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
