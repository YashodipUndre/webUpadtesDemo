"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { PlusIcon } from "@/components/ui/icons";
import { MessageSquare, Calendar, Trash2, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth-context";



export default function DashboardPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!isLoading && role) {
      if (role === 'admin') router.replace('/admin');
      else if (role === 'reviewer') router.replace('/reviewer');
      else if (role === 'developer') router.replace('/developer');
    }
  }, [role, isLoading, router]);


  return (
    <ProtectedRoute allow={["client", "admin", "reviewer"]}>
      {isLoading || role !== 'client' ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <ClientDashboardContent />
      )}
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
  const [sort, setSort] = useState("DateDesc");
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

    // 2. Search Query
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter((r) =>
        (r.title + (r.profiles?.email || "") + r.id).toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    arr.sort((a, b) => {
      let diff = 0;
      if (sort === "DateDesc") {
        diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sort === "DateAsc") {
        diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sort === "Urgency") {
        const priority: Record<string, number> = { "Urgent": 2, "Normal": 1 };
        const pA = priority[a.urgency] || 0;
        const pB = priority[b.urgency] || 0;
        diff = pB - pA;
        if (diff === 0) {
          diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      }

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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Requests</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {filteredRequests.length} of {requests.length} shown
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative group min-w-[300px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              placeholder="Search by page, description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm font-medium placeholder:text-slate-400 transition-all shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-200 rounded-xl text-sm font-bold pl-4 pr-9 py-2 text-slate-600 focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer transition-all shadow-sm"
              >
                <option value="Urgency">All urgency</option>
                <option value="DateDesc">Newest</option>
                <option value="DateAsc">Oldest</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full bg-white border border-slate-200 rounded-xl text-sm font-bold pl-4 pr-9 py-2 text-slate-600 focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer transition-all shadow-sm"
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Info Needed">Info Needed</option>
                <option value="Peer Review">Peer Review</option>
                <option value="Complete">Complete</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <button
              onClick={() => router.push("/requests/new")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-stone-900 rounded-xl transition-all shadow-sm active:scale-95 text-sm font-bold whitespace-nowrap"
              title="Create New Request"
            >
              <PlusIcon />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Content Box */}
      <div className="card-premium overflow-hidden bg-white rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-200/50">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-20 bg-slate-50/50">
            <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200 text-slate-300 rounded-3xl flex items-center justify-center mb-4 transform -rotate-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No requests found</h3>
            <p className="text-sm text-slate-500 font-medium">Try clearing search or changing filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto h-[400px] overflow-y-auto scrollbar-hide">
            <table className="w-full table-auto min-w-[800px]">
              <thead>
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-6 py-5">Ref</th>
                  <th className="px-6 py-5">Request Information</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Urgency</th>
                  <th className="px-6 py-5">Timeline</th>
                  <th className="px-6 py-5 text-right">Activity</th>
                  <th className="px-6 py-5 text-right">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.map((r) => {
                  const createdDate = new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                  return (
                    <tr
                      key={r.id}
                      onClick={() => router.push(`/requests/${r.id}`)}
                      className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${r.urgency === 'Urgent' ? 'bg-red-50/20' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 font-bold text-[10px] border border-slate-200 group-hover:bg-yellow-400 group-hover:text-stone-900 group-hover:border-yellow-400 transition-colors">
                          #{r.id.slice(0, 4)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-yellow-600 transition-colors leading-tight line-clamp-1">{r.title}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1">
                            {r.items?.length || 0} {r.items?.length === 1 ? 'Action Item' : 'Action Items'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${r.urgency === 'Urgent'
                          ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-100'
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
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-lg text-slate-400 group-hover:border-slate-200 transition-all">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-black">{r.total_messages || 0}</span>
                          </div>
                          {r.unseen_count! > 0 && (
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-sm shadow-yellow-200" />
                          )}
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
