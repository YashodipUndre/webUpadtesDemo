"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
    const router = useRouter();
    const { refreshRole } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState("client");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setIsLoading(false);
            return;
        }

        // Robust Profile Update: Ensure the role is set correctly in the database
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: email,
                    role: role
                }, { onConflict: 'id' });

            if (profileError) {
                console.error("Profile sync error:", profileError);
            }

            // Wait for DB consistency (Trigger + RLS)
            await new Promise(res => setTimeout(res, 1000));
            // Force the context to fetch the latest role from DB
            await refreshRole();
        }

        setIsLoading(false);

        if (role === 'admin') router.push('/admin');
        else if (role === 'reviewer') router.push('/reviewer');
        else router.push('/');
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh] relative overflow-hidden py-20">
            {/* Dynamic Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-xl z-10 px-6">
                <form onSubmit={handleSignup} className="glass p-12 rounded-[2.5rem] shadow-2xl border border-white/40">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] shadow-2xl shadow-indigo-200 mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-5xl font-black text-white">W</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Begin Your Journey</h2>
                        <p className="text-slate-500 font-medium mt-3">Join the next generation of update management</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl mb-10 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest transition-colors group-focus-within:text-indigo-600">Email Address</label>
                            <input
                                placeholder="name@organization.com"
                                className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest transition-colors group-focus-within:text-indigo-600">Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest transition-colors group-focus-within:text-indigo-600">Confirm Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest transition-colors group-focus-within:text-indigo-600">Department Role</label>
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="client">Client & Project Lead</option>
                                    <option value="reviewer">Internal Reviewer</option>
                                    <option value="admin">System Administrator</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-black px-4 py-5 rounded-2xl mt-12 hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-lg tracking-tight">Initialize Workspace</span>
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Returning operator?{" "}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-black hover:underline underline-offset-8 transition-all">
                                Authentication Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
