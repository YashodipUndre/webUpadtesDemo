"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { createRequest, sendMessage } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

export default function NewRequestPage() {
    return (
        <ProtectedRoute allow={["client"]}>
            <NewRequestForm />
        </ProtectedRoute>
    );
}

function NewRequestForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        if (!title.trim() || !description.trim()) {
            setError("Title and description are required");
            return;
        }
        if (!user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Create the request
            const request = await createRequest(title, urgency, user.id);

            // 2. Add the initial description as the first message
            await sendMessage(request.id, user.id, description);

            router.push("/");
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">Create New Request</h1>
            <div className="bg-white p-6 rounded-xl shadow space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                <div>
                    <label className="text-sm font-semibold">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Update About Us page"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1"
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide details about your request..."
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1"
                        rows={6}
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold">Urgency</label>
                    <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mt-1"
                    >
                        <option>Normal</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <div className="pt-4 flex items-center gap-4">
                    <button
                        onClick={submit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition font-medium"
                    >
                        {isSubmitting ? "Creating..." : "Submit Request"}
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
