"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Zap, GraduationCap, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [agreedToEligibility, setAgreedToEligibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp) {
            if (!agreedToEligibility) {
                setError("You must confirm Nigerian eligibility to proceed.");
                setLoading(false);
                return;
            }
            if (passwordStrength < 3) {
                setError("Please use a stronger password.");
                setLoading(false);
                return;
            }

            const { error } = await supabase.auth.signUp({ email, password });
            if (error) setError(error.message);
            else alert("Check your email for the confirmation link!");
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
            else router.push("/dashboard");
        }
        setLoading(false);
    };


    const handleOAuth = async (provider: 'google' | 'apple' | 'azure') => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="bg-mesh opacity-30" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                        <Logo className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Grantify Access</h1>
                    <p className="text-slate-500 text-sm">Empowering Nigerian Growth through Strategic Grants</p>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary/50" />

                    <div className="flex mb-8 bg-white/5 p-1 rounded-xl">
                        <button
                            onClick={() => setIsSignUp(false)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isSignUp ? "bg-primary text-background shadow-lg" : "text-slate-500 hover:text-white"}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsSignUp(true)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isSignUp ? "bg-primary text-background shadow-lg" : "text-slate-500 hover:text-white"}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 ring-primary/50 transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 ring-primary/50 transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            {/* Password Strength Indicator */}
                            {isSignUp && password.length > 0 && (
                                <div className="mt-2 flex items-center justify-between gap-1 px-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= level
                                                ? level <= 2 ? "bg-amber-500" : "bg-emerald-500"
                                                : "bg-white/10"
                                                }`}
                                        />
                                    ))}
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight ml-2">
                                        {passwordStrength <= 1 ? "Weak" : passwordStrength === 2 ? "Fair" : passwordStrength === 3 ? "Good" : "Strong"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Eligibility Checkbox */}
                        {isSignUp && (
                            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 group cursor-pointer" onClick={() => setAgreedToEligibility(!agreedToEligibility)}>
                                <div className={`mt-0.5 w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 ${agreedToEligibility ? "bg-primary border-primary" : "border-white/20 group-hover:border-primary/50"}`}>
                                    {agreedToEligibility && <CheckCircle2 size={12} className="text-background" />}
                                </div>
                                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed select-none">
                                    I confirm I am a <span className="text-primary">Nigerian citizen or resident</span> seeking grants specifically for the Nigerian ecosystem.
                                </p>
                            </div>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-400 font-bold text-center bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                                {error}
                            </motion.div>
                        )}

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {loading
                                    ? "Syncing Gateway..."
                                    : isSignUp ? "Create Grantify Account" : "Secure Login"}
                                <ArrowRight size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuth('google')}
                                disabled={loading}
                                className="w-full py-4 glass-card rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
                                Continue with Google
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleOAuth('apple')}
                                    disabled={loading}
                                    className="flex-1 py-4 glass-card rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.178 14.542h-1.637l-2.08-2.617-2.062 2.617H7.78l2.842-3.565-2.825-3.593h1.637l2.046 2.64 2.029-2.64h1.619l-2.81 3.578 2.86 3.58z"/></svg>
                                    Apple
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleOAuth('azure')}
                                    disabled={loading}
                                    className="flex-1 py-4 glass-card rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>
                                    Microsoft
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600">Secure Grant Cloud</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600">Exclusive Nigerian Access</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
