"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequests, Request } from "@/lib/data";

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
        async function fetchData() {
            try {
                const data = await getRequests();
                setRequests(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const total = requests.length;
    const newCount = requests.filter((r) => r.status === "New").length;
    const inProgress = requests.filter((r) => r.status === "In Progress").length;
    const urgent = requests.filter((r) => r.urgency === "Urgent").length;
    const peer = requests.filter((r) => r.status === "Peer Review").length;
    const complete = requests.filter((r) => r.status === "Complete").length;

    // Get unique clients from emails
    const clientEmails = Array.from(new Set(requests.map(r => r.profiles?.email).filter(Boolean)));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-sm text-gray-600">Summary of system activity</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ReportCard title="Total Requests" value={total} color="blue" />
                <ReportCard title="New" value={newCount} color="gray" />
                <ReportCard title="In Progress" value={inProgress} color="yellow" />
                <ReportCard title="Peer Review" value={peer} color="purple" />
                <ReportCard title="Urgent" value={urgent} color="red" />
                <ReportCard title="Completed" value={complete} color="green" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-3">Requests by Client</h3>
                <ul className="text-sm space-y-2">
                    {clientEmails.length > 0 ? (
                        clientEmails.map((email) => (
                            <li key={email} className="flex justify-between border-b pb-1">
                                <span>{email}</span>
                                <span>{requests.filter((r) => r.profiles?.email === email).length}</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400 italic">No clients found</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

function ReportCard({
    title,
    value,
    color,
}: {
    title: string;
    value: number;
    color: "blue" | "gray" | "yellow" | "purple" | "red" | "green";
}) {
    const colors = {
        blue: "bg-blue-100 text-blue-700",
        gray: "bg-gray-100 text-gray-700",
        yellow: "bg-yellow-100 text-yellow-700",
        purple: "bg-purple-100 text-purple-700",
        red: "bg-red-100 text-red-700",
        green: "bg-green-100 text-green-700",
    };
    return (
        <div className={`p-6 rounded-xl shadow ${colors[color]}`}>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}
