"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Tier = "Free" | "Premium";

interface SubscriptionContextType {
    tier: Tier;
    setTier: (tier: Tier) => void;
    isPremium: boolean;
    stealthMode: boolean;
    setStealthMode: (stealth: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const [tier, setTierState] = useState<Tier>("Free");
    const [stealthMode, setStealthModeState] = useState(true);

    useEffect(() => {
        const savedTier = localStorage.getItem("ts_tier") as Tier;
        if (savedTier) setTierState(savedTier);

        const savedStealth = localStorage.getItem("ts_stealth");
        if (savedStealth !== null) setStealthModeState(savedStealth === "true");
    }, []);

    const setTier = (newTier: Tier) => {
        setTierState(newTier);
        localStorage.setItem("ts_tier", newTier);
    };

    const setStealthMode = (stealth: boolean) => {
        setStealthModeState(stealth);
        localStorage.setItem("ts_stealth", String(stealth));
    };

    const isPremium = tier === "Premium";

    return (
        <SubscriptionContext.Provider value={{ tier, setTier, isPremium, stealthMode, setStealthMode }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error("useSubscription must be used within a SubscriptionProvider");
    }
    return context;
}
