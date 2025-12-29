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
    const [internalNotes, setInternalNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        async function fetchRequest() {
            try {
                const data = await getRequestById(id);
                setRequest(data);
                setStatus(data.status);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchRequest();
    }, [id]);

    async function handleStatusChange(newStatus: string) {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            await updateRequestStatus(request.id, newStatus);
            await sendMessage(request.id, user.id, `Status updated to: ${newStatus}`);

            const updated = await getRequestById(id);
            setRequest(updated);
            setStatus(newStatus);
            alert(`Status updated to ${newStatus}`);
        } catch (err: any) {
            alert("Error updating status: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendInternalNote() {
        if (!internalNotes.trim() || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, internalNotes);
            setInternalNotes("");
            const updated = await getRequestById(id);
            setRequest(updated);
            alert("Note sent");
        } catch (err: any) {
            alert("Error sending note: " + err.message);
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
                                    className={`p-3 rounded-md border ${m.profiles?.role === "client" ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-600">{m.profiles?.email}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-800">{m.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-2">Internal Note / Response</h3>
                        <textarea
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Add a note or response to the client..."
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={4}
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={sendInternalNote}
                                disabled={isUpdating || !internalNotes.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {isUpdating ? "Saving..." : "Send to Client"}
                            </button>
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
