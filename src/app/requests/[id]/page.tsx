"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, updateRequestStatus, sendMessage as sendSupabaseMessage, Request, RequestItem, Attachment, fileToBase64, DYNAMIC_CATEGORIES } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth-context";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useBreadcrumb } from "@/lib/breadcrumb-context";

import { RequestTimeline } from "@/components/RequestTimeline";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Client Item Row with Popup Modal
function ClientItemRow({ item }: { item: RequestItem }) {
    const title = item.details?.item_title || item.description || `Item #${item.item_number}`;
    const defaultTab = item.categories?.[0];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer text-left hover:border-yellow-400 hover:shadow-sm transition-all group h-auto"
                >
                    <span className="w-8 h-8 rounded-lg bg-yellow-400 text-stone-900 flex items-center justify-center font-black text-[10px] flex-shrink-0 group-hover:scale-105 transition-transform">
                        {item.item_number}
                    </span>
                    <span className="text-sm font-bold text-slate-700 truncate flex-1 group-hover:text-slate-900">
                        {title}
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl p-0 gap-0 max-h-[85vh] flex flex-col overflow-hidden sm:rounded-2xl">
                <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50 flex-row items-center justify-between space-y-0 text-left">
                    <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-yellow-400 text-stone-900 flex items-center justify-center font-black text-xs shadow-sm">
                            {item.item_number}
                        </span>
                        <div>
                            <DialogTitle className="text-sm font-black text-slate-800">{title}</DialogTitle>
                            <DialogDescription className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Item Details</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col overflow-hidden">
                    {item.categories && item.categories.length > 0 && (
                        <div className="px-4 border-b border-slate-100 bg-white shrink-0">
                            <TabsList className="bg-transparent p-0 h-auto gap-2 justify-start w-full overflow-x-auto py-3 no-scrollbar">
                                {item.categories.map(cat => (
                                    <TabsTrigger
                                        key={cat}
                                        value={cat}
                                        className="flex-shrink-0 px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider border border-slate-200 bg-white text-slate-500 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:border-slate-800 data-[state=active]:shadow-md transition-all hover:text-slate-700 hover:border-slate-300"
                                    >
                                        {cat}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    )}

                    <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-4">
                            {/* Description */}
                            {item.description && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Description</h4>
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {item.description}
                                    </p>
                                </div>
                            )}

                            {/* Page URL */}
                            {item.page_url && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Page Location</h4>
                                    <a
                                        href={item.page_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-xs font-bold text-yellow-700 hover:bg-yellow-100 transition-colors"
                                    >
                                        <span className="truncate">{item.page_url}</span>
                                        <svg className="w-3 h-3 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            )}

                            {/* Category-specific fields */}
                            {item.categories?.map(cat => (
                                <TabsContent key={cat} value={cat} className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                        {Object.entries(item.details || {}).map(([key, val]) => {
                                            if (!val || key === 'page_url' || key === 'description' || key === 'item_title') return null;

                                            // Filter by selected category (current tab)
                                            const config = DYNAMIC_CATEGORIES.find(c => c.id === cat);
                                            const allowedFields = config?.fields.map(f => f.id) || [];
                                            if (!allowedFields.includes(key)) return null;

                                            const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                            const fieldDef = config?.fields.find(f => f.id === key);
                                            const isFileOrImage = fieldDef?.type === 'file' || fieldDef?.type === 'image' || (typeof val === 'string' && val.startsWith('data:'));
                                            const isUrl = typeof val === 'string' && (val.startsWith('http') || val.includes('.com'));

                                            return (
                                                <div key={key}>
                                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">{label}</h4>
                                                    {isFileOrImage ? (
                                                        <a
                                                            href={val as string}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={fieldDef?.type === 'file' ? "attachment" : undefined}
                                                            className="flex items-center gap-2 p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors group/link w-full max-w-sm"
                                                        >
                                                            <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 text-slate-500 flex-shrink-0">
                                                                {fieldDef?.type === 'image' ? (
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                ) : (
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-xs font-bold text-slate-700 group-hover/link:text-slate-900 group-hover/link:underline truncate">
                                                                    {/* Try to get filename from value if it looks like one, otherwise default */}
                                                                    {typeof val === 'string' && !val.startsWith('data:')
                                                                        ? val.split('/').pop()
                                                                        : (fieldDef?.type === 'image' ? 'View Image Attachment' : 'Download Document')}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-medium">Click to open</span>
                                                            </div>
                                                        </a>
                                                    ) : isUrl ? (
                                                        <a href={val as string} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline truncate">
                                                            <span className="truncate">{val as string}</span>
                                                        </a>
                                                    ) : (
                                                        <p className="text-xs text-slate-700 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                            {val as string}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

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
    const { setPageTitle } = useBreadcrumb();
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
                    // Set the breadcrumb title to the ticket title
                    if (data?.title) {
                        setPageTitle(data.title);
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (id) fetchRequest();
        }, 2000);
        return () => {
            clearTimeout(timer);
            // Clear the page title when leaving the page
            setPageTitle("");
        };
    }, [id, setPageTitle]);

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

    const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
    const [reopenReason, setReopenReason] = useState("");
    const [reopenAttachment, setReopenAttachment] = useState<File | null>(null);

    async function handleReopenConfirm() {
        if (!request || !user) return;
        if (!reopenReason.trim()) {
            alert("Please provide a reason for reopening.");
            return;
        }

        setIsSending(true);
        try {
            await updateRequestStatus(request.id, "Reopened", user.email || 'Client');

            // Note: sendSupabaseMessage expects attachment object structure. 
            // Based on usage in sendReply: setAttachment({ name: file.name, url, type: file.type }); 
            // sendSupabaseMessage(..., attachment || undefined, ...)
            // Let's match that structure.

            let attachmentObj = undefined;
            if (reopenAttachment) {
                const url = await fileToBase64(reopenAttachment);
                attachmentObj = { name: reopenAttachment.name, url, type: reopenAttachment.type };
            }

            await sendSupabaseMessage(request.id, user.id, `Reopened: ${reopenReason}`, false, attachmentObj, 'client', user.email || 'Client');

            const updated = await getRequestById(id, user.id, 'client');
            setRequest(updated);
            setIsReopenModalOpen(false);
            setReopenReason("");
            setReopenAttachment(null);
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
                <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={request.status === 'Peer Review' ? 'In Progress' : request.status} />
                    {request.urgency === "Urgent" && (
                        <div className="text-red-600 font-semibold text-sm">Marked Urgent</div>
                    )}
                    {request.status === "Complete" && (
                        <Button
                            onClick={() => setIsReopenModalOpen(true)}
                            disabled={isSending}
                            className="bg-yellow-400 text-stone-900 hover:bg-yellow-500 font-black uppercase tracking-wider text-xs"
                            size="sm"
                        >
                            Reopen Ticket
                        </Button>
                    )}
                </div>
            </div>

            <div className="py-2 px-1">
                <RequestTimeline request={request} />
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-[700px] flex flex-col overflow-hidden border-slate-200 shadow-sm">
                        {/* Chat Header */}
                        <CardHeader className="p-4 border-b border-slate-100 bg-white flex-row items-center gap-3 space-y-0">
                            <Avatar className="h-10 w-10 border border-slate-200">
                                <AvatarFallback className="bg-slate-100 text-slate-500">ST</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Support Team</h3>
                                <p className="text-xs text-slate-500">Typically replies within 1 hour</p>
                            </div>
                        </CardHeader>

                        {/* Chat Messages Area */}
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
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
                                                    <Avatar className="h-8 w-8 mt-1 border border-slate-200 shadow-sm">
                                                        <AvatarFallback className="text-[10px] font-black text-slate-500 bg-white">
                                                            {m.profiles?.email?.substring(0, 2).toUpperCase() || "ST"}
                                                        </AvatarFallback>
                                                    </Avatar>
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
                                                    <Avatar className="h-8 w-8 mt-1 border border-yellow-200 bg-yellow-100 shadow-sm">
                                                        <AvatarFallback className="text-[10px] font-black text-yellow-500 bg-transparent">ME</AvatarFallback>
                                                    </Avatar>
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
                        </CardContent>

                        <div className="bg-white p-4 border-t border-slate-200">
                            {attachment && (
                                <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-yellow-900 truncate max-w-[200px]">{attachment.name}</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setAttachment(null)}
                                        className="h-6 w-6 hover:bg-yellow-200 text-yellow-600 rounded-full"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </Button>
                                </div>
                            )}
                            <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden border border-slate-200">
                                <RichTextEditor
                                    value={reply}
                                    onChange={setReply}
                                    placeholder="Type a message..."
                                    className="min-h-[80px] border-0 focus-visible:ring-0"
                                    leadingActions={
                                        <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await fileToBase64(file); setAttachment({ name: file.name, url, type: file.type }); } }} />
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </label>
                                    }
                                    trailingActions={
                                        <Button
                                            onClick={sendReply}
                                            disabled={isSending || (!reply.trim() && !attachment)}
                                            className="bg-yellow-400 text-stone-900 hover:bg-yellow-500 font-black uppercase tracking-wider text-xs gap-2"
                                            size="sm"
                                        >
                                            {isSending ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                <>
                                                    SEND
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                </>
                                            )}
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <aside className="space-y-4">
                    <Card className="border-slate-100 shadow">
                        <CardHeader className="p-4 border-b border-slate-100 pb-3">
                            <CardTitle className="font-bold text-sm uppercase tracking-wider text-slate-800">
                                Ticket Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {request.items?.map(item => (
                                <ClientItemRow key={item.id} item={item} />
                            ))}
                        </CardContent>
                    </Card>
                </aside>
            </section>

            {/* Reopen Modal */}
            <Dialog open={isReopenModalOpen} onOpenChange={setIsReopenModalOpen}>
                <DialogContent className="max-w-lg p-6 sm:rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-800">Reopen Ticket</DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Please describe why you are reopening this ticket.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason <span className="text-red-500">*</span></label>
                            <Textarea
                                value={reopenReason}
                                onChange={(e) => setReopenReason(e.target.value)}
                                className="min-h-[100px] bg-slate-50"
                                placeholder="Explain the issue..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Attachment (Optional)</label>
                            <Input
                                type="file"
                                onChange={(e) => setReopenAttachment(e.target.files?.[0] || null)}
                                className="w-full text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer bg-slate-50"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsReopenModalOpen(false)}
                            className="font-bold text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReopenConfirm}
                            disabled={isSending || !reopenReason.trim()}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-md shadow-red-200"
                        >
                            {isSending ? 'Reopening...' : 'Confirm Reopen'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

