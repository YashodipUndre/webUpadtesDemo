"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage, Request, updateItemStatus, Attachment, ITEM_STATUSES, updateItemEffortAndDate, fileToBase64, getReviewers, assignItem } from "@/lib/data";
import { RequestTimeline } from "@/components/RequestTimeline";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketItemCard } from "@/components/TicketItemCard";
import { useAuth } from "@/lib/auth-context";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Search, Clock, Link as LinkIcon } from "lucide-react";

export default function DeveloperRequestDetailPage() {
    return (
        <ProtectedRoute allow={["developer"]}>
            <DeveloperRequestDetail />
        </ProtectedRoute>
    );
}

function DeveloperRequestDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user, role } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [internalNote, setInternalNote] = useState("");
    const [internalAttachment, setInternalAttachment] = useState<Attachment | null>(null);
    const [reviewers, setReviewers] = useState<{ id: string, email: string }[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [itemSearchQuery, setItemSearchQuery] = useState("");
    const [showAllAudit, setShowAllAudit] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, role || 'developer');
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

    const handleDeveloperStatus = async (itemId: string, newStatus: string) => {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            await updateItemStatus(request.id, itemId, newStatus, user.email || 'Developer');
            // Notify context
            await sendMessage(request.id, user.id, `Item #${request.items?.find(i => i.id === itemId)?.item_number} status: ${newStatus}`, true, undefined, 'developer', user.email || 'Developer');
            const updated = await getRequestById(id, user.id, 'developer');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReassignment = async (itemId: string, newReviewerId: string | null) => {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            // Find reviewer name for the message
            const newDev = reviewers.find(r => r.id === newReviewerId);
            const devName = newDev ? newDev.email : "Unassigned";

            await assignItem(request.id, itemId, newReviewerId, user.email || 'Developer');
            // Notify context
            await sendMessage(request.id, user.id, `Reassigned Item #${request.items?.find(i => i.id === itemId)?.item_number} to ${devName}`, true, undefined, 'developer', user.email || 'Developer');

            const updated = await getRequestById(id, user.id, 'developer');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleItemEffortDate = async (itemId: string, effort: number, dueDate: string | null) => {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            await updateItemEffortAndDate(request.id, itemId, effort, dueDate, user.email || 'Developer');
            const updated = await getRequestById(id, user.id, 'developer');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    async function confirmComplete(isUrgent: boolean = false) {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            // Urgent submission bypasses normal peer review flow or forces a complete status
            const newStatus = "Complete";
            await updateRequestStatus(request.id, newStatus, user.email || 'Developer');

            const message = isUrgent
                ? "Developer marked ticket as COMPLETED (URGENT - Bypass). Peer Review required post-deployment."
                : "Developer marked ticket as COMPLETED.";

            await sendMessage(request.id, user.id, message, false, undefined, 'developer', user.email || 'Developer');

            const updated = await getRequestById(id, user.id, 'developer');
            setRequest(updated);
            setShowCompleteConfirm(false);
            alert("Ticket marked as Complete (Urgent/Direct)");
            router.push("/developer");
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
            await sendMessage(request.id, user.id, internalNote, true, internalAttachment || undefined, 'developer', user.email || 'Developer');
            setInternalNote("");
            setInternalAttachment(null);
            const updated = await getRequestById(id, user.id, 'developer');
            setRequest(updated);
            alert("Internal note saved");
        } catch (err: any) {
            alert("Error saving note: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    // Button removed as per user request (replaced by item-level status)

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
                        <span className="text-yellow-600">Dev Workspace:</span> {request.title}
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
                            <h3 className="font-bold text-slate-800 text-sm">Project Communication</h3>
                            <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${request.status === 'Complete' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                {request.status}
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {request.messages?.map((m) => {
                                const isMe = m.user_id === user?.id;
                                const isInternal = m.is_internal;

                                return (
                                    <div key={m.id} className={`flex w-full gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
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
                                            <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${isInternal ? "bg-amber-50 text-slate-800 border-amber-200" : isMe ? "bg-white text-stone-900 border-slate-200 rounded-tr-sm" : "bg-white text-slate-700 border-slate-200 rounded-tl-sm"}`}>
                                                <div className="leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: m.text }} />
                                                {m.attachments?.map((att, idx) => (
                                                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline text-xs">{att.name}</a>
                                                ))}
                                            </div>
                                            <span className="text-[9px] text-slate-400 mt-1 px-1 select-none">
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area (Strictly Internal for Developers usually, unless responding to reviewer) */}
                        <div className="p-4 border-t border-slate-200 bg-white">
                            <div className="space-y-3">
                                {internalAttachment && (
                                    <div className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-lg mx-1 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-amber-900 truncate max-w-[200px]">{internalAttachment.name}</span>
                                        </div>
                                        <button onClick={() => setInternalAttachment(null)} className="p-1 hover:bg-amber-200 rounded-full text-amber-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                )}
                                <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                    <RichTextEditor
                                        value={internalNote}
                                        onChange={setInternalNote}
                                        placeholder="Add note or update..."
                                        className="min-h-[80px]"
                                        leadingActions={
                                            <label className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer transition-all" title="Attach">
                                                <input type="file" className="hidden" accept="image/*,.pdf" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await fileToBase64(file); setInternalAttachment({ name: file.name, url, type: file.type }); } }} />
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                            </label>
                                        }
                                        trailingActions={
                                            <button
                                                onClick={sendInternalNote}
                                                disabled={isUpdating || (!internalNote.trim() && !internalAttachment)}
                                                className="px-4 py-2 bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:bg-amber-100 disabled:text-amber-300 transition-all shadow-md active:scale-95 flex items-center gap-2"
                                            >
                                                {isUpdating ? <div className="w-4 h-4 rounded-full border-2 border-stone-900/30 border-t-stone-900 animate-spin" /> : "POST UPDATE"}
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="space-y-4">
                    {/* Super Urgent Button only */}
                    <div className="bg-white p-5 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><Clock className="w-4 h-4" /></div>
                            <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Urgent Actions</h3>
                        </div>
                        <button
                            onClick={() => confirmComplete(true)} // Urgent skip
                            disabled={isUpdating}
                            className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl p-3 transition-all duration-300 shadow-md shadow-rose-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-full animate-pulse">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Super Urgent Submission</span>
                            </div>
                        </button>
                        <p className="text-[10px] text-slate-400 mt-2 text-center">Bypasses standard Peer Review. Use only for critical hotfixes.</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Assigned Items</h3>
                        <div className="space-y-4">
                            {request.items?.filter(item =>
                                item.description.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
                                item.item_number.toString().includes(itemSearchQuery)
                            ).map(item => (
                                <TicketItemCard key={item.id} item={item}>
                                    <div className="pt-3 border-t border-slate-200 space-y-3">
                                        {/* Status Dropdown + Mark Done */}
                                        <div className="group/field">
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5">Status</label>
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleDeveloperStatus(item.id, e.target.value)}
                                                disabled={isUpdating}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 outline-none"
                                            >
                                                <option value="New">Not Started</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Peer Review">Peer Review</option>
                                                <option value="Complete">Completed</option>
                                            </select>
                                            <button
                                                onClick={() => handleDeveloperStatus(item.id, 'Peer Review')}
                                                disabled={isUpdating || item.status === 'Peer Review' || item.status === 'Complete'}
                                                className="w-full mt-2 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                Mark Done
                                            </button>
                                        </div>
                                        {/* Assigned Developer Dropdown (Yellow Theme) */}
                                        <div className="group/field">
                                            <label className="text-[9px] font-black uppercase text-yellow-600 block mb-1.5 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                Assigned Developer
                                            </label>
                                            <select
                                                value={item.reviewer_id || ""}
                                                onChange={(e) => handleReassignment(item.id, e.target.value || null)}
                                                disabled={isUpdating}
                                                className="w-full px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-xl text-[11px] font-bold text-yellow-900 outline-none focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-50 transition-all cursor-pointer hover:bg-yellow-100/50"
                                            >
                                                <option value="">Unassigned</option>
                                                {reviewers.filter(r => (r as any).role === 'developer').map(rev => (
                                                    <option key={rev.id} value={rev.id}>
                                                        {rev.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="group/field">
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5">Effort (Hrs)</label>
                                                <input
                                                    type="number"
                                                    value={item.estimated_effort}
                                                    onChange={(e) => handleItemEffortDate(item.id, parseInt(e.target.value) || 0, item.due_date)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold"
                                                />
                                            </div>
                                            <div className="group/field">
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1.5">Due Date</label>
                                                <input
                                                    type="date"
                                                    value={item.due_date || ""}
                                                    onChange={(e) => handleItemEffortDate(item.id, item.estimated_effort, e.target.value || null)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold"
                                                />
                                            </div>
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

            {/* Confirmation Modal for Complete */}
            <ConfirmationModal
                isOpen={showCompleteConfirm}
                onClose={() => setShowCompleteConfirm(false)}
                onConfirm={confirmComplete}
                title="CONFIRM URGENT SUBMISSION"
                message="Are you sure you want to mark this ticket as Completed (URGENT)? This bypasses normal review."
                confirmText="YES, SUBMIT"
            />
        </div>
    );
}
