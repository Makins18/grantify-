"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <motion.svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                initial="hidden"
                animate="visible"
            >
                {/* Engineered Background Hexagon - Subtle & Technical */}
                <motion.path
                    d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 L50 5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeOpacity="0.1"
                    variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
                    }}
                />

                {/* The "G" Monogram - Minimalist & Geometric */}
                <motion.path
                    d="M70 35 C70 25 60 20 50 20 C35 20 25 32 25 50 C25 68 35 80 50 80 C62 80 70 72 70 60 H50 V65"
                    stroke="url(#logo-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                        hidden: { pathLength: 0 },
                        visible: { pathLength: 1, transition: { duration: 1.2, delay: 0.5, ease: "easeInOut" } }
                    }}
                />

                {/* Intelligence Pulse dots */}
                <motion.circle
                    cx="50"
                    cy="40"
                    r="3"
                    fill="var(--primary)"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />

                <defs>
                    <linearGradient id="logo-gradient" x1="30" y1="40" x2="80" y2="85" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" />
                        <stop offset="1" stopColor="var(--primary)" />
                    </linearGradient>
                </defs>
            </motion.svg>
        </div>
    );
}
