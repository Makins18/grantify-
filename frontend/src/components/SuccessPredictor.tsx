"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Award, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessPredictorProps {
    profileCompleteness: number; // 0 to 100
    gpa: number; // e.g. 4.5 out of 5.0
    hasRequiredDocs: boolean;
    grantDifficulty: "Low" | "Medium" | "High" | "Extreme";
}

export default function SuccessPredictor({ 
    profileCompleteness, 
    gpa, 
    hasRequiredDocs, 
    grantDifficulty 
}: SuccessPredictorProps) {
    const [score, setScore] = useState(0);

    useEffect(() => {
        let baseScore = profileCompleteness * 0.4;
        baseScore += (gpa / 5.0) * 30;
        if (hasRequiredDocs) baseScore += 20;

        switch (grantDifficulty) {
            case "Low": baseScore += 10; break;
            case "Medium": baseScore += 0; break;
            case "High": baseScore -= 15; break;
            case "Extreme": baseScore -= 30; break;
        }

        const finalScore = Math.max(5, Math.min(99, Math.round(baseScore)));
        setScore(finalScore);
    }, [profileCompleteness, gpa, hasRequiredDocs, grantDifficulty]);

    const getColor = (val: number) => {
        if (val >= 80) return "text-primary stroke-primary";
        if (val >= 50) return "text-amber-500 stroke-amber-500";
        return "text-red-500 stroke-red-500";
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group"
        >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Sparkles size={16} className="text-primary" />
                </div>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Success Prediction Core</h3>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Visual Gauge */}
                <div className="relative w-40 h-40 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                            transition={{ duration: 2, ease: "circOut" }}
                            style={{ strokeDasharray: circumference }}
                            className={`${getColor(score)}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`text-4xl font-black ${getColor(score).split(' ')[0]}`}
                        >
                            {score}%
                        </motion.span>
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Odds</span>
                    </div>
                </div>

                {/* Factors */}
                <div className="flex-1 space-y-5 w-full">
                    {[
                        { icon: Award, label: "Profile Match", val: `${profileCompleteness}%` },
                        { icon: TrendingUp, label: "Academic Weight", val: `${gpa}/5.0` },
                        { icon: AlertCircle, label: "Difficulty", val: grantDifficulty }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                                    <item.icon size={14} className="text-zinc-500" />
                                </div>
                                <span className="text-sm font-bold text-zinc-400">{item.label}</span>
                            </div>
                            <span className="text-sm font-black text-white tracking-tight">{item.val}</span>
                        </div>
                    ))}

                    <div className="pt-6 border-t border-white/5">
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium italic">
                            {score >= 80 ? "Vector match confirmed. High probability of selection." :
                             score >= 50 ? "Moderate alignment. Suggest adding certification context." :
                             "High competition variance. Focus on difficulty-adjusted targets."}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
