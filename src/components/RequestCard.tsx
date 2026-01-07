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
            className={`cursor-pointer group relative p-5 rounded-3xl border transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl
                ${request.urgency === 'Urgent'
                    ? 'bg-gradient-to-r from-red-50/50 to-white border-red-100 shadow-lg shadow-red-100/10'
                    : 'bg-white border-slate-100 shadow-md shadow-slate-200/40 hover:shadow-yellow-100/20'
                } flex flex-col md:flex-row md:items-center gap-5`}
        >
            {/* Status Indicator Bar (Left Side for Row) */}
            <div className={`absolute left-0 top-5 bottom-5 w-1.5 rounded-r-full transition-all duration-500 ${request.status === 'Complete' ? 'bg-emerald-400' :
                request.status === 'In Progress' ? 'bg-blue-400' :
                    request.urgency === 'Urgent' ? 'bg-rose-400' : 'bg-yellow-400'
                } opacity-50 group-hover:opacity-100`} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 pl-3">

                {/* 1. ID, Title & Badges */}
                <div className="flex-1 space-y-1.5 min-w-[280px]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 flex items-center justify-center text-stone-600 font-bold text-[10px] border border-slate-100 group-hover:bg-yellow-400 group-hover:text-stone-900 group-hover:border-yellow-400 transition-colors">
                            #{request.id.slice(0, 4)}
                        </span>
                        {request.urgency === 'Urgent' && (
                            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black uppercase rounded-md border border-rose-100 tracking-wider">
                                🔥 Critical
                            </span>
                        )}
                        <StatusBadge status={request.status} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-1">
                        {request.title}
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {request.profiles?.school || 'General'}
                    </span>
                </div>

                {/* 2. Metadata (Date & Items) */}
                <div className="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-6 md:pr-4">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Created</label>
                        <p className="text-[10px] font-bold text-slate-700">{formattedDate}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Items</label>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                            <span className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{request.items?.length || 0}</span> Tasks
                        </div>
                    </div>
                </div>

                {/* 3. User Info */}
                <div className="flex items-center gap-2.5 md:border-l md:border-slate-100 md:pl-6 min-w-[140px]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-[2px] shadow-inner shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[9px] font-black text-slate-500">
                            {request.profiles?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reported By</span>
                        <span className="text-[10px] font-bold text-slate-600 truncate w-full">{request.profiles?.email}</span>
                    </div>
                </div>
            </div>

            {/* 4. Action / Notification */}
            <div className="flex flex-col items-end justify-center pl-1 gap-1.5">
                {request.unseen_count! > 0 && (
                    <span className="bg-yellow-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        +{request.unseen_count} NEW
                    </span>
                )}
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-yellow-400 group-hover:text-stone-900 group-hover:border-yellow-400 transition-all">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>

            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
        </div>
    );
}
