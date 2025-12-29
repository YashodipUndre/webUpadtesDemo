"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, sendMessage as sendSupabaseMessage, Request } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth-context";

export default function ClientRequestDetailPage() {
    return (
        <ProtectedRoute allow={["client"]}>
            <ClientRequestDetail />
        </ProtectedRoute>
    );
}

function ClientRequestDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [reply, setReply] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        async function fetchRequest() {
            try {
                const data = await getRequestById(id);
                setRequest(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchRequest();
    }, [id]);

    async function sendReply() {
        if (!reply || !user || !request) return;
        setIsSending(true);
        try {
            await sendSupabaseMessage(request.id, user.id, reply);
            setReply("");
            // Refresh request to show new message
            const updated = await getRequestById(id);
            setRequest(updated);
        } catch (err: any) {
            alert("Error sending message: " + err.message);
        } finally {
            setIsSending(false);
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
                    <h1 className="text-2xl font-bold">{request.title}</h1>
                    <p className="text-sm text-gray-600">
                        {request.profiles?.email} • {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <StatusBadge status={request.status} />
                    {request.urgency === "Urgent" && (
                        <div className="text-red-600 mt-2 font-semibold">Marked Urgent</div>
                    )}
                </div>
            </div>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-4">Conversation</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {request.messages && request.messages.length > 0 ? (
                                request.messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`p-3 rounded-lg max-w-[80%] ${m.user_id === user?.id
                                                ? "bg-blue-50 ml-auto border border-blue-100"
                                                : "bg-gray-50 mr-auto border border-gray-100"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-semibold text-gray-500">
                                                {m.profiles?.email} ({m.profiles?.role})
                                            </span>
                                        </div>
                                        <p className="text-gray-800">{m.text}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 text-right">
                                            {new Date(m.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-8 italic">No messages yet.</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-2">Reply</h3>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={4}
                        />
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={sendReply}
                                disabled={isSending || !reply.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {isSending ? "Sending..." : "Send Reply"}
                            </button>
                        </div>
                    </div>
                </div>
                <aside className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-3 border-b pb-2">Request Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <StatusBadge status={request.status} />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Urgency</span>
                                <span className={`font-medium ${request.urgency === 'Urgent' ? 'text-red-600' : 'text-gray-900'}`}>{request.urgency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Created At</span>
                                <span className="text-gray-900">{new Date(request.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}
