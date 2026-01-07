"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define a simple local User type
export interface LocalUser {
    id: string;
    email: string;
    role: Role;
}

export type Role = "client" | "admin" | "reviewer" | "developer" | null;

interface AuthContextType {
    user: LocalUser | null;
    role: Role;
    isLoading: boolean;
    login: (email: string, role: Role) => Promise<void>;
    signup: (email: string, role: Role) => Promise<void>;
    logout: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "web_updates_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<LocalUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hydrate session from localStorage
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            setUser(data);
        }
        setIsLoading(false);
    }, []);

    const signup = async (email: string, role: Role) => {
        const newUser: LocalUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        setUser(newUser);
    };

    const login = async (email: string, role: Role) => {
        // In a dummy app, we just accept whatever the user picks on the UI
        let id = "dummy-id-" + Date.now();
        if (email === 'reviewer1@dummy.com') id = 'rev-1';
        else if (email === 'reviewer2@dummy.com') id = 'rev-2';
        else if (email === 'admin@dummy.com') id = 'admin-1';

        const dummyUser: LocalUser = {
            id,
            email,
            role
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(dummyUser));
        setUser(dummyUser);
    };

    const logout = async () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        router.push("/login");
    };

    const refreshRole = async () => {
        // No-op in dummy mode
    };

    const role = user?.role || null;

    return (
        <AuthContext.Provider value={{ user, role, isLoading, logout, refreshRole, login, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
