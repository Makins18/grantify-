"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, Send, X, ExternalLink, ChevronDown,
    Loader2, ListRestart, Terminal, Search, BrainCircuit,
    Layers, Share2, Copy, Linkedin, Mail as MailIcon, Check
} from "lucide-react";
import Logo from "./Logo";
import { useSubscription } from "@/context/SubscriptionContext";

interface Message {
    role: "user" | "model";
    content: string;
    sources?: any[];
    thought_trace?: string[];
}

// ── DRY Subcomponents ──────────────────────────────────────

const ShareButton = ({ icon: Icon, colorClass, onClick }: { icon: any, colorClass: string, onClick: () => void }) => (
    <button onClick={onClick} className={`p-1.5 rounded-lg transition-all ${colorClass}`}>
        <Icon size={14} />
    </button>
);

const MessageActions = ({ content, idx, copyIdx, onCopy, onShare }: any) => (
    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1">
            <button 
                onClick={() => onCopy(content, idx)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-primary flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
            >
                {copyIdx === String(idx) ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copyIdx === String(idx) ? "Copied" : "Copy"}
            </button>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-1">Share:</span>
            <ShareButton icon={MessageCircle} colorClass="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400" onClick={() => onShare(content, 'whatsapp')} />
            <ShareButton icon={Linkedin} colorClass="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" onClick={() => onShare(content, 'linkedin')} />
            <ShareButton icon={MailIcon} colorClass="bg-slate-500/10 hover:bg-slate-500/20 text-slate-400" onClick={() => onShare(content, 'email')} />
        </div>
    </div>
);

const ThoughtTraceViewer = ({ trace, showTrace, onToggle, idx }: any) => (
    <div className="mt-3 overflow-hidden">
        <button
            onClick={() => onToggle(showTrace === String(idx) ? null : String(idx))}
            className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider hover:opacity-80 transition-opacity"
        >
            <Terminal size={12} />
            {showTrace === String(idx) ? "Hide Trace" : "Thinking Pulse"}
            <ChevronDown size={12} className={`transition-transform ${showTrace === String(idx) ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
            {showTrace === String(idx) && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1.5"
                >
                    {trace.map((step: string, sIdx: number) => (
                        <div key={sIdx} className="flex gap-2 items-start text-[11px] font-mono text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5">
                            <span className="text-primary/50">{sIdx + 1}.</span>
                            <span>{step}</span>
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const CitationVectors = ({ sources }: { sources: any[] }) => (
    <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Layers size={10} />
            Citation Vectors
        </div>
        <div className="flex flex-wrap gap-2">
            {sources.map((s, idx) => (
                <a
                    key={idx}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all border border-white/5 group"
                >
                    <Search size={10} className="text-primary" />
                    <span className="max-w-[100px] truncate">{s.title || s.source}</span>
                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
            ))}
        </div>
    </div>
);

const LoadingIndicator = () => (
    <div className="flex justify-start">
        <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-tl-none flex flex-col gap-3 w-3/4">
            <div className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-[10px] font-bold text-slate-400 uppercase animate-pulse">Scanning Vector Space...</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
            </div>
        </div>
    </div>
);

// ── Main ChatPanel ───────────────────────────────────────────

export default function ChatPanel() {
    const { stealthMode } = useSubscription();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const [showTrace, setShowTrace] = useState<string | null>(null);
    const [copyIdx, setCopyIdx] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let sid = localStorage.getItem("ts_session_id");
        if (!sid) {
            sid = crypto.randomUUID();
            localStorage.setItem("ts_session_id", sid);
        }
        setSessionId(sid);
        fetchHistory(sid);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const fetchHistory = async (sid: string) => {
        if (!sid) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3001";
            const res = await fetch(`${apiUrl}/api/v1/chat/history/${sid}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3001";
            const res = await fetch(`${apiUrl}/api/v1/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionId,
                    query: input,
                    history: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const aiMessage: Message = {
                    role: "model",
                    content: data.answer,
                    sources: data.sources,
                    thought_trace: data.thought_trace || ["Context Matched", "Gemini Logic Applied"]
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                throw new Error("API fail");
            }
        } catch (err) {
            setMessages((prev) => [...prev, { role: "model", content: `Sorry, I had trouble connecting to the ${stealthMode ? 'Analysis Core' : 'Vector Logic Engine'}.` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopyIdx(String(index));
        setTimeout(() => setCopyIdx(null), 2000);
    };

    const handleShare = (text: string, platform: 'whatsapp' | 'linkedin' | 'email') => {
        const encodedText = encodeURIComponent(text);
        let url = '';
        if (platform === 'whatsapp') url = `https://wa.me/?text=${encodedText}`;
        if (platform === 'linkedin') url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`;
        if (platform === 'email') url = `mailto:?subject=Grantify AI Advice&body=${encodedText}`;
        window.open(url, '_blank');
    };

    const clearHistory = async () => {
        if (!confirm("Clear this conversation?")) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3001";
            await fetch(`${apiUrl}/api/v1/chat/history/${sessionId}`, { method: "DELETE" });
            setMessages([]);
        } catch (err) {
            console.error("Clear failed:", err);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-primary text-background rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                        <MessageCircle size={30} />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        className="w-[95vw] md:w-[450px] h-[650px] max-h-[85vh] bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href="/" className="w-11 h-11 bg-primary/20 rounded-2xl flex items-center justify-center p-2 border border-primary/20 hover:scale-105 transition-transform">
                                    <Logo />
                                </Link>
                                <div className="leading-tight">
                                    <h3 className="font-bold text-base tracking-tight text-white">Grantify AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Grant Writing Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={clearHistory} className="p-2.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5" title="Reset Conversation">
                                    <ListRestart size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2.5 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.length === 0 && !loading && (
                                <div className="text-center py-20 px-10">
                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <BrainCircuit size={32} className="text-primary/50" />
                                    </div>
                                    <h4 className="text-white font-medium mb-1">Empowering Your Growth</h4>
                                    <p className="text-xs text-slate-400">Ask about Nigerian grants, scholarships, or get help with your application writing.</p>
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`max-w-[88%] p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                        ? "bg-primary text-background font-semibold rounded-tr-none shadow-xl shadow-primary/20"
                                        : "bg-white/5 border border-white/10 rounded-tl-none text-slate-100"
                                        }`}>
                                        {m.content}

                                        {m.role === "model" && <MessageActions content={m.content} idx={i} copyIdx={copyIdx} onCopy={handleCopy} onShare={handleShare} />}
                                        {m.role === "model" && m.thought_trace && <ThoughtTraceViewer trace={m.thought_trace} showTrace={showTrace} onToggle={setShowTrace} idx={i} />}
                                        {m.role === "model" && m.sources && m.sources.length > 0 && <CitationVectors sources={m.sources} />}
                                    </div>
                                    <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter px-2">
                                        {m.role === "user" ? "Applicant" : "Grantify AI"}
                                    </span>
                                </div>
                            ))}

                            {loading && <LoadingIndicator />}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white/5 border-t border-white/5">
                            <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask Grantify anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 ring-primary/50 transition-all pr-14 shadow-inner"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-primary disabled:opacity-30 hover:bg-primary/10 rounded-xl transition-all"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <p className="text-[9px] text-center text-slate-500 mt-3 font-medium uppercase tracking-[0.2em]">Verified Gemini Grounding Protocol Active</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
