"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Building2, TrendingUp, Handshake } from "lucide-react";
import Logo from "@/components/Logo";

export default function B2BPortal() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none" />
      
      <nav className="absolute top-0 w-full p-6 z-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <Link href="/b2b-sponsors" className="px-5 py-2.5 bg-primary text-background rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
          Sponsor a Grant
        </Link>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
            <Building2 className="w-4 h-4" /> B2B Partner Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
            Empower the Next Generation
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Partner with Grantify to distribute scholarships, vet candidates automatically, and amplify your organization's CSR impact in Nigeria.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="glass-card p-10 rounded-[2.5rem] border border-blue-500/10 hover:border-blue-500/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-32 h-32 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Streamlined Distribution</h3>
            <p className="text-slate-400 leading-relaxed relative z-10">
              Skip the manual spreadsheet sorting. Our AI pre-vets candidates based on your strict criteria, ensuring funds reach the most deserving students instantly.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card p-10 rounded-[2.5rem] border border-emerald-500/10 hover:border-emerald-500/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Handshake className="w-32 h-32 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10 text-white">Maximum CSR Visibility</h3>
            <p className="text-slate-400 leading-relaxed relative z-10">
              Gain transparent reporting on impact metrics, beneficiary success stories, and brand exposure to millions of Nigerian students.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
