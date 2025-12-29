"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { MenuIcon } from "@/components/ui/icons";

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
    const { user, role, logout } = useAuth();

    return (
        <div className="relative z-50">
            {open && (
                <motion.aside
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-72 bg-white shadow-xl p-6 space-y-6 h-screen fixed left-0 top-0 z-20 overflow-y-auto"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <MenuIcon />
                            <h2 className="text-xl font-bold">Web Updates</h2>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 md:hidden"
                        >
                            Close
                        </button>
                    </div>

                    {user && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                                {role || "User"}
                            </div>
                            <div className="text-sm text-gray-700 truncate font-medium">
                                {user.email}
                            </div>
                        </div>
                    )}

                    <nav className="space-y-2 text-sm">
                        {role === "client" && <NavLink href="/">Client Dashboard</NavLink>}
                        {role === "client" && <NavLink href="/requests/new">Create Request</NavLink>}

                        {role === "admin" && <NavLink href="/admin">Admin Dashboard</NavLink>}
                        {role === "admin" && <NavLink href="/admin/reports">Reports</NavLink>}

                        {role === "reviewer" && (
                            <NavLink href="/reviewer">Reviewer Dashboard</NavLink>
                        )}

                        {!user && (
                            <div className="space-y-2">
                                <NavLink href="/login">Login</NavLink>
                                <NavLink href="/signup">Sign Up</NavLink>
                            </div>
                        )}
                    </nav>

                    {user && (
                        <div className="pt-4 border-t">
                            <button
                                onClick={logout}
                                className="w-full text-left text-sm text-red-600 font-medium hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}

                    <div className="mt-6">
                        <p className="text-[10px] text-gray-400">© 2025 Web Updates Management</p>
                    </div>
                </motion.aside>
            )}

            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed left-2 top-2 z-30 bg-white shadow p-2 rounded-md hover:bg-gray-50 border border-gray-100"
                >
                    <MenuIcon />
                </button>
            )}
        </div>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="block p-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-md transition-all font-medium">
            {children}
        </Link>
    );
}
