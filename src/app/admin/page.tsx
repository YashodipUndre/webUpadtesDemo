"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, updateRequestStatus, Request, getReviewers, assignRequest, bulkAssignRequests, sendMessage } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    );
}

function AdminDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [reviewers, setReviewers] = useState<{ id: string, email: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState(new Set<string>());
    const [massReviewerId, setMassReviewerId] = useState("");
    const [filters, setFilters] = useState({
        status: "All",
        client: "All",
        urgency: "All",
        reviewer: "All",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [reqData, revData] = await Promise.all([
                    getRequests(user?.id, 'admin'),
                    getReviewers()
                ]);
                setRequests(reqData);
                setReviewers(revData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (user?.id) fetchData();
    }, [user?.id]);

    async function refreshData() {
        setIsLoading(true);
        try {
            const data = await getRequests(user?.id, 'admin');
            setRequests(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function toggle(id: string) {
        const s = new Set(selected);
        if (s.has(id)) s.delete(id);
        else s.add(id);
        setSelected(s);
    }

    async function handleBulkAction(action: 'In Progress' | 'Complete' | 'Peer Review') {
        const ids = Array.from(selected);
        if (ids.length === 0) return;

        setIsLoading(true);
        try {
            await Promise.all(ids.map(id => updateRequestStatus(id, action)));
            await refreshData();
            setSelected(new Set());
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleMassAssign() {
        if (!massReviewerId) return;
        const ids = Array.from(selected);
        if (ids.length === 0) return;

        setIsLoading(true);
        try {
            await bulkAssignRequests(ids, massReviewerId);
            // Move all to Peer Review status and notify
            await Promise.all(ids.map(async (id) => {
                await updateRequestStatus(id, 'Peer Review');
                await sendMessage(id, user!.id, `System: Request assigned to reviewer and moved to Peer Review.`);
            }));
            await refreshData();
            setSelected(new Set());
            setMassReviewerId("");
            alert(`Successfully assigned and moved ${ids.length} requests to Peer Review.`);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleIndividualAssign(requestId: string, reviewerId: string) {
        setIsLoading(true);
        try {
            await assignRequest(requestId, reviewerId || null);
            if (reviewerId) {
                await updateRequestStatus(requestId, 'Peer Review');
                await sendMessage(requestId, user!.id, `System: Request assigned to reviewer and moved to Peer Review.`);
            }
            await refreshData();
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const visible = requests.filter((r) => {
        if (filters.status !== "All" && r.status !== filters.status) return false;
        if (filters.client !== "All" && r.profiles?.email !== filters.client) return false;
        if (filters.urgency !== "All" && r.urgency !== filters.urgency) return false;
        if (filters.reviewer !== "All") {
            if (filters.reviewer === "Unassigned") return !r.reviewer_id;
            if (r.reviewer?.email !== filters.reviewer) return false;
        }
        return true;
    });

    const uniqueClients = Array.from(new Set(requests.map(r => r.profiles?.email).filter(Boolean)));

    if (isLoading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1 text-slate-800">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-600">Admin Console</h1>
                    <p className="text-slate-500 font-medium">Manage operational update requests and internal workflows</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => handleBulkAction('Peer Review')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-40 transition-all shadow-lg shadow-violet-100 font-bold text-sm active:scale-95"
                    >
                        Send to Review
                    </button>
                    <button
                        onClick={() => handleBulkAction('Complete')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-lg shadow-emerald-100 font-bold text-sm active:scale-95"
                    >
                        Bulk Close
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <section className="lg:col-span-3 bg-white/50 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/60 flex flex-wrap items-center gap-6">
                    <div className="flex-1 min-w-[180px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block ml-1 tracking-widest">Status</label>
                        <select
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-2xl text-sm font-bold px-4 py-3 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option>New</option>
                            <option>In Progress</option>
                            <option>Peer Review</option>
                            <option>Complete</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[180px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block ml-1 tracking-widest">Client</label>
                        <select
                            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-2xl text-sm font-bold px-4 py-3 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Clients</option>
                            {uniqueClients.map(email => (
                                <option key={email} value={email!}>{email}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[180px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block ml-1 tracking-widest">Reviewer</label>
                        <select
                            onChange={(e) => setFilters({ ...filters, reviewer: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-2xl text-sm font-bold px-4 py-3 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Reviewers</option>
                            <option value="Unassigned">Unassigned Only</option>
                            {reviewers.map(rev => (
                                <option key={rev.id} value={rev.email}>{rev.email}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100 flex flex-col justify-center">
                    <label className="text-[10px] font-black uppercase text-indigo-400 mb-2 ml-1 tracking-widest">Mass Assign Reviewer</label>
                    <div className="flex gap-2">
                        <select
                            value={massReviewerId}
                            onChange={(e) => setMassReviewerId(e.target.value)}
                            disabled={selected.size === 0}
                            className="flex-1 bg-white border border-indigo-200 rounded-2xl text-xs font-bold px-3 py-2.5 text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none disabled:opacity-50"
                        >
                            <option value="">Select Reviewer...</option>
                            {reviewers.map(rev => (
                                <option key={rev.id} value={rev.id}>{rev.email}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleMassAssign}
                            disabled={selected.size === 0 || !massReviewerId}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                        >
                            Apply
                        </button>
                    </div>
                </section>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                    Error: {error}
                </div>
            )}

            <div className="card-premium overflow-hidden bg-white rounded-[2rem] border-slate-200 shadow-2xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto min-w-[1000px]">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-8 py-6">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        onChange={(e) => {
                                            if (e.target.checked) setSelected(new Set(visible.map(v => v.id)));
                                            else setSelected(new Set());
                                        }}
                                        checked={selected.size > 0 && selected.size === visible.length}
                                    />
                                </th>
                                <th className="px-8 py-6">Request</th>
                                <th className="px-8 py-6">Client</th>
                                <th className="px-8 py-6">Assigned Reviewer</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Priority</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-24 text-center text-slate-400 font-bold italic">
                                        No matching operational requests identified.
                                    </td>
                                </tr>
                            ) : (
                                visible.map((r) => (
                                    <tr
                                        key={r.id}
                                        className={`hover:bg-slate-50/80 transition-all group ${r.urgency === "Urgent" ? "bg-red-50/30" : ""}`}
                                    >
                                        <td className="px-8 py-6">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={selected.has(r.id)}
                                                onChange={() => toggle(r.id)}
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors">{r.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {r.id.slice(0, 8)}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 ml-auto">
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                        {r.total_messages || 0}
                                                    </div>
                                                    {r.unseen_count! > 0 && (
                                                        <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                                                            {r.unseen_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-500">{r.profiles?.email.split('@')[0]}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{r.profiles?.email}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative inline-block w-48">
                                                <select
                                                    value={r.reviewer_id || ""}
                                                    onChange={(e) => handleIndividualAssign(r.id, e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black px-3 py-2 text-slate-600 hover:bg-white hover:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none uppercase tracking-tight"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {reviewers.map(rev => (
                                                        <option key={rev.id} value={rev.id}>{rev.email.split('@')[0]}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={r.status} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${r.urgency === "Urgent"
                                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                                : "bg-slate-50 text-slate-400 border-slate-100"
                                                }`}>
                                                {r.urgency}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link
                                                href={`/admin/requests/${r.id}`}
                                                className="w-10 h-10 inline-flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
