"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Settings, User, Mail, Menu, X, ChevronLeft, ChevronRight, Code2 } from "lucide-react";

export function Sidebar() {
    const { user, role, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopOpen, setIsDesktopOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            {/* Desktop Sidebar Toggle (Visible on Desktop) */}


            {/* Mobile Toggle Button (Visible on Mobile) */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[60] w-12 h-12 bg-yellow-400 text-stone-900 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
            >
                {isMobileOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transform transition-all duration-300 ease-in-out flex flex-col
                lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] lg:sticky lg:top-16
                ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
                ${isDesktopOpen ? 'lg:w-64' : 'lg:w-20'}
            `}>
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsDesktopOpen(!isDesktopOpen)}
                    className="hidden lg:flex absolute -right-3 top-6 z-50 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 shadow-sm transition-all"
                >
                    {isDesktopOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                {/* User Profile Section */}
                <div className={`pt-6 pb-6 border-b border-slate-100 bg-white transition-all ${isDesktopOpen ? 'px-6' : 'px-2'}`}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center text-slate-400 group relative shrink-0">
                            <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        </div>

                        <div className={`text-center overflow-hidden transition-all duration-300 ${isDesktopOpen ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 lg:hidden'}`}>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">{role || "No Role"}</p>
                            <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]" title={user.email}>
                                {user.email?.split('@')[0]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {/* Account Details - Only visible when expanded */}
                    <div className={`transition-all duration-300 ${isDesktopOpen ? 'opacity-100 px-4 mb-6' : 'opacity-0 h-0 overflow-hidden'}`}>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Account</div>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="text-[10px] font-bold truncate">{user.email}</span>
                        </div>
                    </div>


                    {/* Role Based Links */}
                    {role === 'developer' && (
                        <div className={`px-3 transition-all ${!isDesktopOpen && 'flex justify-center'}`}>
                            <a href="/developer" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${!isDesktopOpen ? 'justify-center w-10 h-10 bg-yellow-400 text-stone-900 shadow-lg shadow-yellow-200' : 'bg-yellow-400 text-stone-900 shadow-lg shadow-yellow-200 hover:scale-[1.02] active:scale-95'}`} title="Dev Queue">
                                <Code2 className="w-5 h-5 flex-shrink-0" />
                                <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${isDesktopOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>Dev Queue</span>
                            </a>
                        </div>
                    )}
                    {role === 'reviewer' && (
                        <div className={`px-3 transition-all ${!isDesktopOpen && 'flex justify-center'}`}>
                            <a href="/reviewer" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${!isDesktopOpen ? 'justify-center w-10 h-10 bg-yellow-400 text-stone-900 shadow-lg shadow-yellow-200' : 'bg-yellow-400 text-stone-900 shadow-lg shadow-yellow-200 hover:scale-[1.02] active:scale-95'}`} title="Review Queue">
                                <User className="w-5 h-5 flex-shrink-0" />
                                <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${isDesktopOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>Review Queue</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t border-slate-100 space-y-1">
                    <button
                        onClick={() => {
                            if (window.innerWidth < 1024) setIsMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group ${!isDesktopOpen && 'justify-center'}`}
                        title="Settings"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        <span className={`text-xs font-bold whitespace-nowrap transition-all duration-300 ${isDesktopOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>Settings</span>
                    </button>
                    <button
                        onClick={() => {
                            setIsMobileOpen(false);
                            logout();
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all group active:scale-95 ${!isDesktopOpen && 'justify-center'}`}
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className={`text-xs font-bold whitespace-nowrap transition-all duration-300 ${isDesktopOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden lg:hidden'}`}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 animate-in fade-in"
                />
            )}
        </>
    );
}
