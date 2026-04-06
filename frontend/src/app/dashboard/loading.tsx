import { BrainCircuit } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div
        className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative animate-spin duration-3000"
      >
        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl animate-pulse" />
        <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
      </div>
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse tracking-tighter">
        Querying Reasoning Engine...
      </h2>
      <p className="text-sm text-slate-500 font-medium mt-2">Pulling intelligence from Redis Cache</p>
    </div>
  );
}
