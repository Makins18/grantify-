"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Logo className="w-6 h-6 grayscale opacity-80" />
                            <span className="font-black text-lg tracking-tighter text-zinc-800 dark:text-zinc-200">Grantify</span>
                        </Link>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                            The intelligent, scam-free funding engine strictly dedicated to empowering Nigerian students through strategic opportunity discovery.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-widest text-xs">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link href="/dashboard" className="text-sm text-zinc-500 hover:text-primary transition-colors">Explore Grants</Link></li>
                            <li><Link href="/b2b" className="text-sm text-zinc-500 hover:text-primary transition-colors">B2B Portal</Link></li>
                            <li><Link href="/b2b-sponsors" className="text-sm text-zinc-500 hover:text-primary transition-colors">B2B Sponsors</Link></li>
                            <li><Link href="/about" className="text-sm text-zinc-500 hover:text-primary transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-widest text-xs">Support & Contact</h3>
                        <ul className="space-y-3">
                            <li><a href="tel:09121569058" className="text-sm text-zinc-500 hover:text-primary transition-colors">Contact: 09121569058</a></li>
                            <li><Link href="/privacy" className="text-sm text-zinc-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm text-zinc-500 hover:text-primary transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-400 font-medium">© {new Date().getFullYear()} Grantify Intelligence. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
