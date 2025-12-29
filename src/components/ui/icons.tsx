import React from "react";

export function IconWrapper({ children }: { children: React.ReactNode }) {
    return (
        <span className="w-5 h-5 inline-flex items-center justify-center">
            {children}
        </span>
    );
}

export const MenuIcon = () => (
    <IconWrapper>
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </IconWrapper>
);

export const PlusIcon = () => (
    <IconWrapper>
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </IconWrapper>
);
