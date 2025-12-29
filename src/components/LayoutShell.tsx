"use client";

import React from "react";
import { Navbar } from "./Navbar";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="py-8 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500 font-medium">© 2025 Web Updates • Built for visual excellence</p>
                </div>
            </footer>
        </div>
    );
}
