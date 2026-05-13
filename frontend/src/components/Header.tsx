"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Menu } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0A0A0B]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo className="w-8 h-8" />
                        <span className="font-black text-xl tracking-tighter text-zinc-900 dark:text-white group-hover:text-primary transition-colors">Grantify</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/about" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">About</Link>
                    <Link href="/b2b-sponsors" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">Sponsors</Link>
                    <Link href="/dashboard" className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors">Explore Grants</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    
                    <Link href="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
                        Sign In
                    </Link>

                    <button className="md:hidden p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
