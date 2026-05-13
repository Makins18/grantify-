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

export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-[2rem] flex flex-col gap-6 animate-pulse border border-white/5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-2xl shrink-0" />
                        <div className="flex-1 space-y-3 pt-1">
                            <div className="h-5 bg-zinc-100 dark:bg-white/5 rounded-lg w-3/4" />
                            <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded w-1/2" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded w-full" />
                        <div className="h-3 bg-zinc-100 dark:bg-white/5 rounded w-2/3" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between">
                        <div className="h-4 bg-zinc-100 dark:bg-white/5 rounded w-20" />
                        <div className="h-9 bg-zinc-100 dark:bg-white/5 rounded-xl w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}
