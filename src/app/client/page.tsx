"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { PlusIcon } from "@/components/ui/icons";
import { MessageSquare, Calendar, Trash2, Eye, Info, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



export default function DashboardPage() {
    const { role, isLoading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        // If user is not client, redirect them? Or since we are removing auth, maybe just let them be.
        // But ProtectedRoute handles that.
        // For now, let's keep it simple.
    }, [role, isLoading, router]);


    return (
        <ProtectedRoute allow={["client", "admin", "reviewer", "developer"]}>
            <ProtectedRoute allow={["client", "admin", "reviewer", "developer"]}>
                <ClientDashboardContent />
            </ProtectedRoute>
        </ProtectedRoute>
    );
}

function ClientDashboardContent() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("All");
    const router = useRouter();



    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequests() {
                try {
                    const data = await getRequests(user?.id, 'client');
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




    function filtered() {
        let arr = [...requests];

        // 1. Status Filter
        if (filter !== "All") arr = arr.filter((r) => r.status === filter);

        // 2. Urgency Filter
        if (sort === "UrgentOnly") {
            arr = arr.filter((r) => r.urgency === "Urgent");
        } else if (sort === "NonUrgent") {
            arr = arr.filter((r) => r.urgency === "Normal");
        }

        // 3. Search Query
        if (query) {
            const q = query.toLowerCase();
            arr = arr.filter((r) =>
                (r.title + (r.profiles?.email || "") + r.id).toLowerCase().includes(q)
            );
        }

        // 4. Sorting (by date, newest first)
        arr.sort((a, b) => {
            let diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

            // Secondary sort by ID for stability
            if (diff === 0) return a.id.localeCompare(b.id);
            return diff;
        });

        return arr;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const filteredRequests = filtered();

    return (
        <div className="space-y-6 pb-6">
            {/* Header Row: Title & Controls */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="shrink-0">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Requests</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        {filteredRequests.length} of {requests.length} shown
                    </p>
                </div>

                <div className="flex flex-1 items-center justify-end gap-2">
                    {/* Search Input */}
                    <div className="relative group w-[170px] shrink-0">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors z-10">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <Input
                            placeholder="Search by page, description..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border-slate-200 rounded-md focus-visible:ring-slate-400 shadow-sm h-auto"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-[135px] bg-white border-slate-200 rounded-md font-bold text-slate-600 focus:ring-slate-400 shadow-sm h-10">
                                <span className="text-slate-400 mr-1">Urgency:</span>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="UrgentOnly">Urgent only</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[135px] bg-white border-slate-200 rounded-md font-bold text-slate-600 focus:ring-slate-400 shadow-sm h-10">
                                <span className="text-slate-400 mr-1">Status:</span>
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Info Needed">Info Needed</SelectItem>
                                <SelectItem value="Complete">Complete</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button - always visible, disabled when no filters active */}
                        <Button
                            onClick={() => {
                                setQuery("");
                                setSort("All");
                                setFilter("All");
                            }}
                            variant="outline"
                            disabled={!query && sort === "All" && filter === "All"}
                            className="gap-2 px-3 py-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md shadow-sm h-10 text-sm font-bold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Clear all filters"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Clear</span>
                        </Button>

                        <Button
                            onClick={() => router.push("/requests/new")}
                            className="gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-md shadow-sm hover:shadow-md transition-all active:scale-95 text-sm font-bold whitespace-nowrap h-auto"
                            title="Create New Request"
                        >
                            <PlusIcon />
                            <span>Create Ticket</span>
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-slate-50 border border-slate-100 text-slate-600 p-4 rounded-xl text-sm font-bold">
                    {error}
                </div>
            )}

            {/* Main Content Box */}
            <Card className="overflow-hidden bg-white rounded-lg border-slate-200 shadow-xl shadow-slate-200/50 p-0">
                {filteredRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-20 bg-slate-50/50">
                        <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200 text-slate-300 rounded-3xl flex items-center justify-center mb-4 transform -rotate-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No requests found</h3>
                        <p className="text-sm text-slate-500 font-medium">Try clearing search or changing filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto h-[500px] overflow-y-auto scrollbar-hide">
                        <table className="w-full table-auto min-w-[800px]">
                            <thead>
                                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 sticky top-0 z-20 bg-white">
                                    <th className="px-6 py-2.5">Ref</th>
                                    <th className="px-6 py-2.5">Request Information</th>
                                    <th className="px-6 py-2.5">Details</th>
                                    <th className="px-6 py-2.5">Status</th>
                                    <th className="px-6 py-2.5">Urgency</th>
                                    <th className="px-6 py-2.5">Submitted</th>
                                    <th className="px-6 py-2.5">Start</th>
                                    <th className="px-6 py-2.5">Due</th>
                                    <th className="px-6 py-2.5 text-right">Activity</th>
                                    <th className="px-6 py-2.5 text-right">Access</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRequests.map((r) => {
                                    const createdDate = new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                                    return (
                                        <tr
                                            key={r.id}
                                            onClick={() => router.push(`/requests/${r.id}/review`)}
                                            className="hover:bg-slate-50 transition-all group cursor-pointer"
                                        >
                                            <td className="px-6 py-2.5">
                                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold text-[10px] border border-slate-200 transition-colors">
                                                    {r.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 max-w-[450px]">
                                                        <span className="font-bold text-slate-800 text-sm truncate">{r.title}</span>
                                                        {(r.description || (r.items?.length || 0) > 1) && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="w-4 h-4 text-slate-300 hover:text-yellow-600 transition-colors cursor-help shrink-0" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent sideOffset={5} className="bg-white shadow-lg border border-slate-200 p-4 rounded-lg min-w-[280px]">
                                                                        {r.description ? (
                                                                            <div className="space-y-1">
                                                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Description</p>
                                                                                <p className="text-xs font-medium text-slate-600 leading-snug">{r.description}</p>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="space-y-1">
                                                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Description</p>
                                                                                <p className="text-xs font-medium text-slate-400 italic">No global description provided.</p>
                                                                            </div>
                                                                        )}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
                                                    {r.page_url && (
                                                        <a
                                                            href={r.page_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-[11px] font-medium text-yellow-600 hover:text-yellow-700 hover:underline flex items-center gap-1 w-fit transition-colors"
                                                        >
                                                            {r.page_url}
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="w-8 h-8 rounded-full bg-slate-50 hover:bg-yellow-50 flex items-center justify-center transition-colors cursor-help border border-slate-100 hover:border-yellow-200 group/icon">
                                                                <FileText className="w-4 h-4 text-slate-400 group-hover/icon:text-yellow-600 transition-colors" />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent sideOffset={5} className="bg-white shadow-lg border border-slate-200 p-4 rounded-lg min-w-[300px] max-w-[350px]">
                                                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                                    <FileText className="w-3 h-3 text-slate-500" />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">All Request</span>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {/* Included Items List */}
                                                                {r.items && r.items.length > 0 ? (
                                                                    <div className="space-y-1">
                                                                        <p className="text-[10px] uppercase font-black text-slate-300 tracking-wider">
                                                                            Included Items ({r.items.length})
                                                                        </p>
                                                                        <ul className="space-y-1 max-h-[200px] overflow-y-auto pr-1">
                                                                            {r.items.map((item, idx) => (
                                                                                <li key={idx} className="flex flex-col gap-0.5 bg-slate-50 p-2 rounded-md border border-slate-100">
                                                                                    <div className="flex items-baseline gap-2">
                                                                                        <span className="text-[10px] font-bold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</span>
                                                                                        <span className="text-xs font-bold text-slate-700 leading-snug">
                                                                                            {(item.details as any)?.item_title || item.description || "Untitled Item"}
                                                                                        </span>
                                                                                    </div>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-slate-400 italic">No items in this ticket.</p>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <StatusBadge status={r.status === 'Peer Review' ? 'In Progress' : r.status} />
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <Badge
                                                    variant="outline"
                                                    className="uppercase tracking-widest text-[10px] font-black border-slate-200 text-slate-500"
                                                >
                                                    {r.urgency}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <span className="text-xs font-bold text-slate-600">{createdDate}</span>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <span className="text-xs font-bold text-slate-600">
                                                    {r.start_date ? new Date(r.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <span className="text-xs font-bold text-slate-600">
                                                    {r.sla_due_date ? new Date(r.sla_due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-lg text-slate-400 transition-all">
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        <span className="text-[11px] font-black">{r.total_messages || 0}</span>
                                                    </div>
                                                    {r.unseen_count! > 0 && (
                                                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors">
                                                    <Eye className="w-5 h-5 transition-transform" />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}


            </Card>
        </div >
    );
}
