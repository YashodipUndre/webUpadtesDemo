"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Settings, User, Mail, Menu, X } from "lucide-react";

export function Sidebar() {
    const { user, role, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] w-12 h-12 bg-yellow-400 text-stone-900 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out 
                lg:static lg:translate-x-0 lg:flex flex-col lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 overflow-y-auto -mt-px
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* User Profile Section */}
                <div className="pt-4 pb-6 px-6 border-b border-slate-100 bg-white">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group relative">
                            <User className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">{role || "No Role"}</p>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]" title={user.email}>
                                {user.email?.split('@')[0]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 p-4 py-8 space-y-1 overflow-y-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Account Details</div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 mb-4">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-bold truncate">{user.email}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all group active:scale-95"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 animate-in fade-in"
                />
            )}
        </>
    );
}
