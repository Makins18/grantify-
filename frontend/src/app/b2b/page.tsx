"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Building2, TrendingUp, Handshake } from "lucide-react";
import AudioReader from "@/components/AudioReader";

const B2B_TEXT = `The Grantify B2B Partner Portal is designed for organizations looking to scale their social impact in Nigeria. By partnering with us, your organization can distribute scholarships and grants with absolute transparency and efficiency. Our AI-driven vetting process ensures that your funds reach the most qualified candidates, reducing administrative overhead and maximizing CSR visibility. Join our network of verified sponsors and help empower the next generation of Nigerian leaders.`;

export default function B2BPortal() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none" />

      <nav className="sticky top-0 w-full px-4 sm:px-6 py-4 z-20 flex justify-between items-center bg-background/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        <Link href="/b2b-sponsors" className="px-4 py-2 bg-primary text-background rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          Sponsor a Grant
        </Link>
      </nav>

      <main className="relative z-10 pt-10 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 sm:mb-8">
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4" /> B2B Partner Portal
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
            Empower the Next Generation
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            Partner with Grantify to distribute scholarships, vet candidates automatically, and amplify your organization&apos;s CSR impact in Nigeria.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500/60 mb-4 px-2">B2B Strategy Synthesis</h2>
          <AudioReader text={B2B_TEXT} title="B2B Partnership Overview" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card p-7 sm:p-10 rounded-[1.75rem] sm:rounded-[2.5rem] border border-blue-500/10 hover:border-blue-500/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-20 h-20 sm:w-32 sm:h-32 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10 text-white">Streamlined Distribution</h3>
            <p className="text-slate-400 leading-relaxed relative z-10 text-sm sm:text-base">
              Skip the manual spreadsheet sorting. Our AI pre-vets candidates based on your strict criteria, ensuring funds reach the most deserving students instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card p-7 sm:p-10 rounded-[1.75rem] sm:rounded-[2.5rem] border border-emerald-500/10 hover:border-emerald-500/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Handshake className="w-20 h-20 sm:w-32 sm:h-32 text-emerald-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10 text-white">Maximum CSR Visibility</h3>
            <p className="text-slate-400 leading-relaxed relative z-10 text-sm sm:text-base">
              Gain transparent reporting on impact metrics, beneficiary success stories, and brand exposure to millions of Nigerian students.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
