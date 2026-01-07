"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { RequestCard } from "@/components/RequestCard";
import { PlusIcon } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth-context";

const ITEMS_PER_PAGE = 5;

export default function DashboardPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!isLoading && role) {
      if (role === 'admin') router.replace('/admin');
      else if (role === 'reviewer') router.replace('/reviewer');
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
  const [page, setPage] = useState(1);


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

  useEffect(() => {
    setPage(1);
  }, [filter, query, sort]);


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
      <div className="bg-white border border-slate-200 rounded-3xl min-h-[400px] relative overflow-hidden shadow-sm">
        {filteredRequests.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No requests found</h3>
            <p className="text-sm text-slate-500 font-medium">Try clearing search or changing filters.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 grid grid-cols-1 gap-1 flex-1">
              {filteredRequests.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((r) => (
                <RequestCard
                  key={r.id}
                  request={r}
                  onOpen={() => router.push(`/requests/${r.id}`)}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            {filteredRequests.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-slate-400">
                  Page {page} of {Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(Math.ceil(filteredRequests.length / ITEMS_PER_PAGE), p + 1))}
                  disabled={page >= Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)}
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
