"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const { user, role, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Dashboard", show: role === "client" },
        { href: "/requests/new", label: "New Request", show: role === "client" },
        { href: "/admin", label: "Overview", show: role === "admin" },
        { href: "/admin/reports", label: "Reports", show: role === "admin" },
        { href: "/reviewer", label: "Reviews", show: role === "reviewer" },
    ].filter(link => link.show);

    return (
        <nav className="sticky top-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group text-slate-900 animate-in fade-in">
                            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-indigo-200 ring-4 ring-white">
                                <span className="text-white font-black text-2xl">W</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 ml-1">
                                Web<span className="text-indigo-600">Updates</span>
                            </span>
                        </Link>

                        <div className="hidden md:ml-12 md:flex md:space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-5">
                                <div className="text-right">
                                    {role ? (
                                        <div className="flex items-center justify-end gap-1.5 mb-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none">{role}</p>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] font-bold text-red-500 uppercase leading-none mb-1">No Role found</p>
                                    )}
                                    <p className="text-sm font-semibold text-slate-900 max-w-[150px] truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link>
                                <Link href="/signup" className="px-7 py-3 text-sm font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">Get Started</Link>
                            </div>
                        )}
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
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 pb-3 border-t border-slate-100">
                                {user ? (
                                    <div className="px-3">
                                        <div className="text-sm font-medium text-slate-500">{user.email}</div>
                                        <button
                                            onClick={() => { logout(); setMobileMenuOpen(false); }}
                                            className="mt-2 w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="px-3 space-y-1">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-md"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
