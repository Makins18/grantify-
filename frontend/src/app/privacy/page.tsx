"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none" />
      
      <nav className="absolute top-0 w-full p-6 z-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">
            Privacy & Transparency
          </h1>
          <p className="text-slate-400">Last updated: May 2026</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-xl prose prose-invert max-w-none text-slate-300"
        >
          <p className="mb-6">At Grantify, we treat your personal and academic data with the highest security standards. As an intelligence platform connecting Nigerian students to grants, we require specific data points to verify identity and match you accurately.</p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-white">1. Data Collection</h3>
          <p className="mb-6">We collect your Name, Email, Educational Institution details, and optionally NIN/BVN (strictly for sponsor verification). This data is encrypted at rest using enterprise-grade algorithms.</p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-white">2. Data Usage</h3>
          <p className="mb-2">Your data is exclusively used to:</p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Verify your eligibility for specific regional or institutional grants.</li>
            <li>Train our personalized AI Assistant (in an anonymized format) to help you write better statements of purpose.</li>
            <li>Prevent duplicate applications and fraud on behalf of our B2B sponsors.</li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4 text-white">3. Third-Party Sharing</h3>
          <p className="mb-6">We never sell your data. We only share verified profile hashes with sponsors when you explicitly apply for their specific grant.</p>
        </motion.div>
      </main>
    </div>
  );
}
