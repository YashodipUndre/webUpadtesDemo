"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, X, Calendar, MessageSquare, ArrowRight, Code2, Terminal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DeveloperDashboardPage() {
    return (
        <ProtectedRoute allow={["developer"]}>
            <DeveloperDashboard />
        </ProtectedRoute>
    );
}

function DeveloperDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequests() {
                try {
                    const data = await getRequests(user?.id, 'developer');
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

    // Show ALL requests to ANY developer, regardless of specific assignment
    const filtered = requests.filter((r) => {
        // Shared Queue (Assigned Only): Show request to ALL developers, BUT only if it has been assigned to *someone*.
        // Unassigned requests remain hidden until Admin assigns them.
        const isAssignedToSomeone = r.items?.some(item => !!item.reviewer_id);

        if (!isAssignedToSomeone) return false;

        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || r.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        setPage(1);
    }, [searchQuery, filterStatus]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent shadow-xl shadow-yellow-100"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-4">
            <header className="space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-200 flex items-center gap-1.5 shadow-sm shadow-yellow-100">
                        <Terminal className="w-2.5 h-2.5" />
                        Developer Workspace
                    </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Technical Task Queue</h1>
                <p className="text-slate-500 font-medium max-w-2xl text-sm">
                    Review and execute technical implementation for website updates assigned directly to your workflow.
                </p>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold animate-in fade-in">
                    System Error: {error}
                </div>
            )}

            <Card className="p-6 bg-white rounded-[2.5rem] border-slate-200 shadow-xl shadow-yellow-100/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-full shadow-sm shadow-yellow-200" />
                        Implementation Tasks
                        <span className="ml-1 px-2.5 py-1 bg-yellow-500 text-stone-900 rounded-full text-[11px] font-extrabold shadow-sm shadow-yellow-100">
                            {filtered.length}
                        </span>
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl justify-end">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                            <Input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus-visible:ring-yellow-400/10 focus-visible:border-yellow-400 shadow-none h-auto"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            {['All', 'In Progress', 'Peer Review', 'Complete'].map((status) => (
                                <Button
                                    key={status}
                                    variant={filterStatus === status ? "default" : "outline"}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap h-auto border",
                                        filterStatus === status
                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
                                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                        <div className="w-20 h-20 bg-white shadow-xl shadow-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-5 transform -rotate-6 border border-yellow-50">
                            <Code2 className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h4 className="text-slate-900 font-bold text-base mb-1">Queue Clear</h4>
                        <p className="text-slate-400 font-medium text-sm">No active implementation tasks assigned to you.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto h-[400px] overflow-y-auto scrollbar-hide">
                        <Table className="min-w-[900px]">
                            <TableHeader>
                                <TableRow className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 hover:bg-transparent">
                                    <TableHead className="px-6 py-5">Item Ref</TableHead>
                                    <TableHead className="px-6 py-5">Description</TableHead>
                                    <TableHead className="px-6 py-5">Profile</TableHead>
                                    <TableHead className="px-6 py-5">Status</TableHead>
                                    <TableHead className="px-6 py-5">Urgency</TableHead>
                                    <TableHead className="px-6 py-5">Received</TableHead>
                                    <TableHead className="px-6 py-5 text-right">Execute</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-50">
                                {filtered.map((r) => {
                                    const createdDate = new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                                    return (
                                        <TableRow
                                            key={r.id}
                                            onClick={() => router.push(`/developer/requests/${r.id}`)}
                                            className={cn(
                                                "transition-all group cursor-pointer hover:bg-slate-50/80",
                                                r.urgency === 'Urgent' ? 'bg-red-50/20' : ''
                                            )}
                                        >
                                            <TableCell className="px-6 py-5">
                                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold text-[10px] border border-slate-200 group-hover:bg-yellow-500 group-hover:text-stone-900 group-hover:border-yellow-500 transition-colors">
                                                    {r.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-800 text-sm group-hover:text-yellow-600 transition-colors leading-tight line-clamp-1">{r.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${r.reviewer_id === user?.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            {r.items?.filter(it => it.reviewer_id === user?.id).length || 0} ITEMS
                                                        </span>
                                                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                                                            <MessageSquare className="w-2.5 h-2.5" />
                                                            {r.total_messages || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-slate-700">{r.profiles?.school || 'Unknown School'}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">{r.profiles?.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <StatusBadge status={r.status} />
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <Badge
                                                    variant={r.urgency === 'Urgent' ? "destructive" : "secondary"}
                                                    className="uppercase tracking-widest text-[10px] font-black"
                                                >
                                                    {r.urgency}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span className="text-[11px] font-bold">{createdDate}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                <div className="inline-flex items-center justify-center text-slate-300 group-hover:text-yellow-600 transition-colors">
                                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
}
