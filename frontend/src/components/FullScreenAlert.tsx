"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FullScreenAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate an aggressive, high-priority push notification arriving after 8 seconds
    // This mimics the "WeMuslim" prayer time stand-up-to-actions overlay.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleApply = () => {
    setIsVisible(false);
    router.push("/dashboard");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[99999] bg-primary flex flex-col items-center justify-center p-6 text-white overflow-hidden"
        >
          {/* Pulsing Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-[120vw] h-[120vw] bg-white opacity-5 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
          </div>

          <div className="absolute top-8 right-8 z-10">
            <button 
              onClick={() => setIsVisible(false)} 
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, type: "spring" }}
            className="relative z-10 w-28 h-28 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
          >
            <AlertCircle className="w-16 h-16 text-primary" />
          </motion.div>

          <h1 className="relative z-10 text-4xl md:text-5xl font-black text-center mb-4 leading-tight tracking-tighter">
            URGENT: 98% Match Scholarship Closing
          </h1>
          
          <p className="relative z-10 text-lg md:text-xl text-center text-white/90 max-w-lg mb-12 font-medium leading-relaxed">
            The Lagos Tech Innovation Grant deadline is in <span className="font-black bg-white/20 px-2 py-1 rounded">12 Hours</span>. You have an optimal AI Match Score. Do not miss this opportunity.
          </p>

          <div className="relative z-10 flex flex-col w-full max-w-sm gap-4">
            <button 
              onClick={handleApply}
              className="w-full py-5 bg-white text-primary text-lg font-black uppercase tracking-widest rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-transform"
            >
              Open Application <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-full py-4 text-white hover:bg-white/10 text-sm font-bold uppercase tracking-widest rounded-2xl transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              <Clock className="w-4 h-4" /> Remind Me in 1 Hour
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
