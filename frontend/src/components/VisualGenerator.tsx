"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Download, Image as ImageIcon, Loader2, ArrowRight, Lock, Crown } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";

export default function VisualGenerator() {
    const [description, setDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { isPremium, stealthMode } = useSubscription();
    const [generationsLeft, setGenerationsLeft] = useState(3);

    const handleGenerate = async () => {
        if (!description.trim()) return;
        if (!isPremium && generationsLeft <= 0) {
            setError("Standard Generation limit reached. Upgrade to Premium for unhindered visual storytelling.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setResultImage(null);

        try {
            const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${API}/generate-visual`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) throw new Error("Failed to generate");

            const data = await response.json();
            setResultImage(data.image_url);
            if (!isPremium) setGenerationsLeft(prev => prev - 1);
        } catch (err) {
            setError("We couldn't create your visual at this moment. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-white">{stealthMode ? 'Visual Storytelling' : 'Diffuser Core'}</h2>
                        <p className="text-zinc-400 text-sm">{stealthMode ? 'Create high-impact visual assets for your proposals.' : 'Imagen-3.0 strategic image generation pipeline.'}</p>
                    </div>
                </div>
                {!isPremium && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <Crown size={14} className="text-secondary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{generationsLeft} Standard Slots Remaining</span>
                    </div>
                )}
            </div>

            <div className="relative group">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the visual intent (e.g., 'Modern architecture project in Lagos', 'Clean energy solar farm at sunset')..."
                    className="w-full h-32 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none mb-4"
                />

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !description.trim()}
                    className="absolute bottom-6 right-2 flex items-center gap-2 px-8 py-3 bg-primary text-background hover:bg-white hover:text-primary disabled:bg-zinc-700 disabled:text-zinc-500 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 uppercase text-xs tracking-widest"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {stealthMode ? 'Synthesizing...' : 'Diffusing Latents...'}
                        </>
                    ) : (
                        <>
                            {stealthMode ? 'Generate Visual' : 'Trigger Inference'}
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                    <span className="text-red-400 text-sm">{error}</span>
                    {!isPremium && <a href="/dashboard/settings" className="text-xs font-bold text-white underline">Upgrade Now</a>}
                </div>
            )}

            <AnimatePresence>
                {resultImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 relative group rounded-2xl overflow-hidden border border-white/10"
                    >
                        <img
                            src={resultImage}
                            alt="Generated Intelligence Visual"
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors">
                                <Download className="w-5 h-5" />
                                Export Asset
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors">
                                <ImageIcon className="w-5 h-5" />
                                Embed in Draft
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/5 pt-6 uppercase tracking-[0.2em] font-bold">
                <span className="flex items-center gap-2"><Lock size={12} /> Encrypted Infrastructure</span>
                <span>Tier: {isPremium ? "Premium Intelligence" : "Standard"}</span>
            </div>
        </div>
    );
}
