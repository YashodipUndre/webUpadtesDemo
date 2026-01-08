"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage as sendSupabaseMessage, Request, Attachment, fileToBase64 } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketItemCard } from "@/components/TicketItemCard";
import { useAuth } from "@/lib/auth-context";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function ClientRequestDetailPage() {
    return (
        <ProtectedRoute allow={["client"]}>
            <ClientRequestDetail />
        </ProtectedRoute>
    );
}

function ClientRequestDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [reply, setReply] = useState("");
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, 'client');
                    setRequest(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (id) fetchRequest();
        }, 2000);
        return () => clearTimeout(timer);
    }, [id]);

    async function sendReply() {
        if ((!reply.trim() && !attachment) || !user || !request) return;
        setIsSending(true);
        try {
            await sendSupabaseMessage(request.id, user.id, reply, false, attachment || undefined, 'client', user.email || 'Client');
            setReply("");
            setAttachment(null);
            const updated = await getRequestById(id, user.id, 'client');
            setRequest(updated);
        } catch (err: any) {
            alert("Error sending message: " + err.message);
        } finally {
            setIsSending(false);
        }
    }

    async function handleReopen() {
        if (!request || !user) return;
        setIsSending(true);
        try {
            await updateRequestStatus(request.id, "Reopened", user.email || 'Client');
            await sendSupabaseMessage(request.id, user.id, "Client reopened the ticket.", false, undefined, 'client', user.email || 'Client');
            const updated = await getRequestById(id, user.id, 'client');
            setRequest(updated);
        } catch (err: any) {
            alert("Error reopening ticket: " + err.message);
        } finally {
            setIsSending(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error || !request) {
        return <div className="p-6 text-red-600">Request not found: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{request.title}</h1>
                    <p className="text-sm text-gray-600">
                        {request.profiles?.email} • {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <StatusBadge status={request.status} />
                    {request.urgency === "Urgent" && (
                        <div className="text-red-600 mt-2 font-semibold">Marked Urgent</div>
                    )}
                    {request.status === "Complete" && (
                        <button
                            onClick={handleReopen}
                            disabled={isSending}
                            className="mt-2 px-4 py-2 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-lg hover:bg-red-200 transition-colors"
                        >
                            {isSending ? "Reopening..." : "Reopen Ticket"}
                        </button>
                    )}
                </div>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200 shadow-sm">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Support Team</h3>
                                <p className="text-xs text-slate-500">Typically replies within 1 hour</p>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {/* Date Separator (Mock) */}
                            <div className="flex justify-center mb-6">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {request.messages && request.messages.length > 0 ? (
                                request.messages
                                    .filter(m => !m.is_internal)
                                    .map((m) => {
                                        const isMe = m.user_id === user?.id;
                                        return (
                                            <div
                                                key={m.id}
                                                className={`flex w-full gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                                            >
                                                {!isMe && (
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm mt-1">
                                                        {m.profiles?.email?.substring(0, 2).toUpperCase() || "ST"}
                                                    </div>
                                                )}

                                                <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                                    <div className="flex items-center gap-2 mb-1 px-1">
                                                        {!isMe && (
                                                            <span className="text-[10px] font-bold text-slate-600">
                                                                {m.profiles?.email ? m.profiles.email.split('@')[0] : 'Support Team'}
                                                                <span className="text-slate-400 font-normal ml-1 capitalize">({m.profiles?.role || 'Admin'})</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div
                                                        className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${isMe
                                                            ? "bg-white text-stone-900 border-slate-200 rounded-tr-sm"
                                                            : "bg-white text-slate-700 border-slate-200 rounded-tl-sm"
                                                            }`}
                                                    >
                                                        <div className="leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: m.text }} />

                                                        {m.attachments && m.attachments.length > 0 && (
                                                            <div className="mt-3 space-y-2">
                                                                {m.attachments.map((att, idx) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={att.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${isMe
                                                                            ? "bg-yellow-50 border-yellow-100 hover:bg-yellow-100"
                                                                            : "bg-white border-slate-100 hover:border-slate-300"
                                                                            }`}
                                                                    >
                                                                        <div className={`w-8 h-8 flex items-center justify-center rounded ${isMe ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`text-xs font-bold truncate ${isMe ? "text-stone-900" : "text-slate-700"}`}>{att.name}</p>
                                                                            <p className={`text-[9px] uppercase ${isMe ? "text-slate-400" : "text-slate-400"}`}>Attachment</p>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <span className="text-[9px] text-slate-400 mt-1 px-1 select-none">
                                                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                {isMe && (
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center text-[10px] font-black text-yellow-500 shadow-sm mt-1">
                                                        ME
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="flex justify-center mt-10">
                                    <span className="bg-slate-100 text-slate-400 text-xs px-4 py-2 rounded-xl italic">
                                        No messages yet. Start the conversation below.
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-4 border-t border-slate-200">
                            {attachment && (
                                <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-yellow-900 truncate max-w-[200px]">{attachment.name}</span>
                                    </div>
                                    <button onClick={() => setAttachment(null)} className="p-1 hover:bg-yellow-200 rounded-full text-yellow-600 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}
                            <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                <RichTextEditor
                                    value={reply}
                                    onChange={setReply}
                                    placeholder="Type a message..."
                                    className="min-h-[80px]"
                                    leadingActions={
                                        <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await fileToBase64(file); setAttachment({ name: file.name, url, type: file.type }); } }} />
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </label>
                                    }
                                    trailingActions={
                                        <button
                                            onClick={sendReply}
                                            disabled={isSending || (!reply.trim() && !attachment)}
                                            className="px-4 py-2 bg-yellow-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                        >
                                            {isSending ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                <>
                                                    SEND
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                </>
                                            )}
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 mb-4 border-b pb-2">Ticket Items</h3>
                        <div className="space-y-4">
                            {request.items?.map(item => (
                                <TicketItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}
