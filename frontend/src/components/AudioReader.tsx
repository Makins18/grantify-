"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface Lyric {
    word: string;
    start: number;
    end: number;
}

interface AudioReaderProps {
    text: string;
    title?: string;
    audioUrl?: string;
    lyrics?: Lyric[];
}

export default function AudioReader({ text, title = "Audio Playback", audioUrl, lyrics }: AudioReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Memoize words to avoid re-splitting on every render
    const words = useMemo(() => 
        lyrics ? lyrics.map(l => l.word) : text.split(/\s+/).filter(Boolean),
    [text, lyrics]);

    // Effect for Audio Element (Backend Sync)
    useEffect(() => {
        if (audioUrl && audioRef.current) {
            const audio = audioRef.current;
            
            const handleTimeUpdate = () => {
                const time = audio.currentTime;
                setCurrentTime(time);
                
                if (lyrics) {
                    const index = lyrics.findIndex(l => time >= l.start && time <= l.end);
                    if (index !== -1 && index !== currentWordIndex) {
                        setCurrentWordIndex(index);
                        const wordEl = document.getElementById(`word-${index}`);
                        if (wordEl && containerRef.current) {
                            wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }
            };

            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentWordIndex(-1);
            });

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [audioUrl, lyrics, currentWordIndex]);

    // Effect for Web Speech API (Fallback)
    useEffect(() => {
        if (!audioUrl && "speechSynthesis" in window) {
            // Clean text for better synthesis (strip markdown)
            const cleanText = text
                .replace(/[#*_~`]/g, '') // Strip markdown symbols
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Strip links but keep text
                .replace(/<[^>]*>/g, ''); // Strip HTML tags

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    const charIndex = event.charIndex;
                    const preText = cleanText.substring(0, charIndex);
                    const wordIdx = preText.split(/\s+/).filter(Boolean).length;
                    setCurrentWordIndex(wordIdx);
                }
            };
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => {
                setIsPlaying(false);
                setCurrentWordIndex(-1);
            };
            utteranceRef.current = utterance;
        }

        return () => {
            if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        };
    }, [text, audioUrl]);

    const togglePlay = () => {
        if (audioUrl && audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
        } else if (utteranceRef.current) {
            if (isPlaying) window.speechSynthesis.pause();
            else {
                if (window.speechSynthesis.paused) window.speechSynthesis.resume();
                else window.speechSynthesis.speak(utteranceRef.current);
            }
        }
    };

    const resetPlayback = () => {
        if (audioUrl && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.pause();
        } else {
            window.speechSynthesis.cancel();
            setCurrentWordIndex(-1);
        }
        setIsPlaying(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl overflow-hidden mb-6 group"
        >
            {audioUrl && <audio ref={audioRef} src={audioUrl} muted={isMuted} />}

            {/* Header / Controls */}
            <div className="flex items-center justify-between p-6 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)]"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                                {audioUrl ? "Neural Sync Active" : "Local Synthesis"}
                            </span>
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="text-[10px] font-bold text-zinc-500">
                                {words.length} Words
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 text-zinc-500 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button onClick={resetPlayback} className="p-2.5 text-zinc-500 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Content / Lyrics */}
            <div 
                ref={containerRef}
                className="p-8 max-h-[450px] overflow-y-auto scrollbar-hide relative bg-gradient-to-b from-transparent to-primary/[0.02]"
            >
                <div className="flex flex-wrap gap-x-2 gap-y-3 text-xl md:text-2xl leading-relaxed font-semibold transition-all">
                    {words.map((word, index) => {
                        const isHighlighted = currentWordIndex === index;
                        const isPassed = currentWordIndex > index;
                        
                        return (
                            <motion.span 
                                key={index}
                                id={`word-${index}`}
                                animate={{ 
                                    color: isHighlighted ? "#00ff66" : isPassed ? "#ffffff" : "#3f3f46",
                                    scale: isHighlighted ? 1.1 : 1,
                                    opacity: isHighlighted ? 1 : isPassed ? 0.9 : 0.4
                                }}
                                className={`relative cursor-default transition-all duration-300 ${
                                    isHighlighted ? "text-primary z-10" : ""
                                }`}
                            >
                                {word}
                                {isHighlighted && (
                                    <motion.div 
                                        layoutId="highlight-pill"
                                        className="absolute -inset-x-2 -inset-y-1 bg-primary/10 rounded-lg -z-10 border border-primary/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.span>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Progress */}
            {audioUrl && audioRef.current && (
                <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center gap-4">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,102,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentTime / (audioRef.current.duration || 1)) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-zinc-500">
                        {Math.floor(currentTime)}s / {Math.floor(audioRef.current.duration || 0)}s
                    </span>
                </div>
            )}
        </motion.div>
    );
}

