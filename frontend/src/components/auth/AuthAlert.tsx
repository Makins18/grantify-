import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

interface AuthAlertProps {
    type: "success" | "error" | null;
    message: string | null;
    onClose: () => void;
}

export default function AuthAlert({ type, message, onClose }: AuthAlertProps) {
    useEffect(() => {
        if (message && type === "success") {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, type, onClose]);

    return (
        <AnimatePresence>
            {type && message && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[320px] max-w-md w-full ${
                        type === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}
                >
                    {type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-xs font-bold leading-relaxed flex-1">
                        {message}
                    </span>
                    <button 
                        onClick={onClose}
                        className="opacity-60 hover:opacity-100 transition-opacity p-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
