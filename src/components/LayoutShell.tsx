"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth-context";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900">
            <Navbar />

            <div className="flex flex-1">
                {user && <Sidebar />}

                <div className="flex-1 flex flex-col">
                    <main className="flex-1 w-full px-6 py-0">
                        <div className="pt-6">
                            {children}
                        </div>
                    </main>

                    <footer className="py-8 border-t border-slate-200">
                        <div className="px-6 text-center lg:text-left">
                            <p className="text-sm text-slate-500 font-medium">© 2025 Web Updates • Built for visual excellence</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
