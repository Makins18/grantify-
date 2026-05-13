import { Opportunity } from "./types";

export const ALL_OPPORTUNITIES: Opportunity[] = [
    {
        id: "G-2026-001",
        title: "Federal Government MSME Scholarship",
        type: "Scholarship",
        country: "Nigeria",
        value: "Full Tuition",
        deadline: "June 12, 2026",
        matchScore: 96,
        effortLevel: "Medium",
        verificationStatus: "Verified",
        trustScore: 0.99,
        description: "Full tuition coverage for Nigerian entrepreneurs in STEM and business. Targeted at under-represented regions. Requires NIN verification and university transcript.",
        audioUrl: "/mock_voice_note_1.mp3",
        evidence: {
            domain_verified: true,
            ssl_status: "Active",
            red_flags: [],
            ai_reasoning: "Domain cross-referenced with federal database. Institutional sponsor verified."
        }
    },
    {
        id: "G-2026-002",
        title: "NNPC/Chevron Joint Venture Scholarship",
        type: "Scholarship",
        country: "Nigeria",
        value: "₦1.5M/Year",
        deadline: "July 01, 2026",
        matchScore: 92,
        effortLevel: "High",
        verificationStatus: "Verified",
        trustScore: 0.95,
        description: "Funding for Nigerian undergraduates in Engineering and Geosciences. Strict CGPA cutoffs apply.",
        audioUrl: "/mock_voice_note_2.mp3",
        evidence: {
            domain_verified: true,
            ssl_status: "Active",
            red_flags: [],
            ai_reasoning: "Sponsor is a vetted Tier-1 corporation. Historical data confirms yearly disbursements."
        }
    },
    {
        id: "G-2026-003",
        title: "Lagos Tech Innovation Grant 2026",
        type: "Grant",
        country: "Nigeria",
        value: "₦5.0M",
        deadline: "Aug 15, 2026",
        matchScore: 84,
        effortLevel: "Low",
        verificationStatus: "Uncertain",
        trustScore: 0.65,
        description: "Seed capital for promising Nigerian tech startups resolving local traffic and mobility issues.",
        audioUrl: "/mock_voice_note_3.mp3",
        evidence: {
            domain_verified: false,
            ssl_status: "Active",
            red_flags: ["New domain registered 30 days ago", "Uses standard Gmail contact"],
            ai_reasoning: "The grant appears legitimate but lacks an official government domain. Under manual review."
        }
    },
    {
        id: "G-2026-004",
        title: "Fast-Track Visa Scholarship (UK)",
        type: "Scholarship",
        country: "United Kingdom",
        value: "£5,000",
        deadline: "Apply Now",
        matchScore: 12,
        effortLevel: "Low",
        verificationStatus: "Scam",
        trustScore: 0.12,
        description: "Guaranteed UK visa and scholarship for Nigerian students. Just pay a small application processing fee.",
        audioUrl: "/mock_voice_note_4.mp3",
        evidence: {
            domain_verified: false,
            ssl_status: "Expired",
            red_flags: ["Requires ₦15,000 processing fee", "False promises of guaranteed visa"],
            ai_reasoning: "Confirmed scam pattern. Real scholarships never require application processing fees."
        }
    },
    { id: 5, title: "Lagos Smart City Infrastructure", country: "Nigeria", type: "Tender", value: "₦5.8B", deadline: "Mar 12, 2026", matchScore: 98 },
    { id: 6, title: "Sustainable Agriculture Tech Grant", country: "Kenya", type: "Grant", value: "$250K", deadline: "Apr 05, 2026", matchScore: 94 },
    { id: 7, title: "African Youth Leadership Scholarship", country: "Pan-Africa", type: "Scholarship", value: "Full", deadline: "May 20, 2026", matchScore: 91 },
];
