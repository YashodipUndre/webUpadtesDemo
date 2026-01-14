"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const { user, role, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/client", label: "Dashboard", show: role === "client" },
        { href: "/requests/new", label: "New Ticket", show: role === "client" },
        { href: "/admin", label: "Overview", show: role === "admin" },
        { href: "/admin/reports", label: "Reports", show: role === "admin" },
        { href: "/reviewer", label: "Reviews", show: role === "reviewer" },
        { href: "/developer", label: "Dev Queue", show: role === "developer" },
    ].filter(link => link.show);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group text-slate-900 animate-in fade-in">
                            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-yellow-100 ring-2 ring-white">
                                <span className="text-stone-900 font-black text-xl tracking-tighter">US</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 ml-1">
                                Web<span className="text-yellow-500">Updates</span>
                            </span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-1">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    asChild
                                    variant="ghost"
                                    className="text-sm font-bold text-slate-500 hover:text-yellow-600 hover:bg-yellow-50/50"
                                >
                                    <Link href={link.href}>
                                        {link.label}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                    </div>

                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    asChild
                                    variant="ghost"
                                    className="w-full justify-start text-base font-medium text-slate-600 hover:bg-yellow-50 hover:text-yellow-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={link.href}>
                                        {link.label}
                                    </Link>
                                </Button>
                            ))}
                            <div className="pt-4 pb-3 border-t border-slate-100">
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
