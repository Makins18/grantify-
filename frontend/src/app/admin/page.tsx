"use client";

import { useState, useEffect } from "react";
import { Activity, Database, RefreshCw, Trash2, Search, ChevronDown, ChevronUp, Server, Zap } from "lucide-react";
import Link from "next/link";

type Job = { id: string; name: string; next_run: string | null };
type VectorStats = { total_documents: number; vector_dim: number; index_file?: string };
type LogEntry = { ts: string; event: string; added?: number; skipped?: number; total?: number; source?: string; key?: string; error?: string };

export default function AdminPage() {
    const [stats, setStats] = useState<{ vector_store: VectorStats; scheduler: { running: boolean; jobs: Job[] }; redis_available: boolean; timestamp: string } | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [logType, setLogType] = useState("scrape");
    const [refreshing, setRefreshing] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [authKey, setAuthKey] = useState("");

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API}/admin/stats`);
            if (res.ok) setStats(await res.json());
        } catch { }
    };

    const fetchLogs = async (type: string) => {
        try {
            const res = await fetch(`${API}/admin/logs?log_type=${type}&limit=25`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.entries || []);
            }
        } catch { }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetch(`${API}/admin/refresh`, { method: "POST" });
            await fetchStats();
            await fetchLogs(logType);
        } catch { }
        setRefreshing(false);
    };

    const handleClearCache = async () => {
        setClearing(true);
        try {
            await fetch(`${API}/admin/cache`, { method: "DELETE" });
        } catch { }
        setClearing(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(`${API}/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery, top_k: 5 }),
            });
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.results || []);
            }
        } catch { }
        setSearching(false);
    };

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = sessionStorage.getItem("ts_admin_auth") === "true";
            setAuthorized(isAuth);
            setLoading(false);
        };

        const init = async () => {
            if (sessionStorage.getItem("ts_admin_auth") === "true") {
                await fetchStats();
                await fetchLogs(logType);
            }
        };

        checkAuth();
        init();
        const interval = setInterval(() => {
            if (sessionStorage.getItem("ts_admin_auth") === "true") fetchStats();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (authKey === "TS-2026-PREMIUM") {
            sessionStorage.setItem("ts_admin_auth", "true");
            setAuthorized(true);
            fetchStats();
            fetchLogs(logType);
        } else {
            alert("Invalid Intelligence Access Key");
        }
    };

    useEffect(() => {
        fetchLogs(logType);
    }, [logType]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary animate-pulse text-xl font-bold uppercase tracking-widest">Initialising Core...</div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="w-full max-w-md glass-card p-10 rounded-3xl text-center border-white/5">
                    <Zap className="w-12 h-12 text-secondary mx-auto mb-6" />
                    <h1 className="text-2xl font-bold mb-2">Restricted Intelligence Core</h1>
                    <p className="text-slate-500 text-sm mb-8">Access is restricted to authorized administrative personnel.</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Engineering Access Key"
                            value={authKey}
                            onChange={(e) => setAuthKey(e.target.value)}
                            className="w-full px-4 py-3 glass-card rounded-xl border border-white/10 outline-none focus:ring-1 ring-primary/50 text-sm text-center"
                        />
                        <button className="w-full py-3 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-all text-sm uppercase tracking-widest">
                            Authorize Access
                        </button>
                    </form>
                    <Link href="/dashboard" className="inline-block mt-8 text-xs text-slate-500 hover:text-white transition-colors">← Return to Public Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <header className="flex items-center justify-between mb-10">
                <div>
                    <Link href="/dashboard" className="text-slate-500 text-sm hover:text-white transition-colors mb-2 inline-block">← Dashboard</Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Server className="text-primary" /> System Admin
                    </h1>
                    <p className="text-slate-500 mt-1">Real-time intelligence pipeline monitoring & control.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                        {refreshing ? "Refreshing..." : "Refresh Index"}
                    </button>
                    <button
                        onClick={handleClearCache}
                        disabled={clearing}
                        className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        <Trash2 size={16} />
                        {clearing ? "Clearing..." : "Clear Cache"}
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
                <StatBlock label="Indexed Documents" value={stats?.vector_store?.total_documents ?? "—"} icon={<Database size={20} className="text-primary" />} />
                <StatBlock label="Scheduler" value={stats?.scheduler?.running ? "Running" : "Stopped"} icon={<Activity size={20} className={stats?.scheduler?.running ? "text-green-400" : "text-red-400"} />} accent={stats?.scheduler?.running ? "green" : "red"} />
                <StatBlock label="Redis Cache" value={stats?.redis_available ? "Connected" : "Offline"} icon={<Zap size={20} className={stats?.redis_available ? "text-yellow-400" : "text-red-400"} />} accent={stats?.redis_available ? "yellow" : "red"} />
                <StatBlock label="Vector Dim" value={stats?.vector_store?.vector_dim ?? "—"} icon={<Activity size={20} className="text-blue-400" />} />
            </section>

            {/* Scheduled Jobs */}
            {stats?.scheduler?.jobs && stats.scheduler.jobs.length > 0 && (
                <section className="glass-card rounded-2xl p-6 mb-8">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-primary" /> Scheduled Jobs</h2>
                    <div className="space-y-3">
                        {stats.scheduler.jobs.map(job => (
                            <div key={job.id} className="flex items-center justify-between bg-white/[0.03] rounded-xl p-4 border border-white/5">
                                <div>
                                    <p className="font-bold text-sm">{job.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{job.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Next run</p>
                                    <p className="text-sm font-mono text-primary">{job.next_run ? new Date(job.next_run).toLocaleTimeString() : "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Semantic Search Test */}
            <section className="glass-card rounded-2xl p-6 mb-8">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Search size={18} className="text-primary" /> Test Cognitive Search</h2>
                <form onSubmit={handleSearch} className="flex gap-3 mb-5">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="e.g. fully funded PhD scholarship Nigeria..."
                        className="flex-1 px-4 py-3 glass-card rounded-xl border border-white/10 outline-none focus:ring-1 ring-primary/50 text-sm"
                    />
                    <button type="submit" disabled={searching} className="px-6 py-3 bg-primary text-background rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                        {searching ? "Searching..." : "Search"}
                    </button>
                </form>
                {searchResults.length > 0 && (
                    <div className="space-y-3">
                        {searchResults.map((r, i) => (
                            <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                                <p className="font-bold text-sm mb-1">{r.title}</p>
                                <p className="text-xs text-slate-400">{r.source} · {r.type} · {r.country || r.location}</p>
                                {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">View opportunity →</a>}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Logs */}
            <section className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-lg flex items-center gap-2"><Activity size={18} className="text-primary" /> Event Logs</h2>
                    <div className="flex gap-2">
                        {["scrape", "vector", "cache", "error"].map(t => (
                            <button key={t} onClick={() => setLogType(t)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${logType === t ? "bg-primary text-background" : "glass-card text-slate-400 hover:text-white"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No log entries yet. Trigger a refresh to populate logs.</p>
                    ) : logs.map((entry, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${entry.error ? "border-red-500/20 bg-red-500/5" : "border-white/5 bg-white/[0.02]"}`}>
                            <span className="text-slate-500">{entry.ts?.split("T")[1]?.split(".")[0] ?? "—"}</span>
                            <span className={`ml-3 font-bold ${entry.error ? "text-red-400" : "text-primary"}`}>{entry.event}</span>
                            {entry.source && <span className="ml-3 text-slate-400">{entry.source}</span>}
                            {entry.added !== undefined && <span className="ml-3 text-green-400">+{entry.added} added</span>}
                            {entry.skipped !== undefined && <span className="ml-2 text-slate-500">{entry.skipped} skipped</span>}
                            {entry.total !== undefined && <span className="ml-2 text-blue-400">total: {entry.total}</span>}
                            {entry.error && <span className="ml-3 text-red-400">{entry.error}</span>}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function StatBlock({ label, value, icon, accent = "primary" }: { label: string; value: string | number; icon: React.ReactNode; accent?: string }) {
    const accentMap: Record<string, string> = {
        primary: "text-primary",
        green: "text-green-400",
        red: "text-red-400",
        yellow: "text-yellow-400",
        blue: "text-blue-400",
    };
    return (
        <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">{icon}<span className="text-sm text-slate-400">{label}</span></div>
            <p className={`text-2xl font-bold ${accentMap[accent] || "text-white"}`}>{value}</p>
        </div>
    );
}
