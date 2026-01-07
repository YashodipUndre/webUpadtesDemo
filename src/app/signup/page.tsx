"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

    const { signup } = useAuth();

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

        try {
            await signup(email, role as any);

            if (role === 'admin') router.push('/admin');
            else if (role === 'reviewer') router.push('/reviewer');
            else router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh] relative overflow-hidden py-20">
            {/* Dynamic Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-lg z-10 px-6">
                <form onSubmit={handleSignup} className="glass p-10 rounded-3xl shadow-2xl border border-white/40">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-2xl shadow-yellow-100 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-4xl font-black text-stone-900 tracking-tighter">US</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Begin Your Journey</h2>
                        <p className="text-xs text-slate-500 font-medium mt-2">Join the next generation of update management</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Email Address</label>
                            <input
                                placeholder="name@organization.com"
                                className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Confirm Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Department Role</label>
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="client">Client</option>
                                    <option value="reviewer">Peer Reviewer</option>
                                    <option value="admin">System Admin</option>
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
                        className="w-full bg-yellow-400 text-stone-900 font-black px-4 py-3.5 rounded-xl mt-10 hover:bg-yellow-500 transition-all active:scale-[0.98] shadow-xl shadow-yellow-100 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-3 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-sm tracking-tight">Sign Up</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-black hover:underline underline-offset-8 transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
