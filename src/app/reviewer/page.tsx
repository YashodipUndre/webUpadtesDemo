"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/StatusBadge";

export default function ReviewerDashboardPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerDashboard />
        </ProtectedRoute>
    );
}

function ReviewerDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRequests() {
            try {
                const data = await getRequests(user?.id, 'reviewer');
                setRequests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (user?.id) fetchRequests();
    }, [user?.id]);

    // Filter by assigned reviewer
    const assigned = requests.filter((r) => r.reviewer_id === user?.id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-6xl mx-auto py-8 px-4">
            <header className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">
                        Secured Review Board
                    </span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Personal Review Queue</h1>
                <p className="text-slate-500 font-medium max-w-2xl">
                    Evaluation board for requests exclusively assigned to your profile for technical validation and quality assurance.
                </p>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl text-sm font-bold animate-in fade-in">
                    System Error: {error}
                </div>
            )}

            <div className="card-premium p-10 bg-white rounded-[2.5rem] border-slate-200 shadow-2xl shadow-indigo-100/20">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                        My Assignments
                        <span className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-black">
                            {assigned.length}
                        </span>
                    </h3>
                </div>

                {assigned.length === 0 ? (
                    <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                        <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-slate-900 font-bold text-lg mb-1">Board Clear</h4>
                        <p className="text-slate-400 font-medium">No pending validations assigned to your station.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {assigned.map((r) => (
                            <div
                                key={r.id}
                                className="group p-7 border border-slate-100 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center bg-white hover:bg-slate-50/50 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
                            >
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <p className="font-extrabold text-slate-900 text-xl group-hover:text-indigo-600 transition-colors tracking-tight">
                                            {r.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={r.status} />
                                            {r.urgency === 'Urgent' && (
                                                <span className="text-[10px] bg-rose-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-rose-200">
                                                    CRITICAL
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            {r.total_messages || 0} MSGS
                                        </div>
                                        <span className="text-slate-200">/</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-300">AUTHOR:</span>
                                            <span className="text-slate-600">{r.profiles?.email}</span>
                                        </div>
                                        <span className="text-slate-200">/</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-300">LOGGED:</span>
                                            <span className="text-slate-600 uppercase">
                                                {new Date(r.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        {r.unseen_count! > 0 && (
                                            <span className="text-indigo-600 font-black animate-bounce text-[10px] tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
                                                {r.unseen_count} NEW
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    href={`/reviewer/requests/${r.id}`}
                                    className="mt-6 md:mt-0 px-8 py-4 text-[11px] font-black text-white bg-indigo-600 rounded-2xl hover:bg-slate-900 hover:scale-105 transition-all shadow-xl shadow-indigo-100 active:scale-95 uppercase tracking-widest"
                                >
                                    Validate Request
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
