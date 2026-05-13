"use client";

import React from "react";
import AudioReader from "@/components/AudioReader";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

const PRIVACY_TEXT = `Welcome to Grantify's Privacy Policy. We take the protection of your data with the utmost seriousness. This document outlines our rigid standards for handling the information of both Nigerian students and our B2B business partners. 
First, data collection. We collect only what is strictly necessary to match you with valid, scam-free grants and scholarships. For students, this includes your academic profile, location, and field of study. For grantors, this includes business registration details to verify legitimacy. 
Second, data security. Your information is encrypted at rest and in transit. We utilize military-grade standards to ensure that no third party, unauthorized agent, or malicious entity can access your profile. We do not sell your data. We do not lease your data. Your data belongs to you. 
Third, automated decision making. Our AI engine, the Grantify Success Predictor, analyzes your profile to provide strategic advice. It does not make final decisions on grant awards, but rather serves as a navigational tool. 
Finally, your rights. You retain the absolute right to delete your account, request a data export, or opt-out of AI analysis at any time. By continuing to use Grantify, you acknowledge and consent to these rigid, non-negotiable data protection protocols.`;

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0A0A0B] text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Rigid, Transparent, and Secure.</p>
                    </div>
                </div>

                <div className="mb-12">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Listen & Read Along</h2>
                    <AudioReader text={PRIVACY_TEXT} title="Grantify Privacy Protocol (Audio Version)" />
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <h3>1. Absolute Data Sovereignty</h3>
                    <p>
                        At Grantify, we enforce a strict policy of data sovereignty. Information provided by Nigerian grant seekers and our B2B partners is siloed, encrypted, and protected. We guarantee that no unauthorized data brokering occurs on this platform.
                    </p>
                    <h3>2. Business Partner Verification</h3>
                    <p>
                        Grantors and sponsors must undergo a rigorous KYC (Know Your Customer) process. This ensures that every opportunity listed on Grantify is 100% legitimate and scam-free.
                    </p>
                </div>
            </div>
        </main>
    );
}
