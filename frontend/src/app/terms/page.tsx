"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
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
            Terms of Use
          </h1>
          <p className="text-slate-400">Last updated: May 2026</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-8 md:p-12 border border-white/5 shadow-xl prose prose-invert max-w-none text-slate-300"
        >
          <p className="mb-6">Welcome to Grantify. By accessing or using our platform, you agree to be bound by these Terms of Use.</p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-white">1. Eligibility</h3>
          <p className="mb-6">Grantify is designed exclusively for Nigerian citizens, residents, and organizations. Falsifying your identity, location, or academic status to secure grants is a violation of these terms and may result in a permanent ban and reporting to relevant authorities.</p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-white">2. AI Assistance Disclaimer</h3>
          <p className="mb-6">Our AI Assistant is a tool to help you draft and refine your applications. You are solely responsible for the final submission. Grantify does not guarantee that using the AI will result in a successful grant application.</p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-white">3. Sponsor Grants</h3>
          <p className="mb-6">Grantify acts as a facilitator between students and B2B sponsors. The final decision on fund disbursement rests entirely with the sponsor. We are not liable for delayed or cancelled grant programs initiated by third-party sponsors.</p>
        </motion.div>
      </main>
    </div>
  );
}
