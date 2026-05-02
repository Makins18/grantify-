interface PasswordStrengthProps {
    strength: number;
    show: boolean;
}

export default function PasswordStrength({ strength, show }: PasswordStrengthProps) {
    if (!show) return null;

    const getStrengthLabel = () => {
        if (strength <= 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    return (
        <div className="mt-2 flex items-center justify-between gap-1 px-1">
            {[1, 2, 3, 4].map((level) => (
                <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                        strength >= level
                            ? level <= 2 ? "bg-amber-500" : "bg-emerald-500"
                            : "bg-white/10"
                    }`}
                />
            ))}
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight ml-2">
                {getStrengthLabel()}
            </span>
        </div>
    );
}
