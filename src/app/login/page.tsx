"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            if (signInError.message.toLowerCase().includes("email not confirmed")) {
                setError("Login failed: Email confirmation is enabled in your Supabase Dashboard. Please turn it OFF in 'Authentication -> Providers -> Email' to allow instant login.");
            } else {
                setError(signInError.message);
            }
            setIsLoading(false);
            return;
        }

        // The AuthContext will pick up the change and we can redirect based on role there,
        // or we can fetch the role here and redirect immediately.
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profile?.role === 'client') router.push('/');
        else if (profile?.role === 'admin') router.push('/admin');
        else if (profile?.role === 'reviewer') router.push('/reviewer');
        else router.push('/');

        setIsLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh] relative overflow-hidden py-20">
            {/* Dynamic Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-xl z-10 px-6">
                <form onSubmit={handleLogin} className="glass p-12 rounded-[2.5rem] shadow-2xl border border-white/40">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] shadow-2xl shadow-indigo-200 mb-8 -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-5xl font-black text-white">W</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 font-medium mt-3">Access your operational command center</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl mb-10 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest transition-colors group-focus-within:text-indigo-600">Operator Email</label>
                            <input
                                placeholder="name@organization.com"
                                className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest transition-colors group-focus-within:text-indigo-600">Security Key</label>
                            <input
                                placeholder="••••••••"
                                type="password"
                                className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-slate-900 text-white font-black px-4 py-5 rounded-2xl mt-12 hover:bg-black transition-all active:scale-[0.98] shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 group"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-lg tracking-tight">Authorize Access</span>
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="mt-10 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            New operator?{" "}
                            <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-black hover:underline underline-offset-8 transition-all">
                                Request Access Token
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
