"use client";

export function SkeletonCard() {
    return (
        <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
            <div className="flex items-start gap-5">
                {/* Icon placeholder */}
                <div className="w-12 h-12 bg-white/10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-white/10 rounded-lg w-3/4" />
                    <div className="flex gap-4">
                        <div className="h-3 bg-white/5 rounded w-24" />
                        <div className="h-3 bg-white/5 rounded w-28" />
                        <div className="h-3 bg-white/5 rounded w-16" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="hidden md:block text-right space-y-2">
                    <div className="h-4 bg-white/10 rounded w-24 ml-auto" />
                    <div className="h-3 bg-white/5 rounded w-20 ml-auto" />
                </div>
                <div className="h-9 w-24 bg-white/10 rounded-xl" />
                <div className="h-8 w-8 bg-white/5 rounded-lg" />
            </div>
        </div>
    );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
