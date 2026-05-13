"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import {
    LayoutDashboard,
    Search,
    FileText,
    Bell,
    Settings,
    Sun,
    Moon,
    ChevronRight,
} from "lucide-react";

import Logo from "@/components/Logo";
import ChatPanel from "@/components/ChatPanel";
import DashboardNavItem from "@/components/DashboardNavItem";

import { useSubscription } from "@/context/SubscriptionContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Search, label: "Explore", href: "/dashboard/explore" },
    { icon: FileText, label: "Applications", href: "/dashboard/applications" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const { stealthMode, setStealthMode } = useSubscription();
    const { theme, toggleTheme } = useTheme();
    const { user, profile } = useAuth();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (href: string) =>
        href === "/dashboard"
            ? pathname === href
            : pathname.startsWith(href);

    const userInitial =
        profile?.full_name?.[0] ??
        user?.email?.[0]?.toUpperCase() ??
        "A";

    const renderNav = (variant: "rail" | "sidebar" | "mobile") =>
        NAV.map((item) => (
            <DashboardNavItem
                key={item.href}
                {...item}
                active={isActive(item.href)}
                variant={variant}
            />
        ));

    return (
        <div className="min-h-screen flex bg-[#050505] text-zinc-400 overflow-hidden relative">
            {/* Left Rail */}
            <aside className="hidden lg:flex w-16 shrink-0 flex-col items-center gap-8 border-r border-white/5 bg-black py-6 relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                <Link
                    href="/"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-all hover:bg-primary/20"
                >
                    <Logo className="h-6 w-6 text-primary" />
                </Link>

                <nav className="flex flex-1 flex-col gap-4">
                    {renderNav("rail")}
                </nav>

                <div className="mt-auto flex flex-col gap-4">
                    <button
                        onClick={() => setIsCollapsed((prev) => !prev)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 text-zinc-500 transition-all hover:bg-white/5"
                    >
                        <ChevronRight
                            size={18}
                            className={`transition-transform duration-300 ${
                                isCollapsed ? "" : "rotate-180"
                            }`}
                        />
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition-all hover:bg-white/5"
                    >
                        {theme === "dark" ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-gradient-to-br from-primary/20 to-secondary/20 text-xs font-bold text-primary">
                        {userInitial}
                    </div>
                </div>
            </aside>

            {/* Secondary Sidebar */}
            <motion.aside
                animate={{
                    width: isCollapsed ? 0 : 224,
                    opacity: isCollapsed ? 0 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
                className="relative z-20 hidden overflow-hidden whitespace-nowrap border-r border-white/5 bg-zinc-950 py-8 lg:flex shrink-0"
            >
                <div className="px-4 w-56">
                    <div className="mb-8">
                        <h2 className="mb-4 px-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
                            Dashboard
                        </h2>

                        <div className="space-y-1">
                            {renderNav("sidebar")}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-4">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                            Status
                        </p>

                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                            System Ready
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto bg-[var(--background)] pb-24 lg:pb-0">
                {children}
            </main>

            <ChatPanel />

            {/* Mobile Nav */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[var(--sidebar-bg)] backdrop-blur-xl lg:hidden">
                <nav className="flex items-center justify-around px-2 py-3">
                    {renderNav("mobile")}
                </nav>
            </div>
        </div>
    );
}