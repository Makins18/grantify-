import { Zap } from "lucide-react";

interface Props {
    label: string;
    value: string;
    trend: string;
}

export default function StatCard({ label, value, trend }: Props) {
    return (
        <div className="p-6 glass-card rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-12 h-12" />
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">{label}</p>
            <h4 className="text-3xl font-heading font-bold mb-1">{value}</h4>
            <p className={`text-xs font-bold ${trend.startsWith("+") ? "text-green-500" : "text-primary"}`}>
                {trend}
            </p>
        </div>
    );
}
