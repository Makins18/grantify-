"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
}

export default function FeatureCard({ icon: Icon, title, desc }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-white/5 hover:border-primary/30 transition-all group shadow-xl hover:shadow-primary/5"
        >
            <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                <Icon className="text-zinc-600 dark:text-zinc-400 group-hover:text-primary transition-colors" size={28} />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                {desc}
            </p>
        </motion.div>
    );
}
