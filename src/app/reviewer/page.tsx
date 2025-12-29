"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";

export default function ReviewerDashboardPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerDashboard />
        </ProtectedRoute>
    );
}

function ReviewerDashboard() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRequests() {
            try {
                const data = await getRequests();
                setRequests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRequests();
    }, []);

    const assigned = requests.filter((r) => r.status === "Peer Review");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <header className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Review Board</h1>
                <p className="text-slate-500 font-medium">Evaluate and approve requests pending peer review</p>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                    Error: {error}
                </div>
            )}

            <div className="card-premium p-8 bg-white">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-violet-600 rounded-full" />
                    Assigned for Peer Review
                </h3>

                {assigned.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-slate-400 font-bold italic">Queue clear! No requests currently need review.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {assigned.map((r) => (
                            <div
                                key={r.id}
                                className="group p-5 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-blue-100 transition-all duration-300"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{r.title}</p>
                                        {r.urgency === 'Urgent' && (
                                            <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                        <span className="text-slate-400">Client:</span> {r.profiles?.email}
                                        <span className="text-slate-200">|</span>
                                        {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <Link
                                    href={`/reviewer/requests/${r.id}`}
                                    className="mt-4 sm:mt-0 px-6 py-2.5 text-xs font-black bg-white border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group-hover:shadow-blue-100 active:scale-95 uppercase tracking-widest"
                                >
                                    Open Review
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
