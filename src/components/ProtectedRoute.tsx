"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/lib/auth-context";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allow: Role[];
}

export function ProtectedRoute({ children, allow }: ProtectedRouteProps) {
    const { role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !role) {
            router.push("/login");
        }
    }, [role, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!role) {
        return null;
    }

    if (!allow.includes(role)) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-sm border border-red-100">
                    <h3 className="font-bold text-lg mb-2">Access Denied</h3>
                    <p>You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
