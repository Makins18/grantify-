import { InputHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: LucideIcon;
}

export default function AuthInput({ label, icon: Icon, ...props }: AuthInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                    {...props}
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 ring-primary/50 transition-all placeholder:text-slate-600 ${props.className || ''}`}
                />
            </div>
        </div>
    );
}
