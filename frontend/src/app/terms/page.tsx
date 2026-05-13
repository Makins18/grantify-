"use client";

import React from "react";
import AudioReader from "@/components/AudioReader";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

const TERMS_TEXT = `Welcome to the Grantify Terms and Conditions. By accessing this platform, you agree to a rigid, non-negotiable set of rules designed to protect the integrity of the grant discovery process. 
Rule one: Honesty. All profile information, essays, and documents submitted must be completely truthful. Fraudulent applications will result in immediate and permanent bans. 
Rule two: Platform usage. Grantify's AI tools are designed to assist, not to deceive. You may not use automated scripts to mass-apply or scrape data from our platform. Our infrastructure is heavily monitored for malicious activity. 
Rule three: Grantor obligations. B2B partners must fulfill all promised funding if a candidate successfully meets their criteria. Any attempt to bait-and-switch applicants will result in legal action and removal from the platform. 
Rule four: Service availability. While we strive for 24/7 uptime, Grantify reserves the right to suspend services for critical security updates or maintenance. 
These terms establish a foundation of trust. If you cannot abide by these rigid conditions, you must exit the platform immediately.`;

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0A0A0B] text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Scale size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Terms & Conditions</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Clear Rules for a Fair Ecosystem.</p>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Listen & Read Along</h2>
                    <AudioReader text={TERMS_TEXT} title="Grantify Terms of Service (Audio Version)" />
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <h3>1. User Responsibilities</h3>
                    <p>
                        Every user is solely responsible for the accuracy of their application materials. Grantify provides AI assistance but does not guarantee success. The liability for the content of applications rests entirely with the user.
                    </p>
                    <h3>2. Intellectual Property</h3>
                    <p>
                        The Grantify platform, including its AI architecture, algorithms, and unique UI features (such as the AudioReader and Success Predictor) are the exclusive intellectual property of Grantify Inc.
                    </p>
                </div>
            </div>
        </main>
    );
}
