"use client";

import React from "react";
import { Request } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";

interface RequestCardProps {
    request: Request;
    onOpen: () => void;
}

export function RequestCard({ request, onOpen }: RequestCardProps) {
    const formattedDate = new Date(request.created_at).toLocaleDateString();

    return (
        <div
            onClick={onOpen}
            className={`cursor-pointer group p-6 card-premium relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] ${request.urgency === 'Urgent' ? 'border-l-4 border-l-rose-500 bg-rose-50/30' : 'border-l-4 border-l-blue-600'
                }`}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{request.title}</h3>
                        {request.urgency === 'Urgent' && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase rounded-md border border-rose-200">Urgent</span>
                        )}
                    </div>
                    <p className="text-xs font-bold text-slate-400 italic pt-1">
                        Submitted on {formattedDate}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                        {request.profiles?.email}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-3 text-right">
                    <StatusBadge status={request.status} />
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="text-xs font-black">{request.messages?.length || 0}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-[12px] font-black text-white shadow-lg shadow-blue-200">
                        <span className="leading-none">{request.profiles?.email?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Owner</span>
                </div>

                <span className="text-[11px] font-black text-blue-600 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all uppercase tracking-widest">
                    Open Request →
                </span>
            </div>

            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </div>
    );
}
