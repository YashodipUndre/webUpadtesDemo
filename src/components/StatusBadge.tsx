import React from "react";
import { Badge } from "@/components/ui/badge";


export function StatusBadge({ status, size = "md" }: { status: string, size?: "sm" | "md" }) {
    const colors: Record<string, string> = {
        'New': 'bg-slate-100 text-slate-600 border-slate-200',
        'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Info Needed': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'Peer Review': 'bg-slate-100 text-slate-600 border-slate-200',
        'Complete': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Reopened': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const sizeClasses = {
        sm: "px-1.5 py-0 text-[9px]",
        md: "px-2.5 py-0.5 text-[10px]"
    };

    return (
        <Badge
            variant="outline"
            className={`rounded-lg font-black uppercase tracking-widest transition-all ${sizeClasses[size]} ${colors[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}
        >
            {status}
        </Badge>
    );
}
