"use client";

import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuthForm } from "@/hooks/useAuthForm";
import AuthInput from "@/components/auth/AuthInput";
import OAuthButton from "@/components/auth/OAuthButton";
import PasswordStrength from "@/components/auth/PasswordStrength";
import AuthAlert from "@/components/auth/AuthAlert";

export default function LoginPage() {
    const {
        email, setEmail,
        password, setPassword,
        isSignUp, setIsSignUp,
        agreedToEligibility, setAgreedToEligibility,
        loading,
        alert, closeAlert,
        passwordStrength,
        handleSubmit,
        handleOAuth
    } = useAuthForm();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <div className="bg-mesh opacity-30" />
            
            <AuthAlert type={alert.type} message={alert.message} onClose={closeAlert} />

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
                        <AuthInput
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />

                        <div className="space-y-2">
                            <AuthInput
                                label="Password"
                                icon={Lock}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            
                            <PasswordStrength 
                                strength={passwordStrength} 
                                show={isSignUp && password.length > 0} 
                            />
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
                            
                            <OAuthButton
                                icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>}
                                label="Continue with Google"
                                isFullWidth
                                onClick={() => handleOAuth('google')}
                                disabled={loading}
                            />
                            
                            <div className="flex gap-3">
                                <OAuthButton
                                    icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.178 14.542h-1.637l-2.08-2.617-2.062 2.617H7.78l2.842-3.565-2.825-3.593h1.637l2.046 2.64 2.029-2.64h1.619l-2.81 3.578 2.86 3.58z"/></svg>}
                                    label="Apple"
                                    onClick={() => handleOAuth('apple')}
                                    disabled={loading}
                                />
                                <OAuthButton
                                    icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>}
                                    label="Microsoft"
                                    onClick={() => handleOAuth('azure')}
                                    disabled={loading}
                                />
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
