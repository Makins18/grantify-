"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";

export default function SponsorsInfo() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="fixed inset-0 bg-mesh opacity-20 pointer-events-none" />
      
      <nav className="absolute top-0 w-full p-6 z-20 flex justify-between items-center">
        <Link href="/b2b" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to B2B
        </Link>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 text-white">
            For Sponsors
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ready to make an impact? Here is how Grantify ensures your funds are protected and effectively distributed.
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl"
        >
          <div className="space-y-8">
            <FeatureRow title="Identity Verification" desc="Every student applicant undergoes strict NIN/BVN verification to prevent identity fraud and duplicate applications." />
            <FeatureRow title="Direct Disbursement" desc="Funds are disbursed directly to institutional wallets (universities) or verified student accounts based on your preference." />
            <FeatureRow title="Milestone Tracking" desc="For large grants, we implement milestone tracking (e.g., GPA maintenance) before subsequent tranches are released." />
            <FeatureRow title="Real-time Analytics Dashboard" desc="Access a dedicated sponsor portal to view real-time statistics on application volume, demographics, and fund utilization." />
          </div>

          <div className="mt-12 pt-12 border-t border-white/10 text-center flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6">Launch Your Program Today</h3>
            <button className="px-8 py-4 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Contact Enterprise Team <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function FeatureRow({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 shrink-0">
        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
      </div>
      <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
