
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    PlusCircle,
    BarChart3,
    CheckSquare,
    Code2,
    User,
    LogOut,
    PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
    const { user, role, logout } = useAuth();
    const pathname = usePathname();
    const { toggleSidebar, state } = useSidebar();

    if (!user) return null;

    const links = [
        { href: "/client", label: "Dashboard", icon: LayoutDashboard, roles: ["client"] },
        { href: "/requests/new", label: "New Ticket", icon: PlusCircle, roles: ["client"] },
        { href: "/admin", label: "Overview", icon: LayoutDashboard, roles: ["admin"] },
        { href: "/admin/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
        { href: "/reviewer", label: "Reviews", icon: CheckSquare, roles: ["reviewer"] },
        { href: "/developer", label: "Dev Queue", icon: Code2, roles: ["developer"] },
    ];

    const filteredLinks = links.filter((link) => link.roles.includes(role || ""));

    return (
        <Sidebar collapsible="icon" className="border-none bg-white shadow-xl shadow-slate-200/50 z-50">
            <SidebarHeader className="pt-1 px-4 pb-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-1">
                <SidebarMenu>
                    <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:overflow-visible" tooltip="WebUpdates">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-yellow-400 text-stone-900 shadow-xl shadow-yellow-200 ring-4 ring-white group-data-[collapsible=icon]:ring-0 group-data-[collapsible=icon]:shadow-none transition-all duration-300">
                                    <span className="font-black text-xl group-data-[collapsible=icon]:text-sm tracking-tighter">US</span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden transition-all duration-300">
                                    <span className="truncate font-black tracking-tight text-slate-900 text-xl">
                                        Web<span className="text-yellow-500">Updates</span>
                                    </span>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="py-4 group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-2 overflow-x-hidden">
                <SidebarMenu className="gap-2">
                    {filteredLinks.map((link) => {
                        const isActive = pathname?.startsWith(link.href);
                        const Icon = link.icon;
                        return (
                            <SidebarMenuItem key={link.href} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={link.label}
                                    size="lg"
                                    className={cn(
                                        "transition-all duration-200 font-bold rounded-none group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center",
                                        isActive
                                            ? "bg-yellow-400 text-stone-900 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:text-slate-500"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <Link href={link.href} className="flex items-center gap-3 px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
                                        <Icon className={cn("size-5 group-data-[collapsible=icon]:size-6", isActive ? "text-stone-900" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-base group-data-[collapsible=icon]:hidden">{link.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl"
                            tooltip="Profile"
                        >
                            <div className="flex aspect-square size-10 group-data-[collapsible=icon]:size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all duration-300">
                                <User className="size-5 group-data-[collapsible=icon]:size-4" strokeWidth={2.5} />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-black text-slate-800 text-base">
                                    {role === 'client' ? "Saint Mary's Academy" : (role ? role.charAt(0).toUpperCase() + role.slice(1) : "Client")}
                                </span>
                                <span className="truncate text-xs font-bold text-slate-400">{user.email}</span>
                            </div>
                            <div onClick={logout} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Logout">
                                <LogOut className="size-5" />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
