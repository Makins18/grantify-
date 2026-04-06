import { useState } from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

export type EvidenceLog = {
  domain_verified: boolean;
  ssl_status: string;
  red_flags: string[];
  ai_reasoning: string;
};

export type VerificationStatus = "Verified" | "Uncertain" | "Faulty" | "Scam";

export default function EvidenceLogDropdown({ 
  status, 
  trustScore, 
  evidence 
}: { 
  status: VerificationStatus; 
  trustScore: number; 
  evidence: EvidenceLog; 
}) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (s: string) => {
    switch(s) {
      case "Verified": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Uncertain": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Faulty": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "Scam": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getIcon = (s: string) => {
    switch(s) {
      case "Verified": return <ShieldCheck className="w-4 h-4" />;
      case "Uncertain": return <AlertTriangle className="w-4 h-4" />;
      case "Faulty": return <AlertTriangle className="w-4 h-4" />;
      case "Scam": return <ShieldAlert className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm font-bold transition-colors ${getStatusColor(status)} hover:opacity-80`}
      >
        <div className="flex items-center gap-2">
          {getIcon(status)}
          <span>{status} (Trust Score: {(trustScore * 100).toFixed(0)}%)</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="mt-2 p-4 border border-slate-800 bg-slate-900/50 rounded-lg text-sm text-slate-300">
          <h4 className="font-bold text-slate-100 mb-2 border-b border-slate-800 pb-2">AI Verification Evidence Log</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Domain Verification:</span>
              <span className={evidence.domain_verified ? "text-emerald-400" : "text-yellow-400"}>
                {evidence.domain_verified ? "Official Domain" : "Unverified Domain"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">SSL Status:</span>
              <span className={evidence.ssl_status === "Active" ? "text-emerald-400" : "text-red-400"}>
                {evidence.ssl_status}
              </span>
            </div>
            
            {evidence.red_flags && evidence.red_flags.length > 0 && (
              <div>
                <span className="text-slate-500 block mb-1">Detected Red Flags:</span>
                <ul className="list-disc list-inside text-red-500 pl-2">
                  {evidence.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-xs">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-2 border-t border-slate-800 mt-2">
              <span className="text-slate-500 text-xs block mb-1">AI Reasoning:</span>
              <p className="text-slate-400 text-xs leading-relaxed italic">"{evidence.ai_reasoning}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
