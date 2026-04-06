import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import EvidenceLogDropdown, { EvidenceLog, VerificationStatus } from "./EvidenceLogDropdown";
import VoiceNotePlayer from "./VoiceNotePlayer";
import Link from "next/link";

type Grant = {
  id: string;
  title: string;
  type: string;
  value: string;
  deadline: string;
  matchScore: number;
  effortLevel: "Low" | "Medium" | "High";
  verificationStatus: VerificationStatus;
  trustScore: number;
  evidence: EvidenceLog;
  description: string;
  audioUrl?: string;
};

export default function GrantCard({ grant }: { grant: Grant }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-primary/30 transition-all group shadow-xl">
      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full">
              {grant.type}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Sparkles className="w-3 h-3 text-secondary" />
              {grant.matchScore}% Match
            </span>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
              Effort: {grant.effortLevel}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors cursor-pointer">{grant.title}</h3>
          
          <div className="mt-3">
            <VoiceNotePlayer summaryText={grant.description} audioUrl={grant.audioUrl} />
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Grant Value</p>
          <div className="text-2xl font-black text-white">{grant.value}</div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Deadline: <span className="text-slate-300">{grant.deadline}</span></p>
        </div>
      </div>

      {/* Trust & Transparency Layer */}
      <div className="mt-4 pt-4 border-t border-slate-800/50">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Pre-Screening Security Audit</p>
        <EvidenceLogDropdown 
          status={grant.verificationStatus} 
          trustScore={grant.trustScore} 
          evidence={grant.evidence} 
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
          Read Original Doc <ExternalLink className="w-4 h-4" />
        </button>
        <Link href={`/dashboard/applications/new?id=${grant.id}`} className="px-6 py-2.5 bg-primary text-background font-bold text-sm rounded-xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/10">
          1-Click Apply <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
