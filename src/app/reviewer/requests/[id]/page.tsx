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

    const [newComment, setNewComment] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

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

    async function addInternalComment() {
        if (!newComment.trim() || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, `(Internal Review Note): ${newComment}`);
            setNewComment("");
            const updated = await getRequestById(id);
            setRequest(updated);
        } catch (err: any) {
            alert("Error adding comment: " + err.message);
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
                    <h1 className="text-2xl font-bold">Review: {request.title}</h1>
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
                                    className={`p-3 rounded-md border ${m.profiles?.role === "client" ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100"
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-600">
                                            {m.profiles?.email} ({m.profiles?.role})
                                        </span>
                                        <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-800">{m.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold mb-2">Reviewer Feedback</h3>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add your review notes here..."
                            className="w-full border p-3 rounded-md mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={4}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={addInternalComment}
                                disabled={isUpdating || !newComment.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {isUpdating ? "Saving..." : "Add Note"}
                            </button>
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
                                className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition font-medium shadow-sm"
                            >
                                Request Changes
                            </button>
                            <button
                                onClick={() => handleReviewAction('approve')}
                                disabled={isUpdating}
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition font-medium shadow-sm"
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
