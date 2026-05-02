"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 glass-card p-12 rounded-[3rem] flex flex-col items-center border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-[3rem] blur-3xl animate-pulse" />
        
        <div className="w-28 h-28 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 relative border border-primary/20 shadow-inner">
          <div className="absolute inset-0 bg-secondary/20 rounded-3xl blur-xl animate-pulse" />
          <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tighter">
          Querying Intelligence...
        </h2>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-3 animate-pulse">
          Pulling from Grant Matrix
        </p>
      </motion.div>
    </div>
  );
}
