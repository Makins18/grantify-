"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-50" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 glass-card p-10 rounded-[3rem] flex flex-col items-center border-white/10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-[3rem] blur-2xl" />
        
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-14 h-14 text-primary animate-spin" />
          <div className="absolute inset-0 border-[3px] border-primary/20 border-t-primary rounded-full animate-[spin_1.5s_linear_infinite]" />
        </div>
        
        <h2 className="mt-8 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tighter">
          Grantify Engine
        </h2>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-2 animate-pulse">
          Authenticating Core...
        </p>
      </motion.div>
    </div>
  );
}
