import { ButtonHTMLAttributes, ReactNode } from "react";

interface OAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    label: string;
    isFullWidth?: boolean;
}

export default function OAuthButton({ icon, label, isFullWidth, ...props }: OAuthButtonProps) {
    return (
        <button
            type="button"
            className={`py-4 glass-card rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50 ${isFullWidth ? 'w-full' : 'flex-1'}`}
            {...props}
        >
            {icon}
            {label}
        </button>
    );
}
