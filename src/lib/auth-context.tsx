"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";

// Define role types
export type Role = "client" | "admin" | "reviewer" | null;

interface AuthContextType {
    user: User | null;
    role: Role;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUserRole = async (userId: string, retryCount = 0): Promise<void> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116' && retryCount < 5) {
                const delay = (retryCount + 1) * 1000;
                await new Promise(res => setTimeout(res, delay));
                return fetchUserRole(userId, retryCount + 1);
            }
            setRole(null);
        } else {
            setRole(data.role as Role);
        }
    };

    const refreshRole = async () => {
        if (user) {
            await fetchUserRole(user.id);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id).finally(() => setIsLoading(false));
            } else {
                logout();
                setIsLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchUserRole(currentUser.id);
            } else {
                setRole(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        router.push("/login");
        await supabase.auth.signOut();
        console.log("User logged out");
        
    };

    return (
        <AuthContext.Provider value={{ user, role, isLoading, logout, refreshRole }}>
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
