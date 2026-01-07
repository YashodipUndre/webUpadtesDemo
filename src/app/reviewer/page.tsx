"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { RequestCard } from "@/components/RequestCard";
import { Search, Filter, X } from "lucide-react";

export default function ReviewerDashboardPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerDashboard />
        </ProtectedRoute>
    );
}

function ReviewerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
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
        }, 2000);
        return () => clearTimeout(timer);
    }, [user?.id]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Filter by whether any item has this user as a peer reviewer OR Peer Review status
    const filtered = requests.filter((r) => {
        const isPeerReviewer = r.items?.some(item => item.peer_reviewers?.some(pr => pr.user_id === user?.id));
        const isEligible = isPeerReviewer || r.status === 'Peer Review';

        if (!isEligible) return false;

        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || r.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Reset page when filtering
    useEffect(() => {
        setPage(1);
    }, [searchQuery, filterStatus]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-4">
            <header className="space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-100 italic">
                        Secured Review Board
                    </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Personal Review Queue</h1>
                <p className="text-slate-500 font-medium max-w-2xl text-sm">
                    Evaluation board for requests exclusively assigned to your profile for technical validation and quality assurance.
                </p>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold animate-in fade-in">
                    System Error: {error}
                </div>
            )}

            <div className="card-premium p-6 bg-white rounded-[2.5rem] border-slate-200 shadow-xl shadow-yellow-100/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full" />
                        Review Queue
                        <span className="ml-1 px-2.5 py-1 bg-yellow-400 text-stone-900 rounded-full text-[11px] font-black">
                            {filtered.length}
                        </span>
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl justify-end">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by ID or Title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none group-hover:border-slate-300"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-3 h-3 text-slate-500" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            {['All', 'Peer Review', 'In Progress', 'Complete'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterStatus === status
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                        <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-5 transform -rotate-6">
                            <Search className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h4 className="text-slate-900 font-bold text-base mb-1">No Results Found</h4>
                        <p className="text-slate-400 font-medium text-sm">Try adjusting your filters or search query.</p>
                        {(searchQuery || filterStatus !== "All") && (
                            <button
                                onClick={() => { setSearchQuery(""); setFilterStatus("All"); }}
                                className="mt-4 px-6 py-2 bg-yellow-400 text-stone-900 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-200"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((r) => (
                            <RequestCard
                                key={r.id}
                                request={r}
                                onOpen={() => router.push(`/reviewer/requests/${r.id}`)}
                            />
                        ))}
                        {/* Pagination Controls */}
                        {filtered.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 mt-4 rounded-xl">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Previous
                                </button>
                                <span className="text-xs font-bold text-slate-400">
                                    Page {page} of {Math.ceil(filtered.length / ITEMS_PER_PAGE)}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / ITEMS_PER_PAGE), p + 1))}
                                    disabled={page >= Math.ceil(filtered.length / ITEMS_PER_PAGE)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
