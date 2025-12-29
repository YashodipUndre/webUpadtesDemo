import React from "react";

export function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        'New': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
        'Info Needed': 'bg-amber-50 text-amber-700 border-amber-100',
        'Peer Review': 'bg-violet-50 text-violet-700 border-violet-100',
        'Complete': 'bg-slate-100 text-slate-700 border-slate-200'
    };

    return (
        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${colors[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {status}
        </span>
    );
}
