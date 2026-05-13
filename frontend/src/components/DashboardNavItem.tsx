"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
    href: string;
    label: string;
    icon: LucideIcon;
    active: boolean;
    variant: "rail" | "sidebar" | "mobile";
}

export default function DashboardNavItem({ href, label, icon: Icon, active, variant }: NavItemProps) {
    if (variant === "rail") {
        return (
            <Link
                href={href}
                title={label}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group ${
                    active ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-white/5 text-zinc-500 hover:text-white"
                }`}
            >
                <Icon size={20} />
                {active && (
                    <motion.div
                        layoutId="sidebar-active-glow"
                        className="absolute -right-[1px] w-[2px] h-6 bg-primary rounded-l-full shadow-[0_0_8px_rgba(0,255,102,0.5)]"
                    />
                )}
            </Link>
        );
    }

    if (variant === "sidebar") {
        return (
            <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active ? "text-white bg-white/5" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                }`}
            >
                <Icon size={18} className={active ? "text-primary" : "text-zinc-500"} />
                <span>{label}</span>
                {active && <div className="ml-auto w-1 h-1 bg-primary rounded-full" />}
            </Link>
        );
    }

    // Mobile variant
    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                active ? "text-primary" : "text-slate-500 hover:text-slate-300"
            }`}
        >
            <div className="relative">
                <Icon size={20} />
                {label === "Notifications" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-black" />
                )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">
                {label}
            </span>
        </Link>
    );
}
