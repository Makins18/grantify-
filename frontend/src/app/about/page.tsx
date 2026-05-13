"use client";

import { motion } from "framer-motion";
import { Target, Shield, Zap } from "lucide-react";
import Logo from "@/components/Logo";
import FeatureCard from "@/components/FeatureCard";
import BackgroundGlow from "@/components/BackgroundGlow";
import AudioReader from "@/components/AudioReader";

const ABOUT_TEXT = `Grantify is Nigeria's definitive intelligence engine for grant discovery and academic funding. Our mission is to bridge the gap between ambitious students and the resources they need to thrive. We leverage state-of-the-art vector search and retrieval-augmented generation to match your unique profile with vetted, scam-free opportunities. Whether you are looking for local scholarships or international research grants, Grantify provides the tools to draft, track, and secure your future.`;

export default function AboutPage() {
  return (
    <div className="flex-1 bg-background relative overflow-hidden text-foreground">
      <BackgroundGlow />

      <main className="relative z-10 pt-10 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12 sm:mb-20">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary/20 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-primary/20 shadow-2xl shadow-primary/20">
            <Logo className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            About Grantify
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
            We are building the definitive engine for Nigerian students and innovators to discover, verify, and secure life-changing grants without the noise or the scams.
          </p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4 px-2">Voice Synthesis Protocol</h2>
          <AudioReader text={ABOUT_TEXT} title="Grantify Intelligence Overview" />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <FeatureCard
            icon={Target}
            title="Laser Focused"
            desc="We curate grants specifically viable for Nigerian residents, eliminating the frustration of applying for unavailable global funds."
          />
          <FeatureCard
            icon={Shield}
            title="Scam-Free Guaranteed"
            desc="Every opportunity is strictly vetted by our AI and human intelligence team to ensure absolute legitimacy."
          />
          <FeatureCard
            icon={Zap}
            title="AI Application Engine"
            desc="Our integrated workspace helps you draft compelling essays and statements of purpose trained on successful applications."
          />
        </div>
      </main>
    </div>
  );
}

