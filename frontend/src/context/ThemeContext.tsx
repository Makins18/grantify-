"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return <div className="invisible">{children}</div>;
    }

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </NextThemesProvider>
    );
}

// Re-export hook with helper functions
export function useTheme() {
    const { theme, setTheme, resolvedTheme } = useNextTheme();
    const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");
    return { theme, setTheme, toggleTheme, resolvedTheme };
}
