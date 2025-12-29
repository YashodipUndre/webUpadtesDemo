"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage, Request } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth-context";

export default function ReviewerRequestDetailPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerRequestDetail />
        </ProtectedRoute>
    );
}

function ReviewerRequestDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [clientMessage, setClientMessage] = useState("");
    const [internalNote, setInternalNote] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        async function fetchRequest() {
            try {
                const data = await getRequestById(id, user?.id, 'reviewer');
                setRequest(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchRequest();
    }, [id]);

    async function handleReviewAction(action: 'approve' | 'request_changes') {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            const newStatus = action === 'approve' ? 'In Progress' : 'In Progress'; // Typically 'In Progress' for both but with different internal flags in a real app.
            const systemMessage = action === 'approve'
                ? "Reviewer approved the work — admin notified."
                : "Reviewer requested changes — admin notified.";

            await updateRequestStatus(request.id, newStatus);
            await sendMessage(request.id, user.id, systemMessage);

            alert(action === 'approve' ? "Approved and admin notified" : "Changes requested and admin notified");
            router.push("/reviewer");
        } catch (err: any) {
            alert("Error: " + err.message);
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
            const updated = await getRequestById(id, user.id, 'reviewer');
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
            const updated = await getRequestById(id, user.id, 'reviewer');
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
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                        <span className="text-indigo-600">Review:</span> {request.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <StatusBadge status={request.status} />
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
                                            <span className="text-xs font-bold text-gray-600">
                                                {m.profiles?.email} ({m.profiles?.role})
                                            </span>
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
                                rows={2}
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
                                Reviewer Coordination Note
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
                        <h3 className="font-semibold mb-4 border-b pb-2">Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleReviewAction('request_changes')}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 transition-all font-black shadow-xl shadow-rose-100 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Request Changes
                            </button>
                            <button
                                onClick={() => handleReviewAction('approve')}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 transition-all font-black shadow-xl shadow-emerald-100 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Approve Work
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
                            Approving notifies the admin to move the request to 'In Progress' for final delivery.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
