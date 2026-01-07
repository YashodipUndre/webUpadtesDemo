"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage, Request, updateItemStatus, Attachment, submitPeerReviewDecision } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketItemCard } from "@/components/TicketItemCard";
import { useAuth } from "@/lib/auth-context";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Search } from "lucide-react";

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
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'client' | 'internal'>('internal');
    const [clientMessage, setClientMessage] = useState("");
    const [clientAttachment, setClientAttachment] = useState<Attachment | null>(null);
    const [internalNote, setInternalNote] = useState("");
    const [internalAttachment, setInternalAttachment] = useState<Attachment | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [itemSearchQuery, setItemSearchQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, 'reviewer');
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

    const handleDeveloperStatus = async (itemId: string, newStatus: string) => {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            await updateItemStatus(request.id, itemId, newStatus, user.email || 'Developer');
            await sendMessage(request.id, user.id, `Item #${request.items?.find(i => i.id === itemId)?.item_number} marked as ${newStatus}`, true, undefined, 'reviewer', user.email || 'Developer');

            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

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
            const newStatus = "Complete";
            await updateRequestStatus(request.id, newStatus, user.email || 'Reviewer');
            await sendMessage(request.id, user.id, `Reviewer marked ticket as COMPLETED.`, false, undefined, 'reviewer', user.email || 'Reviewer');
            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
            setShowCompleteConfirm(false);
            alert("Ticket marked as Complete");
            router.push("/reviewer");
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                        <span className="text-yellow-600">Review Board:</span> {request.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
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
                                        className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                {!isMe && (
                                                    <span className="text-[10px] font-bold text-yellow-600">
                                                        {m.profiles?.email.split('@')[0]}
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

                                            <span className="text-[9px] text-yellow-600 mt-1 px-1 select-none">
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
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
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                        <RichTextEditor
                                            value={clientMessage}
                                            onChange={setClientMessage}
                                            placeholder="Type a message to client..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setClientAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={() => setShowConfirm(true)}
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
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setInternalAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
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
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 text-sm uppercase tracking-wider">Overall Bundle Action</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleReviewAction('request_changes')}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 disabled:opacity-50 transition-all font-black shadow-sm active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Request Changes (Bundle)
                            </button>
                            <button
                                onClick={() => handleReviewAction('approve')}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-stone-900 rounded-2xl hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 transition-all font-black shadow-xl shadow-yellow-100 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Approve Bundle
                            </button>
                            <button
                                onClick={() => setShowCompleteConfirm(true)}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 disabled:opacity-50 transition-all font-black shadow-xl shadow-emerald-100 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Mark as Complete
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
                                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Peer Review Status</label>
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

                                    {item.reviewer_id === user?.id && (
                                        <div className="pt-3 border-t border-slate-200">
                                            <p className="text-[9px] font-black uppercase text-yellow-600 mb-2">Assigned Developer Actions</p>
                                            <div className="flex gap-2">
                                                {item.status !== 'In Progress' && item.status !== 'Peer Review' && item.status !== 'Complete' && (
                                                    <button
                                                        onClick={() => handleDeveloperStatus(item.id, 'In Progress')}
                                                        disabled={isUpdating}
                                                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm"
                                                    >
                                                        Start Work
                                                    </button>
                                                )}

                                                {item.status === 'In Progress' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDeveloperStatus(item.id, 'Peer Review')}
                                                            disabled={isUpdating}
                                                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm"
                                                        >
                                                            Request Peer Review
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeveloperStatus(item.id, 'Complete')}
                                                            disabled={isUpdating}
                                                            className="flex-1 py-2 bg-stone-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-sm"
                                                        >
                                                            Mark Complete
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => handleDeveloperStatus(item.id, 'Info Needed')}
                                                    disabled={isUpdating}
                                                    className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm"
                                                >
                                                    Blocked / Info Needed
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </TicketItemCard>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 text-yellow-600">
                            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Confirm Send</h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            This message will be visible to the <span className="font-bold text-slate-800">Client</span> and may trigger an email notification. Are you sure you want to proceed?
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                            >
                                Back to Edit
                            </button>
                            <button
                                onClick={sendMessageToClient}
                                className="flex-1 py-3 bg-yellow-400 text-stone-900 font-black rounded-2xl hover:bg-yellow-500 shadow-lg shadow-yellow-100 transition-all active:scale-95"
                            >
                                YES, SEND
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
