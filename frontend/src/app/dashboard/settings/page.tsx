"use client";

import { useSubscription } from "@/context/SubscriptionContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Settings, User, CreditCard, Shield, LogOut, ChevronRight, Check, Zap, Sun, Moon } from "lucide-react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { tier, setTier, stealthMode, setStealthMode } = useSubscription();
    const { theme, toggleTheme } = useTheme();
    const { user, profile, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4 text-slate-500">
                    <a href="/dashboard" className="text-sm hover:text-white transition-colors">Dashboard</a>
                    <ChevronRight size={14} />
                    <span className="text-sm text-white">Settings</span>
                </div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Settings className="text-primary" /> Profile & Platform Settings
                </h1>
                <p className="text-slate-500 mt-2">Manage your account preferences and intelligence subscription.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card rounded-3xl p-8 border-white/5 bg-white/[0.01]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <User className="text-primary" size={20} />
                            Account Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest pl-1">Full Name</label>
                                <input type="text" defaultValue={profile?.full_name ?? "Alpha Agent"} className="w-full px-4 py-3 glass-card rounded-xl border border-white/10 outline-none focus:ring-1 ring-primary/50 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest pl-1">Email Address</label>
                                <input type="email" defaultValue={user?.email ?? "agent@tendersense.ai"} className="w-full px-4 py-3 glass-card rounded-xl border border-white/10 outline-none focus:ring-1 ring-primary/50 text-sm" />
                            </div>
                        </div>
                    </section>

                    <section className="glass-card rounded-3xl p-8 border-white/5 bg-white/[0.01]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Zap className="text-primary" size={20} />
                            Strategic View Mode & Appearance
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="font-bold text-sm">{stealthMode ? 'Stealth Mode' : 'Engineering Mode'}</p>
                                    <p className="text-xs text-slate-500">
                                        {stealthMode
                                            ? 'Professional terminology optimized for executive summaries.'
                                            : 'Technical metrics and direct model performance markers enabled.'}
                                    </p>
                                </div>
                                <div
                                    onClick={() => setStealthMode(!stealthMode)}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${stealthMode ? 'bg-primary' : 'bg-slate-700'}`}
                                >
                                    <motion.div
                                        animate={{ x: stealthMode ? 24 : 0 }}
                                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div>
                                    <p className="font-bold text-sm">Theme Appearance</p>
                                    <p className="text-xs text-slate-500">Switch between light and dark themes.</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className="p-3 glass-card rounded-xl hover:bg-white/10 transition-all border border-white/10"
                                >
                                    {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-secondary" />}
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card rounded-3xl p-8 border-white/5 bg-white/[0.01]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Shield className="text-primary" size={20} />
                            Platform Security
                        </h2>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <p className="font-bold text-sm">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-500">Secure your account with an extra layer of protection.</p>
                            </div>
                            <button className="px-4 py-2 glass-card rounded-xl text-xs font-bold hover:bg-white/10 transition-all border border-white/10">Configure</button>
                        </div>
                    </section>
                </div>

                {/* Subscription Tier Selection */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <CreditCard className="text-secondary" size={20} />
                        Intelligence Tier
                    </h2>

                    <div
                        onClick={() => setTier("Free")}
                        className={`p-6 rounded-3xl cursor-pointer transition-all border-2 ${tier === "Free" ? "bg-white/10 border-white/20 shadow-xl" : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold">Standard</h3>
                            {tier === "Free" && <Check className="text-primary" size={20} />}
                        </div>
                        <p className="text-xs text-slate-400 mb-6 font-medium">Basic opportunity matching & generic proposal drafting.</p>
                        <p className="text-2xl font-bold">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
                    </div>

                    <div
                        onClick={() => setTier("Premium")}
                        className={`p-6 rounded-3xl cursor-pointer transition-all border-2 relative overflow-hidden ${tier === "Premium" ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/10" : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"}`}
                    >
                        {tier === "Premium" && <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-background font-bold text-[10px] rounded-bl-xl uppercase tracking-widest">Active</div>}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-primary">Intelligence Core+</h3>
                            {tier === "Premium" && <Check className="text-primary" size={20} />}
                        </div>
                        <p className="text-xs text-slate-400 mb-6 font-medium">In-depth application help, unlimited visual storytelling, & priority cognitive insights.</p>
                        <p className="text-2xl font-bold">$49 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
                    </div>

                    <button onClick={signOut} className="w-full flex items-center justify-center gap-3 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all text-sm font-bold border border-red-500/20 active:scale-95">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
