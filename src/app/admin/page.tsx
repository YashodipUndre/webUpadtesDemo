"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, updateRequestStatus, Request, getReviewers, assignRequest, bulkAssignRequests, sendMessage } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth-context";
import { BarChart3, Activity, AlertCircle, Clock, CheckCircle2, Eye } from "lucide-react";



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
        school: "All",
        category: "All",
        active: "All",
    });


    useEffect(() => {
        const timer = setTimeout(() => {
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
        }, 2000);
        return () => clearTimeout(timer);
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
            await Promise.all(ids.map(id => updateRequestStatus(id, action, user?.email || 'Admin')));
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
            await bulkAssignRequests(ids, massReviewerId, user?.email || 'Admin');
            // Move all to Peer Review status and notify
            await Promise.all(ids.map(async (id) => {
                await updateRequestStatus(id, 'Peer Review', user?.email || 'Admin');
                await sendMessage(id, user!.id, `System: Request assigned to reviewer and moved to Peer Review.`, true, undefined, 'admin', user?.email || 'Admin');
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
            await assignRequest(requestId, reviewerId || null, user?.email || 'Admin');
            if (reviewerId) {
                await updateRequestStatus(requestId, 'Peer Review', user?.email || 'Admin');
                await sendMessage(requestId, user!.id, `System: Request assigned to reviewer and moved to Peer Review.`, true, undefined, 'admin', user?.email || 'Admin');
            }
            await refreshData();
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const visible = requests.filter((r) => {
        // Dynamic filters
        if (filters.school !== "All" && r.profiles?.school !== filters.school) return false;
        if (filters.client !== "All" && r.profiles?.email !== filters.client) return false;
        if (filters.status !== "All" && r.status !== filters.status) return false;
        if (filters.urgency !== "All" && r.urgency !== filters.urgency) return false;
        if (filters.category !== "All" && !r.items?.some(i => i.categories?.includes(filters.category as any))) return false;

        // State filter (Active vs Completed)
        if (filters.active === 'Active' && r.status === 'Complete') return false;
        if (filters.active === 'Completed' && r.status !== 'Complete') return false;

        if (filters.reviewer !== "All") {
            if (filters.reviewer === "Unassigned") return !r.reviewer_id;
            if (r.reviewer?.email !== filters.reviewer) return false;
        }
        return true;
    });

    const uniqueSchools = Array.from(new Set(requests.map(r => r.profiles?.school).filter(Boolean)));
    const uniqueClients = Array.from(new Set(requests.map(r => r.profiles?.email).filter(Boolean)));
    const categories = ["Image", "Video", "Audio", "Text", "Document", "Other"];

    if (isLoading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1.5 text-slate-800">
                    <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">Admin Console</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/admin/reports"
                        className="px-5 py-2 bg-white text-slate-800 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all font-bold text-xs shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4 text-yellow-500" />
                        View Analytics
                    </Link>
                    <button
                        onClick={() => handleBulkAction('Peer Review')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-5 py-2 bg-amber-500 text-stone-900 rounded-xl hover:bg-amber-600 disabled:opacity-40 transition-all shadow-md shadow-amber-100 font-bold text-xs active:scale-95"
                    >
                        Send to Review
                    </button>
                    <button
                        onClick={() => handleBulkAction('Complete')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-5 py-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-40 transition-all shadow-md shadow-stone-200 font-bold text-xs active:scale-95"
                    >
                        Bulk Complete
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <section className="col-span-1 lg:col-span-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-1">
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Total</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Active</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.filter(r => r.status !== 'Complete').length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Review</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.filter(r => r.status === 'Peer Review').length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Urgent</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.filter(r => r.urgency === 'Urgent' && r.status !== 'Complete').length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-4 bg-white/50 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/60 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">School</label>
                        <select
                            value={filters.school}
                            onChange={(e) => setFilters({ ...filters, school: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Schools</option>
                            {uniqueSchools.map(school => (
                                <option key={school} value={school!}>{school}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option>New</option>
                            <option>In Progress</option>
                            <option>Info Needed</option>
                            <option>Peer Review</option>
                            <option>Complete</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Urgency</label>
                        <select
                            value={filters.urgency}
                            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">Any Priority</option>
                            <option>Normal</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">State</label>
                        <select
                            value={filters.active}
                            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Items</option>
                            <option value="Active">Active Only</option>
                            <option value="Completed">Completed Only</option>
                        </select>
                    </div>
                </section>

                <section className="bg-yellow-50/50 p-5 rounded-3xl border border-yellow-100 flex flex-col justify-center">
                    <label className="text-[10px] font-black uppercase text-yellow-600 mb-2 ml-1 tracking-widest">Mass Action</label>
                    <div className="flex gap-2">
                        <select
                            value={massReviewerId}
                            onChange={(e) => setMassReviewerId(e.target.value)}
                            disabled={selected.size === 0}
                            className="flex-1 bg-white border border-yellow-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-400/10 outline-none disabled:opacity-50 appearance-none shadow-sm"
                        >
                            <option value="">Assign To...</option>
                            {reviewers.map(rev => (
                                <option key={rev.id} value={rev.id}>{rev.email.split('@')[0]}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleMassAssign}
                            disabled={selected.size === 0 || !massReviewerId}
                            className="bg-yellow-400 text-stone-900 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-yellow-500 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-yellow-100"
                        >
                            Go
                        </button>
                    </div>
                </section>
            </div>

            {
                error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                        Error: {error}
                    </div>
                )
            }

            <div className="card-premium overflow-hidden bg-white rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto h-[400px] overflow-y-auto scrollbar-hide">
                    <table className="w-full table-auto min-w-[900px]">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-6 py-5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-400"
                                        onChange={(e) => {
                                            if (e.target.checked) setSelected(new Set(visible.map(v => v.id)));
                                            else setSelected(new Set());
                                        }}
                                        checked={selected.size > 0 && selected.size === visible.length}
                                    />
                                </th>
                                <th className="px-6 py-5">Request</th>
                                <th className="px-6 py-5">Client</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Priority</th>
                                <th className="px-6 py-5">SLA Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400 font-bold italic text-sm">
                                        No matching operational requests identified.
                                    </td>
                                </tr>
                            ) : (
                                visible.map((r) => {
                                    const getSLAStatus = (slaDate: string | null, status: string) => {
                                        if (status === 'Complete') return { label: 'Met', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
                                        if (!slaDate) return { label: 'No SLA', color: 'bg-slate-50 text-slate-400 border-slate-100' };

                                        const now = new Date();
                                        const due = new Date(slaDate);
                                        const diff = due.getTime() - now.getTime();

                                        if (diff < 0) return { label: 'Breached', color: 'bg-rose-50 text-rose-600 border-rose-100' };
                                        if (diff < 3600000 * 24) return { label: 'Due Soon', color: 'bg-amber-50 text-amber-600 border-amber-100' };
                                        return { label: 'On Track', color: 'bg-blue-50 text-blue-600 border-blue-100' };
                                    };

                                    const sla = getSLAStatus(r.sla_due_date, r.status);

                                    return (
                                        <tr
                                            key={r.id}
                                            className={`hover:bg-slate-50/80 transition-all group ${r.urgency === "Urgent" ? "bg-red-50/30" : ""}`}
                                        >
                                            <td className="px-6 py-5">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-400"
                                                    checked={selected.has(r.id)}
                                                    onChange={() => toggle(r.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm group-hover:text-yellow-600 transition-colors">{r.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {r.id.slice(0, 8)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 ml-auto">
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-400">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                            </svg>
                                                            {r.total_messages || 0}
                                                        </div>
                                                        {r.unseen_count! > 0 && (
                                                            <span className="bg-yellow-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                                                {r.unseen_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-bold text-slate-500">{r.profiles?.email.split('@')[0]}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{r.profiles?.email}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${r.urgency === "Urgent"
                                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                                    : "bg-slate-50 text-slate-400 border-slate-100"
                                                    }`}>
                                                    {r.urgency}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border inline-block whitespace-nowrap ${sla.color}`}>
                                                    {sla.label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/admin/requests/${r.id}`}
                                                    className="inline-flex items-center justify-center text-slate-300 hover:text-yellow-600 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5 hover:scale-110 transition-transform" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination Controls */}

        </div>
    );
}
