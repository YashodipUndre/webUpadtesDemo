"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage, Request } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth-context";

export default function AdminRequestDetailPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminRequestDetail />
        </ProtectedRoute>
    );
}

function AdminRequestDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState("");
    const [clientMessage, setClientMessage] = useState("");
    const [internalNote, setInternalNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, 'admin');
                    setRequest(data);
                    setStatus(data.status);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (id) fetchRequest();
        }, 2000);
        return () => clearTimeout(timer);
    }, [id]);

    async function handleStatusChange(newStatus: string) {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            await updateRequestStatus(request.id, newStatus);
            await sendMessage(request.id, user.id, `Status updated to: ${newStatus}`);

            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            setStatus(newStatus);
            alert(`Status updated to ${newStatus}`);
        } catch (err: any) {
            alert("Error updating status: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendMessageToClient() {
        if (!clientMessage.trim() || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, clientMessage, false);
            setClientMessage("");
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            alert("Message sent to client");
        } catch (err: any) {
            alert("Error sending message: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendInternalNote() {
        if (!internalNote.trim() || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, internalNote, true);
            setInternalNote("");
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            alert("Internal note saved");
        } catch (err: any) {
            alert("Error saving note: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !request) {
        return <div className="p-6 text-red-600">Request not found: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Admin — {request.title}</h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <StatusBadge status={request.status} />
                    <div className="text-sm mt-2 font-medium">
                        Urgency: <span className={request.urgency === 'Urgent' ? 'text-red-600 font-bold' : ''}>{request.urgency}</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-4">Communication History</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {request.messages?.map((m) => (
                                <div
                                    key={m.id}
                                    className={`p-3 rounded-md border ${m.is_internal ? "bg-amber-50 border-amber-100" : (m.profiles?.role === "client" ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100")}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-600">{m.profiles?.email}</span>
                                            {m.is_internal && (
                                                <span className="px-1.5 py-0.5 bg-amber-200 text-amber-800 text-[9px] font-black rounded uppercase">Internal Note</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-800">{m.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                                Message to Client
                            </h3>
                            <textarea
                                value={clientMessage}
                                onChange={(e) => setClientMessage(e.target.value)}
                                placeholder="Write a message visible to the client..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 shadow-sm"
                                rows={3}
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={sendMessageToClient}
                                    disabled={isUpdating || !clientMessage.trim()}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all font-bold text-xs active:scale-95 shadow-lg shadow-indigo-100"
                                >
                                    {isUpdating ? "Sending..." : "Send to Client"}
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-dashed border-slate-200">
                            <h3 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-amber-500 rounded-full" />
                                Internal Coordination Note
                            </h3>
                            <textarea
                                value={internalNote}
                                onChange={(e) => setInternalNote(e.target.value)}
                                placeholder="Add a private note only admins and reviewers can see..."
                                className="w-full p-4 bg-amber-50/50 border border-amber-100 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all outline-none font-medium text-slate-700"
                                rows={2}
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={sendInternalNote}
                                    disabled={isUpdating || !internalNote.trim()}
                                    className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-all font-bold text-xs active:scale-95 shadow-lg shadow-amber-100"
                                >
                                    {isUpdating ? "Saving..." : "Save Internal Note"}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <aside className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-3 border-b pb-2">Actions</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={isUpdating}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                >
                                    <option>New</option>
                                    <option>In Progress</option>
                                    <option>Info Needed</option>
                                    <option>Peer Review</option>
                                    <option>Complete</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={() => handleStatusChange(status)}
                                    disabled={isUpdating}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
                                >
                                    {isUpdating ? "Processing..." : "Sync Status"}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
