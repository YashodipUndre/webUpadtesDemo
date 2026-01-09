"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, X, ChevronRight, Calendar, MessageSquare, Eye } from "lucide-react";

export default function ReviewerDashboardPage() {
    return (
        <ProtectedRoute allow={["reviewer", "developer"]}>
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

    // SHARED QUEUE: Show requests if ANY item has ANY peer reviewer assigned
    // All peer reviewers see the same list of requests that have review assignments
    const filtered = requests.filter((r) => {
        // Check if any item has a peer reviewer assigned (any reviewer, not just current user)
        const hasAnyPeerReviewer = r.items?.some(item =>
            item.peer_reviewers && item.peer_reviewers.length > 0
        );

        // Eligible if the request has any peer reviewer assignments
        if (!hasAnyPeerReviewer) return false;

        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || r.status === filterStatus;

        return matchesSearch && matchesStatus;
    });



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
                    <div className="overflow-x-auto h-[400px] overflow-y-auto scrollbar-hide">
                        <table className="w-full table-auto min-w-[900px]">
                            <thead>
                                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                    <th className="px-6 py-5">Ref</th>
                                    <th className="px-6 py-5">Request & Items</th>
                                    <th className="px-6 py-5">Client Profile</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Priority</th>
                                    <th className="px-6 py-5">Received</th>
                                    <th className="px-6 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((r) => {
                                    const createdDate = new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                                    return (
                                        <tr
                                            key={r.id}
                                            onClick={() => router.push(`/reviewer/requests/${r.id}`)}
                                            className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${r.urgency === 'Urgent' ? 'bg-red-50/20' : ''}`}
                                        >
                                            <td className="px-6 py-5">
                                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold text-[10px] border border-slate-200 group-hover:bg-yellow-400 group-hover:text-stone-900 group-hover:border-yellow-400 transition-colors">
                                                    #{r.id.slice(0, 4)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-800 text-sm group-hover:text-yellow-600 transition-colors leading-tight line-clamp-1">{r.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-tighter group-hover:bg-yellow-100 group-hover:text-yellow-700 transition-colors">
                                                            {r.items?.length || 0} ITEMS
                                                        </span>
                                                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                                                            <MessageSquare className="w-2.5 h-2.5" />
                                                            {r.total_messages || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-slate-700">{r.profiles?.school || 'Unknown School'}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{r.profiles?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${r.urgency === 'Urgent'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                                >
                                                    {r.urgency}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[11px] font-bold">{createdDate}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="inline-flex items-center justify-center text-slate-300 group-hover:text-yellow-600 transition-colors">
                                                    <Eye className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>


                    </div>
                )}
            </div>
        </div>
    );
}
