"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { motion } from "framer-motion";
import { TrendingUp, School, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";

export default function AdminReportsPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminReports />
        </ProtectedRoute>
    );
}

function AdminReports() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchData() {
                try {
                    const data = await getRequests(undefined, 'admin');
                    setRequests(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchData();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    // --- Data Processing ---

    // 1. Requests by School (Volume & Workload)
    const schoolStats = requests.reduce((acc, r) => {
        const schoolName = r.profiles?.school || "Unknown School";
        if (!acc[schoolName]) {
            acc[schoolName] = { count: 0, effort: 0, items: 0 };
        }
        acc[schoolName].count += 1;
        r.items?.forEach(item => {
            acc[schoolName].items += 1;
            acc[schoolName].effort += (item.estimated_effort || 0);
        });
        return acc;
    }, {} as Record<string, { count: number; effort: number; items: number }>);

    const sortedSchools = Object.entries(schoolStats).sort((a, b) => b[1].count - a[1].count);

    // 2. Ticket Volume Over Time (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const volumeOverTime = last7Days.map(date => ({
        date,
        count: requests.filter(r => r.created_at.startsWith(date)).length
    }));

    const maxVolume = Math.max(...volumeOverTime.map(v => v.count), 1);

    // 3. Status Distribution
    const statusCounts = {
        New: requests.filter(r => r.status === 'New').length,
        'In Progress': requests.filter(r => ['In Progress', 'Peer Review', 'Info Needed'].includes(r.status)).length,
        Complete: requests.filter(r => r.status === 'Complete').length,
    };

    // 4. SLA Compliance Calculation
    const completedRequests = requests.filter(r => r.status === 'Complete');
    const slaMetCount = completedRequests.filter(r => {
        if (!r.sla_due_date) return true; // No SLA = Met
        // Find completion date from audit logs
        const completionLog = r.audit_logs?.slice().reverse().find(l => l.new_value === 'Complete');
        // If no log found, assume strictly it's not verifiable, but for dummy data filtering we might be lenient or use created_at if completed immediately.
        // Let's use current time if completed but no log (e.g. data init), likely failing if old SLA.
        // Actually, if status is Complete and no log, let's look at r.updated_at if it exists? No.
        // Optimistic approach for demo: if complete, check against SLA. If no completion time is recorded, we can't really judge.
        // Let's assume valid data would have audit log.
        const completionDate = completionLog ? new Date(completionLog.created_at) : new Date();

        return completionDate <= new Date(r.sla_due_date);
    }).length;

    const slaPercentage = completedRequests.length > 0 ? Math.round((slaMetCount / completedRequests.length) * 100) : 100;

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-stone-900" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 transition-all">
                        Operations Analytics
                    </h1>
                </div>
                <p className="text-slate-500 font-medium max-w-2xl">
                    Performance tracking and workload distribution across all schools and campuses.
                </p>
            </header>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Tickets" value={requests.length} icon={<BarChart3 className="w-5 h-5" />} color="yellow" />
                <StatCard title="Active Workload" value={statusCounts['In Progress']} icon={<Clock className="w-5 h-5" />} color="blue" />
                <StatCard title="High Urgency" value={requests.filter(r => r.urgency === 'Urgent').length} icon={<AlertCircle className="w-5 h-5" />} color="rose" />
                <StatCard title="SLA Compliance" value={`${slaPercentage}%`} icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* School Leaderboard */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                                <School className="w-4 h-4 text-yellow-500" />
                                Workload per School
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter">Maintenance Distribution</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sortedSchools.map(([name, stats], idx) => (
                            <div key={name} className="group">
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center text-[9px] font-black text-slate-400 border border-slate-100">{idx + 1}</span>
                                        <span className="text-xs font-bold text-slate-700">{name}</span>
                                    </div>
                                    <div className="text-right leading-none">
                                        <span className="text-[10px] font-black text-yellow-600 block">{stats.count} Tickets</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stats.effort} Total Hours</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stats.count / (sortedSchools[0][1].count || 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-200/50"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SLA Performance */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            SLA Performance
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter">On-Time Completion Rate</p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                                <motion.path
                                    initial={{ strokeDasharray: "0, 100" }}
                                    animate={{ strokeDasharray: `${(completedRequests.length > 0 ? (slaMetCount / completedRequests.length) * 100 : 0)}, 100` }}
                                    className="text-emerald-500"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-slate-800">
                                    {completedRequests.length > 0 ? Math.round((slaMetCount / completedRequests.length) * 100) : 0}%
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">Met</span>
                            </div>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-emerald-800 tracking-wide">Within Estimate</p>
                                    <p className="text-lg font-black text-emerald-600">{slaMetCount}</p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-rose-800 tracking-wide">Overdue</p>
                                    <p className="text-lg font-black text-rose-600">{completedRequests.length - slaMetCount}</p>
                                </div>
                                <AlertCircle className="w-5 h-5 text-rose-400" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ticket Volume Chart */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6 flex flex-col lg:col-span-2">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                            <TrendingUp className="w-4 h-4 text-yellow-500" />
                            Trend Analysis
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter">Last 7 Days Activity</p>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 px-2">
                        {volumeOverTime.map((v, i) => (
                            <div key={v.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all bg-stone-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg pointer-events-none">
                                    {v.count}
                                </div>
                                <motion.div
                                    initial={{ height: 4 }}
                                    animate={{ height: `Math.max(${(v.count / maxVolume) * 100}, 2)%` }} // Ensure at least 2% height
                                    style={{ height: `${(v.count / maxVolume) * 100}%` }} // Fallback
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className={`w-full max-w-[30px] rounded-t-lg min-h-[4px] transition-all ${v.count === maxVolume && v.count > 0 ? 'bg-yellow-400' : 'bg-slate-100 group-hover:bg-yellow-200'}`}
                                />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter rotate-0 mt-2">
                                    {new Date(v.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Top Clients */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Top Clients</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">By Request Volume</p>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(requests.reduce((acc, r) => {
                            const email = r.profiles?.email || 'Unknown';
                            acc[email] = (acc[email] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>))
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([email, count], i) => (
                                <div key={email} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                                            #{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-700">{email.split('@')[0]}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-slate-800">{count}</span>
                                </div>
                            ))}
                    </div>
                </section>

                {/* Team Workload */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Team Workload</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Requests</p>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(requests.filter(r => r.status !== 'Complete').reduce((acc, r) => {
                            const reviewer = r.reviewer_id ? `Reviewer ${r.reviewer_id.slice(-4)}` : 'Unassigned';
                            acc[reviewer] = (acc[reviewer] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)).map(([reviewer, count], i) => (
                            <div key={reviewer} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                    <span>{reviewer}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / (requests.length || 1)) * 100}%` }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status Breakdown */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Status Breakdown</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Distribution</p>
                    </div>
                    <div className="space-y-3">
                        {['New', 'In Progress', 'Peer Review', 'Info Needed', 'Complete'].map(status => {
                            const count = requests.filter(r => r.status === status).length;
                            const percentage = Math.round((count / (requests.length || 1)) * 100);
                            return (
                                <div key={status} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status === 'New' ? 'bg-blue-400' :
                                        status === 'Complete' ? 'bg-emerald-400' :
                                            status === 'Peer Review' ? 'bg-amber-400' : 'bg-slate-400'
                                        }`} />
                                    <span className="text-[10px] font-bold text-slate-600 w-20">{status}</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`h-full ${status === 'New' ? 'bg-blue-400' :
                                                status === 'Complete' ? 'bg-emerald-400' :
                                                    status === 'Peer Review' ? 'bg-amber-400' : 'bg-slate-400'
                                                }`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-800">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Urgency Distribution */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Urgency</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Priority Split</p>
                    </div>
                    <div className="flex items-center justify-center h-48 relative">
                        {/* Simple Donut Chart Representation */}
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                {/* Background Circle */}
                                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                                {/* Urgent Segment */}
                                <motion.path
                                    initial={{ strokeDasharray: "0, 100" }}
                                    animate={{ strokeDasharray: `${(requests.filter(r => r.urgency === 'Urgent').length / (requests.length || 1)) * 100}, 100` }}
                                    className="text-rose-500"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-slate-800">{requests.filter(r => r.urgency === 'Urgent').length}</span>
                                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wide">Urgent</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-[-10px]">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-[10px] font-bold text-slate-500">Urgent</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                            <span className="text-[10px] font-bold text-slate-500">Normal</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}


function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
    const colorMap: any = {
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        rose: "bg-rose-50 text-rose-700 border-rose-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return (
        <div className={`p-4 rounded-2xl border ${colorMap[color]} shadow-sm flex items-center justify-between`}>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">{title}</p>
                <p className="text-2xl font-black tracking-tight">{value}</p>
            </div>
            <div className="p-2 bg-white/60 rounded-xl shadow-sm">
                {icon}
            </div>
        </div>
    );
}
