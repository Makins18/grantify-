"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Target, Shield, Zap } from "lucide-react";
import Logo from "@/components/Logo";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <div className="fixed inset-0 bg-mesh opacity-30 pointer-events-none" />
      
      <nav className="absolute top-0 w-full p-6 z-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        <Link href="/login" className="px-5 py-2.5 glass-card rounded-xl text-sm font-bold border border-white/10 hover:bg-white/5 transition-all">
          Sign In
        </Link>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-20">
          <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-2xl shadow-primary/20">
            <Logo className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            About Grantify
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are building the definitive engine for Nigerian students and innovators to discover, verify, and secure life-changing grants without the noise or the scams.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Target className="text-rose-400" />} 
            title="Laser Focused" 
            desc="We curate grants specifically viable for Nigerian residents, eliminating the frustration of applying for unavailable global funds." 
            delay={0.1}
          />
          <FeatureCard 
            icon={<Shield className="text-emerald-400" />} 
            title="Scam-Free Guaranteed" 
            desc="Every opportunity is strictly vetted by our AI and human intelligence team to ensure absolute legitimacy." 
            delay={0.2}
          />
          <FeatureCard 
            icon={<Zap className="text-amber-400" />} 
            title="AI Application Engine" 
            desc="Our integrated workspace helps you draft compelling essays and statements of purpose trained on successful applications." 
            delay={0.3}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ delay }}
      className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}
