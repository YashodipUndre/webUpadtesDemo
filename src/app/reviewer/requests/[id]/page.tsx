"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage, Request, updateItemStatus, updateMultipleItemStatuses, Attachment, submitPeerReviewDecision, ITEM_STATUSES, RESPONSE_TEMPLATES, updateItemEffortAndDate, getReviewers, assignItem, fileToBase64 } from "@/lib/data";
import { RequestTimeline } from "@/components/RequestTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketItemCard } from "@/components/TicketItemCard";
import { useAuth } from "@/lib/auth-context";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Search, ChevronDown, User, Calendar, Clock, Link as LinkIcon, FileText, Image as ImageIcon, MessageCircle, ShieldCheck } from "lucide-react";

export default function ReviewerRequestDetailPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerRequestDetail />
        </ProtectedRoute>
    );
}

function ReviewerRequestDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user, role } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewers, setReviewers] = useState<{ id: string, email: string }[]>([]);

    const [activeTab, setActiveTab] = useState<'client' | 'internal'>('internal');
    const [clientMessage, setClientMessage] = useState("");
    const [clientAttachment, setClientAttachment] = useState<Attachment | null>(null);
    const [internalNote, setInternalNote] = useState("");
    const [internalAttachment, setInternalAttachment] = useState<Attachment | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [itemSearchQuery, setItemSearchQuery] = useState("");
    const [showAllAudit, setShowAllAudit] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, role || 'reviewer');
                    setRequest(data);
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

    async function handleReviewAction(action: 'approve' | 'request_changes') {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            const newStatus = action === 'approve' ? 'In Progress' : 'Info Needed';
            const systemMessage = action === 'approve'
                ? "Reviewer approved the overall work bundle."
                : "Reviewer requested changes for the bundle.";

            await updateRequestStatus(request.id, newStatus, user.email || 'Reviewer');
            await sendMessage(request.id, user.id, systemMessage, false, undefined, 'reviewer', user.email || 'Reviewer');

            alert(action === 'approve' ? "Approved and admin notified" : "Changes requested and admin notified");
            router.push("/reviewer");
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
            // First, mark all items that have peer reviewers as Complete
            const itemsWithReviewers = request.items?.filter(item =>
                item.peer_reviewers && item.peer_reviewers.length > 0
            ) || [];

            if (itemsWithReviewers.length === 0) {
                alert("No items with peer reviewers to mark as complete.");
                setIsUpdating(false);
                setShowCompleteConfirm(false);
                return;
            }

            // Use batch update to ensure all items are updated before auto-complete check
            const itemIds = itemsWithReviewers.map(item => item.id);
            await updateMultipleItemStatuses(request.id, itemIds, 'Complete', user.email || 'Reviewer');

            // Do NOT change global ticket status - only item statuses are updated
            const message = `Peer Reviewer approved ${itemsWithReviewers.length} item(s) and marked them as COMPLETE.`;

            await sendMessage(request.id, user.id, message, false, undefined, 'reviewer', user.email || 'Reviewer');
            const updated = await getRequestById(id, user.id, role || 'reviewer');
            setRequest(updated);
            setShowCompleteConfirm(false);
            alert(`${itemsWithReviewers.length} item(s) marked as Complete.`);
            router.push("/reviewer");
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function initiateClientMessage() {
        if ((!clientMessage.trim() && !clientAttachment) || !user || !request) return;
        setShowConfirm(true);
    }

    async function confirmSendMessage() {
        if ((!clientMessage.trim() && !clientAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, clientMessage, false, clientAttachment || undefined, 'reviewer', user.email || 'Reviewer');
            setClientMessage("");
            setClientAttachment(null);
            setShowConfirm(false);
            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
            alert("Message sent to client");
        } catch (err: any) {
            alert("Error sending message: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendInternalNote() {
        if ((!internalNote.trim() && !internalAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, internalNote, true, internalAttachment || undefined, 'reviewer', user.email || 'Reviewer');
            setInternalNote("");
            setInternalAttachment(null);
            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
            alert("Internal note saved");
        } catch (err: any) {
            alert("Error saving note: " + err.message);
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
            <div className="flex items-center justify-between gap-4">
                <div className="flex-shrink-0">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                        <span className="text-yellow-600">Review Board:</span> {request.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Timeline - Centered */}
                <div className="flex-1 max-w-xl">
                    <RequestTimeline request={request} />
                </div>

                <div className="text-right flex-shrink-0">
                    <StatusBadge status={request.status} />
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
                                                {isMe && <span className="font-bold mr-1">Me</span>}
                                                {/* Actually 'Me' is handled by avatar/bubble position mostly */}
                                                {/* Revert explicit 'Me' text to avoid clutter if we have avatar */}
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

                            {activeTab === 'client' ? (
                                <div className="space-y-4">
                                    <div className="flex justify-start px-1">
                                        <select
                                            onChange={(e) => {
                                                const template = RESPONSE_TEMPLATES.find(t => t.label === e.target.value);
                                                if (template) setClientMessage(prev => prev + (prev ? "\n\n" : "") + template.text);
                                                e.target.value = "";
                                            }}
                                            className="text-[10px] font-bold uppercase py-1 px-3 bg-slate-100 border-none rounded-lg text-slate-500 hover:bg-slate-200 transition-all cursor-pointer outline-none"
                                        >
                                            <option value="">Insert Template...</option>
                                            {RESPONSE_TEMPLATES.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                                        </select>
                                    </div>
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
                                                    onClick={initiateClientMessage}
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
                    <div className="bg-white p-5 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />

                        <div className="flex items-center gap-2 mb-5">
                            <div className="p-2 bg-slate-100/80 rounded-lg text-slate-500">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Final Decision</h3>
                        </div>

                        <div className="space-y-3">
                            {/* Request Changes */}
                            <button
                                onClick={() => handleReviewAction('request_changes')}
                                disabled={isUpdating}
                                className="w-full group/btn relative overflow-hidden bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 rounded-xl p-4 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Needs Work</span>
                                        <span className="text-xs font-bold text-slate-700">Request Changes</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-slate-800 group-hover/btn:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    </div>
                                </div>
                            </button>

                            {/* Submit to Client */}
                            <button
                                onClick={() => setShowCompleteConfirm(true)}
                                disabled={isUpdating}
                                className="w-full group/btn relative overflow-hidden bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Approved</span>
                                        <span className="text-xs font-bold">Submit to Client</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-400/50 flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b pb-3 gap-3">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Item Details & Actions</h3>
                            <div className="relative flex-1 max-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search Items..."
                                    value={itemSearchQuery}
                                    onChange={(e) => setItemSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {request.items?.filter(item =>
                                item.description.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
                                item.item_number.toString().includes(itemSearchQuery)
                            ).map(item => (
                                <TicketItemCard key={item.id} item={item}>
                                    <div className="pt-3 border-t border-slate-200">
                                        <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="w-3 h-3 text-slate-400" />
                                                <p className="text-[10px] font-bold text-slate-600 truncate flex-1">
                                                    <span className="text-slate-400 mr-1">Page:</span>
                                                    <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 underline">
                                                        {item.page_url}
                                                    </a>
                                                </p>
                                            </div>

                                            {/* Category specific details */}
                                            {item.categories?.includes('Text') && (
                                                <div className="space-y-2 text-[10px]">
                                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                                        <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Original Text</span>
                                                        <p className="text-slate-700 italic">{item.details?.original_text || "N/A"}</p>
                                                    </div>
                                                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                                                        <span className="text-[8px] font-black uppercase text-yellow-600 block mb-1">Updated Text</span>
                                                        <p className="text-slate-900 font-bold">{item.details?.updated_text || "N/A"}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {item.categories?.includes('Image') && (
                                                <div className="flex gap-2 text-[10px]">
                                                    <div className="flex-1 p-2 bg-white rounded-lg border border-slate-100">
                                                        <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Old Reference</span>
                                                        <p className="text-slate-700">{item.details?.old_image_ref || "N/A"}</p>
                                                    </div>
                                                    {item.details?.new_image && (
                                                        <div className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden">
                                                            <img src={item.details.new_image.url} alt="New" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Existing Peer Review section */}
                                    <div className="pt-3 border-t border-slate-200">
                                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-2 flex items-center gap-1">
                                            <ShieldCheck className="w-2.5 h-2.5" />
                                            Peer Review Status
                                        </label>
                                        <div className="space-y-2">
                                            {item.peer_reviewers?.map(pr => (
                                                <div key={pr.user_id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-600">{pr.email.split('@')[0]}</span>
                                                    {pr.user_id === user?.id ? (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={async () => {
                                                                    await submitPeerReviewDecision(request.id, item.id, user.id, 'Yes');
                                                                    const updated = await getRequestById(id, user.id, 'reviewer');
                                                                    setRequest(updated);
                                                                }}
                                                                className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${pr.decision === 'Yes' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                                                            >
                                                                YES
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    await submitPeerReviewDecision(request.id, item.id, user.id, 'No');
                                                                    const updated = await getRequestById(id, user.id, 'reviewer');
                                                                    setRequest(updated);
                                                                }}
                                                                className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${pr.decision === 'No' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}`}
                                                            >
                                                                NO
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase ${pr.decision === 'Yes' ? 'bg-emerald-100 text-emerald-700' :
                                                            pr.decision === 'No' ? 'bg-rose-100 text-rose-700' :
                                                                'bg-slate-100 text-slate-400'
                                                            }`}>
                                                            {pr.decision || 'PENDING'}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {(!item.peer_reviewers || item.peer_reviewers.length === 0) && (
                                                <p className="text-[10px] text-slate-400 italic">No peer reviewers assigned yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </TicketItemCard>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* AUDIT LOG SECTION */}
            <section className="mt-8 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-100">
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
                                {visibleLogs.map((log: any) => (
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
            </section>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmSendMessage}
                title="MESSAGE CLIENT?"
                message="This message will be visible to the client immediately. Are you sure you want to send?"
                confirmText="YES, SEND"
            />

            {/* Confirmation Modal for Complete */}
            <ConfirmationModal
                isOpen={showCompleteConfirm}
                onClose={() => setShowCompleteConfirm(false)}
                onConfirm={confirmComplete}
                title="CONFIRM COMPLETION"
                message="Are you sure you want to mark this ticket as Completed? This declares all items finalized and notifies the client."
                confirmText="YES, COMPLETE"
            />
        </div>
    );
}
