import { LucideIcon } from "lucide-react";

export type VerificationStatus = "Verified" | "Uncertain" | "Scam";

export interface EvidenceLog {
    domain_verified: boolean;
    ssl_status: string;
    red_flags: string[];
    ai_reasoning: string;
}

export interface Opportunity {
    id: string | number;
    title: string;
    type: string;
    value: string;
    deadline: string;
    description?: string;
    country: string;
    matchScore: number;
    aiScore?: number; // Aliased to matchScore if missing
    effortLevel?: "Low" | "Medium" | "High";
    verificationStatus?: VerificationStatus;
    trustScore?: number;
    evidence?: EvidenceLog;
    audioUrl?: string;
    is_priority?: boolean;
}
