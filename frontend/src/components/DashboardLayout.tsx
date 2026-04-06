"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Search, FileText, Award, Bell, Settings,
    Zap, Sun, Moon, User, LogOut, ChevronRight
} from "lucide-react";
import Logo from "@/components/Logo";
import ChatPanel from "@/components/ChatPanel";
import { useSubscription } from "@/context/SubscriptionContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Explore", href: "/dashboard/explore" },
    { icon: FileText, label: "My Applications", href: "/dashboard/applications" },
    { icon: Award, label: "Grants & Awards", href: "/dashboard/explore?filter=grants" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { stealthMode, setStealthMode } = useSubscription();
    const { theme, toggleTheme } = useTheme();
    const { user, profile, signOut } = useAuth();

    const isActive = (href: string) =>
        href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href.split("?")[0]);

    return (
        <div className="min-h-screen bg-background flex relative overflow-hidden">
            <div className="bg-mesh opacity-40" />

            {/* ── Desktop Sidebar ── */}
            <aside className="w-64 border-r border-white/5 bg-[var(--sidebar-bg)] hidden lg:flex flex-col relative z-20 shrink-0">

                {/* Brand block — part of the nav, not separate */}
                <div className="px-5 pt-6 pb-4">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                <Logo className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <span className="font-heading font-black text-xl tracking-tighter block leading-none text-primary">
                                Grantify
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-secondary/80">
                                Scholarship Intelligence
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Divider with label */}
                <div className="px-5 mb-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">
                        Navigation
                    </p>
                </div>

                {/* Nav Links */}
                <nav className="px-3 space-y-0.5 flex-1">
                    {NAV.map(({ icon: Icon, label, href }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${active
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                    />
                                )}
                                <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${active ? "bg-primary/20" : "bg-white/0 group-hover:bg-white/5"
                                    }`}>
                                    <Icon size={16} className={active ? "text-primary" : ""} />
                                </div>
                                <span className="relative text-sm font-semibold flex-1">{label}</span>
                                {label === "Notifications" && (
                                    <span className="relative w-2 h-2 bg-accent rounded-full animate-pulse" />
                                )}
                                {active && (
                                    <ChevronRight size={14} className="relative text-primary/50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom controls */}
                <div className="p-4 border-t border-white/5 space-y-3 mt-auto">
                    {/* Mode toggles */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStealthMode(!stealthMode)}
                            title={stealthMode ? "Stealth Mode ON" : "Engineering Mode"}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${stealthMode
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "glass-card border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <Zap size={13} />
                            <span>{stealthMode ? "Stealth" : "Technical"}</span>
                        </button>
                        <button
                            onClick={toggleTheme}
                            title="Toggle Theme"
                            className="p-2.5 glass-card rounded-xl cursor-pointer hover:bg-white/5 transition-all border border-white/5"
                        >
                            <AnimatePresence mode="wait">
                                {theme === "dark" ? (
                                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={16} className="text-amber-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={16} className="text-secondary" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    {/* User profile */}
                    <div className="flex items-center gap-3 glass-card p-3 rounded-xl group hover:bg-white/5 transition-colors cursor-default">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary/60 to-secondary/60 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {profile?.full_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? <User size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[var(--foreground)] truncate leading-tight">
                                {profile?.full_name ?? user?.email?.split("@")[0] ?? "Alpha Agent"}
                            </p>
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                                {profile?.premium_tier ? "Premium" : "Standard"}
                            </p>
                        </div>
                        <button
                            onClick={signOut}
                            title="Sign Out"
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-all rounded-lg hover:bg-rose-500/10"
                        >
                            <LogOut size={13} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 overflow-y-auto relative z-10 pb-20 lg:pb-0">
                {children}
            </main>

            <ChatPanel />

            {/* ── Mobile Bottom Nav ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--sidebar-bg)] border-t border-white/5 backdrop-blur-xl">
                <nav className="flex items-center justify-around px-2 py-3">
                    {NAV.slice(0, 5).map(({ icon: Icon, label, href }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${active ? "text-primary" : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                <div className={`relative ${label === "Notifications" ? "" : ""}`}>
                                    <Icon size={20} />
                                    {label === "Notifications" && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border border-background" />
                                    )}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider">
                                    {label === "My Applications" ? "Apps" : label === "Grants & Awards" ? "Grants" : label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
