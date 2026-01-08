import React from "react";

export function StatusBadge({ status, size = "md" }: { status: string, size?: "sm" | "md" }) {
    const colors: Record<string, string> = {
        'New': 'bg-yellow-400/10 text-yellow-600 border-yellow-200',
        'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
        'Info Needed': 'bg-rose-50 text-rose-600 border-rose-100',
        'Peer Review': 'bg-stone-100 text-stone-700 border-stone-200',
        'Complete': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Reopened': 'bg-purple-50 text-purple-700 border-purple-100'
    };

    const sizeClasses = {
        sm: "px-2 py-0.5 text-[9px]",
        md: "px-2.5 py-1 text-[11px]"
    };

    return (
        <span className={`inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-wider border transition-all ${sizeClasses[size]} ${colors[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {status}
        </span>
    );
}
