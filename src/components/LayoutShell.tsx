"use client";

import { AppSidebar } from "./app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { BreadcrumbProvider, useBreadcrumb } from "@/lib/breadcrumb-context";
import { usePathname } from "next/navigation";
import React from "react";

function LayoutShellContent({ children }: { children: React.ReactNode }) {
    const { user, role } = useAuth();
    const pathname = usePathname();
    const { pageTitle } = useBreadcrumb();

    // Don't show sidebar on login/signup or role selection pages
    if (!user || !role) {
        return <>{children}</>;
    }

    const pathSegments = pathname.split('/').filter(segment => segment);

    const generateBreadcrumbs = () => {
        let currentPath = "";

        // Get the dashboard path based on role
        const dashboardPath = role === 'client' ? '/client' :
            role === 'admin' ? '/admin' :
                role === 'developer' ? '/developer' :
                    role === 'reviewer' ? '/reviewer' : '/client';

        return pathSegments.map((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathSegments.length - 1;
            const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

            // Custom mapping for specific segments
            let label = formattedSegment;
            let linkPath = currentPath;

            if (segment === 'requests') {
                label = 'Dashboard';
                linkPath = dashboardPath; // Link to role-based dashboard
            } else if (segment === 'client' || segment === 'admin' || segment === 'developer' || segment === 'reviewer') {
                label = 'Dashboard';
            } else if (index > 0 && pathSegments[index - 1] === 'requests') {
                // If it's the segment after 'requests', it's the Ticket ID
                label = pageTitle || segment;
            }

            return (
                <React.Fragment key={currentPath}>
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage className="font-bold text-slate-900">{label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={linkPath} className="font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                {label}
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
            );
        });
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden flex flex-col h-screen">
                <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-slate-200 px-4 bg-white">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
                    <div className="container mx-auto px-6 py-8 max-w-7xl">
                        {/* Breadcrumb inside page content */}
                        <Breadcrumb className="mb-4">
                            <BreadcrumbList>
                                {generateBreadcrumbs()}
                            </BreadcrumbList>
                        </Breadcrumb>
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <LayoutShellContent>{children}</LayoutShellContent>
        </BreadcrumbProvider>
    );
}
