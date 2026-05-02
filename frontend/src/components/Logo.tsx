"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <motion.div 
            className={`relative flex items-center justify-center ${className} overflow-hidden`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05 }}
        >
            <img 
                src="/logo.png" 
                alt="Grantify Minimalist Logo" 
                className="w-full h-full object-contain drop-shadow-md" 
            />
        </motion.div>
    );
}
