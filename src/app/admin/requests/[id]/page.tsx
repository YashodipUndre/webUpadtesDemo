"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage, Request, updateItemStatus, updateItemEffortAndDate, getReviewers, assignItem, Attachment, isPeerReviewAdmin, addPeerReviewer, updateRequestSLA, updateItemExternalLinks, removePeerReviewer, submitPeerReviewDecision, fileToBase64 } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { RequestTimeline } from "@/components/RequestTimeline";
import { TicketItemCard } from "@/components/TicketItemCard";
import { useAuth } from "@/lib/auth-context";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Settings, Calendar, ShieldCheck, Clock, AlertTriangle, Timer, Activity, User, X as XIcon } from "lucide-react";

const ITEMS_PER_PAGE = 3;

export default function AdminRequestDetailPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminRequestDetail />
        </ProtectedRoute>
    );
}

function AdminRequestDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState("");
    const [activeTab, setActiveTab] = useState<'client' | 'internal'>('client');
    const [clientMessage, setClientMessage] = useState("");
    const [clientAttachment, setClientAttachment] = useState<Attachment | null>(null);
    const [internalNote, setInternalNote] = useState("");
    const [internalAttachment, setInternalAttachment] = useState<Attachment | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [reviewers, setReviewers] = useState<{ id: string, email: string }[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [itemsPage, setItemsPage] = useState(1);
    const [showAllAudit, setShowAllAudit] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, 'admin');
                    setRequest(data);
                    setStatus(data.status);
                    const revs = await getReviewers();
                    setReviewers(revs);
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

    const handleItemStatusUpdate = async (itemId: string, newStatus: string) => {
        if (!user || !request) return;
        setIsUpdating(true);
        try {
            await updateItemStatus(request.id, itemId, newStatus, user.email || 'Admin');
            await sendMessage(request.id, user.id, `Item status updated to: ${newStatus}`, true, undefined, 'admin', user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleItemEffortUpdate = async (itemId: string, effort: number, dueDate: string | null) => {
        if (!user || !request) return;
        try {
            await updateItemEffortAndDate(request.id, itemId, effort, dueDate, user.email || 'Admin');
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const handleItemAssignment = async (itemId: string, reviewerId: string | null) => {
        if (!user || !request) return;
        setIsUpdating(true);
        try {
            await assignItem(request.id, itemId, reviewerId, user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };


    async function handleStatusChange(newStatus: string) {
        if (!request || !user) return;

        if (newStatus === "Complete") {
            setShowCompleteConfirm(true);
            return;
        }

        setIsUpdating(true);
        try {
            await updateRequestStatus(request.id, newStatus, user.email || 'Admin');
            await sendMessage(request.id, user.id, `Global Ticket Status updated to: ${newStatus}`, false, undefined, 'admin', user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            setStatus(newStatus);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function confirmComplete() {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            const newStatus = "Complete";
            await updateRequestStatus(request.id, newStatus, user.email || 'Admin');
            await sendMessage(request.id, user.id, `Ticket marked as COMPLETED. All items finalized.`, false, undefined, 'admin', user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            setStatus(newStatus);
            setShowCompleteConfirm(false);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendMessageToClient() {
        if ((!clientMessage.trim() && !clientAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, clientMessage, false, clientAttachment || undefined, 'admin', user.email || 'Admin');
            setClientMessage("");
            setClientAttachment(null);
            setShowConfirm(false);
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendInternalNote() {
        if ((!internalNote.trim() && !internalAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, internalNote, true, internalAttachment || undefined, 'admin', user.email || 'Admin');
            setInternalNote("");
            setInternalAttachment(null);
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
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
            <div className="flex items-center justify-between gap-6">
                <div className="min-w-[250px]">
                    <h1 className="text-2xl font-bold">Admin — {request.title}</h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex-1 hidden px-6 lg:block">
                    <RequestTimeline request={request} />
                </div>

                <div className="text-right flex-shrink-0">
                    <StatusBadge status={request.status} />
                    <div className="text-sm mt-2 font-medium">
                        Urgency: <span className={request.urgency === 'Urgent' ? 'text-red-600 font-bold' : ''}>{request.urgency}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shadow-sm">
                                    <span className="text-xs font-black">{request.profiles?.email?.substring(0, 2).toUpperCase() || 'CL'}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{request.profiles?.email}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${request.profiles?.role === 'client' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">{request.profiles?.role || 'Client'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${request.status === 'Complete' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    {request.status}
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            <div className="flex justify-center mb-6">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {request.messages?.map((m) => {
                                const isMe = m.user_id === user?.id;
                                const isInternal = m.is_internal;

                                return (
                                    <div
                                        key={m.id}
                                        className={`flex w-full gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        {!isMe && (
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm mt-1">
                                                {m.profiles?.email?.substring(0, 2).toUpperCase() || "??"}
                                            </div>
                                        )}

                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                {!isMe && (
                                                    <span className="text-[10px] font-bold text-slate-600">
                                                        {m.profiles?.email.split('@')[0]}
                                                        <span className="text-slate-400 font-normal ml-1 capitalize">({m.profiles?.role || 'Unknown'})</span>
                                                    </span>
                                                )}
                                                {isInternal && (
                                                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black rounded uppercase">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                        Internal
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${isInternal
                                                    ? "bg-amber-50 text-slate-800 border-amber-200"
                                                    : isMe
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
                                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${isMe && !isInternal
                                                                    ? "bg-yellow-50 border-yellow-100 hover:bg-yellow-100"
                                                                    : "bg-white border-slate-100 hover:border-slate-300"
                                                                    }`}
                                                            >
                                                                <div className={`w-8 h-8 flex items-center justify-center rounded ${isMe && !isInternal ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-xs font-bold truncate ${isMe && !isInternal ? "text-stone-900" : "text-slate-700"}`}>{att.name}</p>
                                                                    <p className={`text-[9px] uppercase ${isMe && !isInternal ? "text-slate-400" : "text-slate-400"}`}>Attachment</p>
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
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center text-[10px] font-black text-yellow-700 shadow-sm mt-1">
                                                ME
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Footer */}
                        <div className={`p-4 border-t border-slate-200 transition-colors ${activeTab === 'internal' ? 'bg-amber-50/30' : 'bg-white'}`}>
                            {/* Mode Toggle Pills */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                                    <button
                                        onClick={() => setActiveTab('client')}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ${activeTab === 'client' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'client' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        Reply to Client
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('internal')}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ${activeTab === 'internal' ? 'bg-white text-amber-700 shadow-sm ring-1 ring-amber-900/5' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'internal' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                        Internal Note
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Input Area */}
                            {activeTab === 'client' ? (
                                <div className="space-y-3">
                                    {clientAttachment && (
                                        <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-700">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </div>
                                                <span className="text-xs font-bold text-yellow-900 truncate max-w-[200px]">{clientAttachment.name}</span>
                                            </div>
                                            <button onClick={() => setClientAttachment(null)} className="p-1 hover:bg-yellow-200 rounded-full text-yellow-600 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden border border-slate-200">
                                        <div className="bg-yellow-50/50 px-4 py-2 border-b border-yellow-100 flex items-center gap-2 text-[10px] font-bold text-yellow-700 uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            Warning: This message will be visible to the client
                                        </div>
                                        <RichTextEditor
                                            value={clientMessage}
                                            onChange={setClientMessage}
                                            placeholder="Type a message to client..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await fileToBase64(file); setClientAttachment({ name: file.name, url, type: file.type }); } }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={sendMessageToClient}
                                                    disabled={isUpdating || (!clientMessage.trim() && !clientAttachment)}
                                                    className="px-4 py-2 bg-yellow-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                                >
                                                    {isUpdating ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
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
                            ) : (
                                <div className="space-y-3">
                                    {internalAttachment && (
                                        <div className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-amber-700">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </div>
                                                <span className="text-xs font-bold text-amber-900 truncate max-w-[200px]">{internalAttachment.name}</span>
                                            </div>
                                            <button onClick={() => setInternalAttachment(null)} className="p-1 hover:bg-amber-200 rounded-full text-amber-600 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                        <RichTextEditor
                                            value={internalNote}
                                            onChange={setInternalNote}
                                            placeholder="Add private note..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer transition-all" title="Attach to Internal">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await fileToBase64(file); setInternalAttachment({ name: file.name, url, type: file.type }); } }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={sendInternalNote}
                                                    disabled={isUpdating || (!internalNote.trim() && !internalAttachment)}
                                                    className="px-4 py-2 bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:bg-amber-100 disabled:text-amber-300 transition-all shadow-md hover:shadow-lg shadow-amber-100 active:scale-95 flex items-center gap-2"
                                                >
                                                    {isUpdating ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                        <>
                                                            SAVE NOTE
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="space-y-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500" />

                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Ticket Management</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Override global settings</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3 text-yellow-500" />
                                        Global Status
                                    </label>
                                    <StatusBadge status={status} size="sm" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={isUpdating}
                                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-slate-700 text-sm appearance-none cursor-pointer group-hover:border-slate-300"
                                    >
                                        {status !== 'Complete' && (
                                            <>
                                                <option>New</option>
                                                <option>In Progress</option>
                                                <option>Info Needed</option>
                                                <option>Peer Review</option>
                                            </>
                                        )}
                                        {(status === 'Complete' || status === 'Reopened') && <option>Reopened</option>}
                                        <option>Complete</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-yellow-500" />
                                        Global SLA Due Date
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={request.sla_due_date ? new Date(request.sla_due_date).toISOString().slice(0, 16) : ""}
                                        onChange={async (e) => {
                                            const newDate = e.target.value ? new Date(e.target.value).toISOString() : null;
                                            await updateRequestSLA(request.id, newDate);
                                            const updated = await getRequestById(id, user?.id, 'admin');
                                            setRequest(updated);
                                        }}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-slate-700 text-sm group-hover:border-slate-300"
                                    />
                                </div>

                                {request.sla_due_date && (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                        {new Date(request.sla_due_date) < new Date() ? (
                                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl">
                                                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                                    <AlertTriangle className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">SLA BREACHED</p>
                                                    <p className="text-[9px] font-bold text-red-400 mt-1 uppercase">Immediate action required</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <Timer className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">ON TRACK</p>
                                                    <p className="text-[9px] font-bold text-emerald-500 mt-1 uppercase">
                                                        {Math.floor((new Date(request.sla_due_date).getTime() - Date.now()) / 3600000)}h {Math.floor(((new Date(request.sla_due_date).getTime() - Date.now()) % 3600000) / 60000)}m remaining
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Item Specifications</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Manage individual request components</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                <span className="text-[10px] font-black text-slate-500 uppercase">
                                    {((itemsPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(itemsPage * ITEMS_PER_PAGE, request.items?.length || 0)} <span className="text-slate-300 mx-1">/</span> {request.items?.length || 0}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {request.items?.slice((itemsPage - 1) * ITEMS_PER_PAGE, itemsPage * ITEMS_PER_PAGE).map(item => (
                                <TicketItemCard key={item.id} item={item}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Trello URL</label>
                                                <input
                                                    type="url"
                                                    value={item.trello_url || ""}
                                                    onChange={async (e) => {
                                                        await updateItemExternalLinks(id, item.id, e.target.value || null, item.filemaker_url || null, user?.email || 'Admin');
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-medium"
                                                    placeholder="https://trello.com/..."
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">FileMaker Link</label>
                                                <input
                                                    type="url"
                                                    value={item.filemaker_url || ""}
                                                    onChange={async (e) => {
                                                        await updateItemExternalLinks(id, item.id, item.trello_url || null, e.target.value || null, user?.email || 'Admin');
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-medium"
                                                    placeholder="fmp://..."
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Effort (hrs)</label>
                                                <input
                                                    type="number"
                                                    value={item.estimated_effort}
                                                    onChange={(e) => handleItemEffortUpdate(item.id, parseInt(e.target.value) || 0, item.due_date)}
                                                    onBlur={async () => {
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Due Date</label>
                                                <input
                                                    type="date"
                                                    value={item.due_date ? item.due_date.split('T')[0] : ""}
                                                    onChange={(e) => handleItemEffortUpdate(item.id, item.estimated_effort, e.target.value ? new Date(e.target.value).toISOString() : null)}
                                                    onBlur={async () => {
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleItemStatusUpdate(item.id, e.target.value)}
                                                disabled={request.status === 'Complete'}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option>New</option>
                                                <option>In Progress</option>
                                                <option>Info Needed</option>
                                                <option>Peer Review</option>
                                                {isPeerReviewAdmin(user?.email) && <option>Complete</option>}
                                            </select>
                                            {!isPeerReviewAdmin(user?.email) && item.status !== 'Complete' && (
                                                <p className="text-[8px] text-slate-400 mt-1 italic">Only Peer Review Admins can mark as Complete</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Assigned Developer</label>
                                            <select
                                                value={item.reviewer_id || ""}
                                                onChange={(e) => handleItemAssignment(item.id, e.target.value || null)}
                                                disabled={request.status === 'Complete'}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option value="">Unassigned</option>
                                                {reviewers.filter(r => (r as any).role === 'developer').map(rev => (
                                                    <option key={rev.id} value={rev.id}>
                                                        {rev.email} ({(rev as any).role})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100">
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Assigned Reviewers ({item.peer_reviewers?.length || 0})</label>
                                            <div className="space-y-2">
                                                {item.peer_reviewers?.map(pr => (
                                                    <div key={pr.user_id} className="flex flex-col gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-xl group/pr relative">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-bold text-slate-700">{pr.email.split('@')[0]}</span>
                                                            <button
                                                                onClick={async () => {
                                                                    await removePeerReviewer(request.id, item.id, pr.user_id);
                                                                    const updated = await getRequestById(id, user?.id, 'admin');
                                                                    setRequest(updated);
                                                                }}
                                                                className="text-slate-300 hover:text-rose-500 transition-colors"
                                                            >
                                                                <XIcon className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                        <div className="w-full">
                                                            {(() => {
                                                                const decision = pr.decision;
                                                                let label = 'Pending';
                                                                let className = 'bg-slate-100 text-slate-500 border-slate-200';
                                                                let icon = null;

                                                                if (decision === 'Yes') {
                                                                    label = 'Approved';
                                                                    className = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                                                                    icon = <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
                                                                } else if (decision === 'No') {
                                                                    label = 'Not Approved';
                                                                    className = 'bg-rose-100 text-rose-700 border-rose-200';
                                                                    icon = <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
                                                                } else {
                                                                    icon = <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                                                                }

                                                                return (
                                                                    <div className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-2 ${className}`}>
                                                                        {icon}
                                                                        <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                ))}
                                                <select
                                                    value=""
                                                    onChange={async (e) => {
                                                        const rev = reviewers.find(r => r.id === e.target.value);
                                                        if (rev) {
                                                            await addPeerReviewer(request.id, item.id, rev);
                                                            const updated = await getRequestById(id, user?.id, 'admin');
                                                            setRequest(updated);
                                                        }
                                                    }}
                                                    disabled={request.status === 'Complete'}
                                                    className="w-full p-2 bg-slate-100 border-dashed border-2 border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:border-slate-300 transition-all cursor-pointer disabled:cursor-not-allowed disabled:hover:border-slate-200"
                                                >
                                                    <option value="">+ Assign Reviewer</option>
                                                    {reviewers.filter(r => !item.peer_reviewers?.find(p => p.user_id === r.id)).map(r => (
                                                        <option key={r.id} value={r.id}>{r.email}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </TicketItemCard>
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        {request.items && request.items.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                                <button
                                    onClick={() => setItemsPage(p => Math.max(1, p - 1))}
                                    disabled={itemsPage === 1}
                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Page</span>
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100 italic">
                                        {itemsPage}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter mx-1">of</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                        {Math.ceil((request.items?.length || 0) / ITEMS_PER_PAGE)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setItemsPage(p => Math.min(Math.ceil((request.items?.length || 0) / ITEMS_PER_PAGE), p + 1))}
                                    disabled={itemsPage >= Math.ceil((request.items?.length || 0) / ITEMS_PER_PAGE)}
                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            </div >

            {/* AUDIT LOG SECTION */}
            <section className="mt-8 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-100" >
                <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Operational Audit Trail</h3>
                </div>

                <div className="space-y-4">
                    {(() => {
                        const logs = request.audit_logs?.slice().reverse() || [];
                        const visibleLogs = showAllAudit ? logs : logs.slice(0, 5);

                        return (
                            <>
                                {visibleLogs.map(log => (
                                    <div key={log.id} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shadow-sm shadow-yellow-200" />
                                            <div className="w-px h-full bg-slate-100 flex-1 my-1" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                                <span className="text-xs font-black text-slate-800">{log.action}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">by {log.user_email}</span>
                                                <span className="text-[10px] font-bold text-slate-300 ml-auto">{new Date(log.created_at).toLocaleString()}</span>
                                            </div>
                                            {(log.previous_value || log.new_value) && (
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                                                    <span className="px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100 italic">{log.previous_value || 'Initial'}</span>
                                                    <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 rounded border border-yellow-100 font-bold">{log.new_value}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {logs.length > 5 && (
                                    <button
                                        onClick={() => setShowAllAudit(!showAllAudit)}
                                        className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2 border-t border-slate-50 mt-2"
                                    >
                                        {showAllAudit ? 'Show Less' : `View ${logs.length - 5} More Entries`}
                                        <svg className={`w-3 h-3 transition-transform ${showAllAudit ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </>
                        );
                    })()}
                    {(!request.audit_logs || request.audit_logs.length === 0) && (
                        <p className="text-xs text-slate-400 italic text-center py-4">No audit history found for this request.</p>
                    )}
                </div>
            </section >



            {/* Confirmation Modal for Complete */}
            <ConfirmationModal
                isOpen={showCompleteConfirm}
                onClose={() => setShowCompleteConfirm(false)}
                onConfirm={confirmComplete}
                title="CONFIRM COMPLETION"
                message="Are you sure you want to mark this ticket as Completed? This declares all items finalized and notifies the client."
                confirmText="YES, COMPLETE"
            />
        </div >
    );
}
