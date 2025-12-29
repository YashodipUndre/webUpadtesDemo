"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, updateRequestStatus, Request } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    );
}

function AdminDashboard() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState(new Set<string>());
    const [filters, setFilters] = useState({
        status: "All",
        client: "All",
        urgency: "All",
    });

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

    function toggle(id: string) {
        const s = new Set(selected);
        if (s.has(id)) s.delete(id);
        else s.add(id);
        setSelected(s);
    }

    async function handleBulkAction(action: 'In Progress' | 'Complete') {
        const ids = Array.from(selected);
        if (ids.length === 0) {
            alert("No requests selected");
            return;
        }

        setIsLoading(true);
        try {
            await Promise.all(ids.map(id => updateRequestStatus(id, action)));

            // Refresh data
            const data = await getRequests();
            setRequests(data);
            setSelected(new Set());
            alert(`Bulk action successful: ${ids.length} requests updated to ${action}`);
        } catch (err: any) {
            alert("Error updating requests: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const visible = requests.filter((r) => {
        if (filters.status !== "All" && r.status !== filters.status) return false;
        if (filters.client !== "All" && r.profiles?.email !== filters.client) return false;
        if (filters.urgency !== "All" && r.urgency !== filters.urgency) return false;
        return true;
    });

    const uniqueClients = Array.from(new Set(requests.map(r => r.profiles?.email).filter(Boolean)));

    if (isLoading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                        onClick={() => handleBulkAction('In Progress')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-lg shadow-indigo-100 font-bold text-sm active:scale-95"
                    >
                        Bulk Start
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

            <section className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1">Status Filter</label>
                    <select
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl text-sm font-bold px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                    >
                        <option value="All">All statuses</option>
                        <option>New</option>
                        <option>In Progress</option>
                        <option>Info Needed</option>
                        <option>Peer Review</option>
                        <option>Complete</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1">Client Filter</label>
                    <select
                        onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl text-sm font-bold px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                    >
                        <option value="All">All clients</option>
                        {uniqueClients.map(email => (
                            <option key={email} value={email!}>{email}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1">Priority</label>
                    <select
                        onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl text-sm font-bold px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                    >
                        <option value="All">Any urgency</option>
                        <option>Normal</option>
                        <option>Urgent</option>
                    </select>
                </div>
            </section>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                    Error: {error}
                </div>
            )}

            <div className="card-premium overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto min-w-[900px]">
                        <thead>
                            <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 italic">
                                <th className="px-6 py-5">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        onChange={(e) => {
                                            if (e.target.checked) setSelected(new Set(visible.map(v => v.id)));
                                            else setSelected(new Set());
                                        }}
                                        checked={selected.size > 0 && selected.size === visible.length}
                                    />
                                </th>
                                <th className="px-6 py-5">Request Title</th>
                                <th className="px-6 py-5">Identified Client</th>
                                <th className="px-6 py-5">Current Status</th>
                                <th className="px-6 py-5">Priority</th>
                                <th className="px-6 py-5">Created Date</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium italic">
                                        No matching requests found in the system.
                                    </td>
                                </tr>
                            ) : (
                                visible.map((r) => (
                                    <tr
                                        key={r.id}
                                        className={`hover:bg-slate-50/50 transition-colors group ${r.urgency === "Urgent" ? "bg-red-50/20" : ""}`}
                                    >
                                        <td className="px-6 py-5">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                checked={selected.has(r.id)}
                                                onChange={() => toggle(r.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{r.title}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-medium text-slate-500">{r.profiles?.email}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={r.status} />
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${r.urgency === "Urgent"
                                                ? "bg-red-50 text-red-600 border border-red-100"
                                                : "bg-slate-50 text-slate-500"
                                                }`}>
                                                {r.urgency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-400 font-medium">
                                            {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/admin/requests/${r.id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                                            >
                                                Manage
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
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
