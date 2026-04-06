"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, FastForward, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceNotePlayerProps {
  audioUrl?: string;
  summaryText: string;
}

export default function VoiceNotePlayer({ audioUrl, summaryText }: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  
  // Simulated audio duration for the mock implementation (in seconds)
  const duration = 24; 
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    if (playbackRate === 1) setPlaybackRate(1.5);
    else if (playbackRate === 1.5) setPlaybackRate(2);
    else setPlaybackRate(1);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          // Increment speed visually matching the simulated duration & playback rate
          return prev + (100 / (duration * 10)) * playbackRate;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackRate]);

  return (
    <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 mt-4 relative overflow-hidden group">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Media Controls Row */}
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-primary text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" /> }
        </button>

        {/* Progress Bar (WhatsApp VN style) */}
        <div className="flex-1 h-12 flex items-center relative cursor-pointer" onClick={(e) => {
           // Click to seek logic (mocked)
           const bounds = e.currentTarget.getBoundingClientRect();
           const x = e.clientX - bounds.left;
           setProgress((x / bounds.width) * 100);
        }}>
           {/* Waveform Mock UI */}
           <div className="absolute inset-0 flex items-center gap-1 opacity-50">
             {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full transition-all duration-300 ${i < (progress / 100) * 30 ? "bg-primary" : "bg-slate-700"}`}
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
             ))}
           </div>
        </div>

        {/* Speed Control Button */}
        <button 
          onClick={cycleSpeed}
          className="px-2 py-1 rounded-md text-xs font-bold text-slate-400 bg-slate-800 border border-slate-700 hover:text-white hover:border-primary/50 transition-colors"
        >
          {playbackRate}x
        </button>
      </div>

      {/* "Karaoke / Lyrics" Text View underneath */}
      <div className="mt-4 pt-3 border-t border-slate-800/50 relative z-10">
        <p className="text-sm leading-relaxed font-medium transition-all">
          {/* Real-time word-by-word highlighting effect simulating lyrics read-along */}
          {summaryText.split(" ").map((word, index, arr) => {
             const wordProgressThreshold = (index / arr.length) * 100;
             const isHighlighted = isPlaying && progress >= wordProgressThreshold;
             const isPassed = progress > wordProgressThreshold;
             
             return (
               <span 
                 key={index} 
                 className={`transition-colors duration-300 ${
                   isHighlighted ? "text-primary font-black bg-primary/10 px-0.5 rounded" 
                   : isPassed ? "text-slate-300" 
                   : "text-slate-500"
                 } `}
               >
                 {word}{" "}
               </span>
             );
          })}
        </p>
      </div>
    </div>
  );
}
