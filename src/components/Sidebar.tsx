"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    PlusCircle,
    FileText,
    BarChart3,
    CheckSquare,
    Code2,
    Settings,
    LogOut,
    User,
    PanelLeft
} from "lucide-react";

export function Sidebar() {
    const { user, role, logout } = useAuth();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);

    if (!user) return null;

    const links = [
        { href: "/client", label: "Dashboard", icon: LayoutDashboard, roles: ["client"] },
        { href: "/requests/new", label: "New Ticket", icon: PlusCircle, roles: ["client"] },
        { href: "/admin", label: "Overview", icon: LayoutDashboard, roles: ["admin"] },
        { href: "/admin/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
        { href: "/reviewer", label: "Reviews", icon: CheckSquare, roles: ["reviewer"] },
        { href: "/developer", label: "Dev Queue", icon: Code2, roles: ["developer"] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(role || ""));

    return (
        <aside className={cn(
            "bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 sticky top-0 font-sans transition-all duration-300 ease-in-out z-30",
            collapsed ? "w-[80px]" : "w-64"
        )}>
            {/* Logo Section */}
            <div className={cn("h-20 flex items-center border-b border-slate-100 relative", collapsed ? "justify-center px-0" : "px-6")}>
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center shadow-lg shadow-yellow-100 ring-2 ring-white shrink-0">
                        <span className="text-stone-900 font-black text-lg tracking-tighter">US</span>
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300">
                            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                                Web<span className="text-yellow-500">Updates</span>
                            </span>
                        </div>
                    )}
                </Link>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-12 top-6 w-8 h-8 bg-transparent flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <PanelLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className={cn("flex-1 py-6 space-y-1 overflow-y-auto", collapsed ? "px-3" : "px-4")}>
                {filteredLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center rounded-md group text-sm font-bold transition-all duration-200",
                                collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                                isActive
                                    ? "bg-yellow-400 text-stone-900 shadow-sm shadow-yellow-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            title={collapsed ? link.label : undefined}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-stone-900" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                            {!collapsed && <span className="whitespace-nowrap overflow-hidden">{link.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Footer */}
            <div className={cn("border-t border-slate-100", collapsed ? "p-3" : "p-4")}>
                <div className={cn("flex items-center rounded-md bg-white shadow-sm cursor-default group transition-all", collapsed ? "justify-center p-2 bg-slate-50" : "gap-3 p-3")}>
                    <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center shrink-0 text-slate-400">
                        <User className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0 transition-all duration-300">
                                <p className="text-sm font-black text-slate-800 truncate">
                                    {role === 'client' ? "Saint Mary's Academy" : (role ? role.charAt(0).toUpperCase() + role.slice(1) : "Client")}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 truncate" title={user.email}>{user.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
