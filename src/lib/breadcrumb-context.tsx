"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbContextType {
    pageTitle: string;
    setPageTitle: (title: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
    pageTitle: "",
    setPageTitle: () => { },
});

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
    const [pageTitle, setPageTitle] = useState("");

    return (
        <BreadcrumbContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumb() {
    return useContext(BreadcrumbContext);
}
