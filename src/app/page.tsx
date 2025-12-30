"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";
import { RequestCard } from "@/components/RequestCard";
import { PlusIcon } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth-context";

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute allow={["client"]}>
      <ClientDashboardContent />
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
    let arr = requests.slice();
    if (filter !== "All") arr = arr.filter((r) => r.status === filter);
    if (query)
      arr = arr.filter((r) =>
        (r.title + (r.profiles?.email || "")).toLowerCase().includes(query.toLowerCase())
      );
    if (sort === "DateDesc")
      arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sort === "DateAsc")
      arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    if (sort === "Urgency")
      arr.sort((a, b) => (a.urgency === "Urgent" ? -1 : 1));
    return arr;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your Dashboard</h1>
          <p className="text-slate-500 font-medium">Track your website updates and collaboration status.</p>
        </div>
        <button
          onClick={() => router.push("/requests/new")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95 whitespace-nowrap"
        >
          <PlusIcon /> Create Request
        </button>
      </header>

      <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <input
            placeholder="Search your requests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2 text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option>All</option>
            <option>New</option>
            <option>In Progress</option>
            <option>Info Needed</option>
            <option>Peer Review</option>
            <option>Complete</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2 text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            <option value="DateDesc">Newest</option>
            <option value="DateAsc">Oldest</option>
            <option value="Urgency">Urgency</option>
          </select>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {filtered().length === 0 ? (
        <div className="py-20 text-center card-premium bg-slate-50/30">
          <p className="text-slate-400 font-medium italic">No requests found matching your criteria.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered().map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onOpen={() => router.push(`/requests/${r.id}`)}
            />
          ))}
        </section>
      )}
    </div>
  );
}
