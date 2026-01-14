"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Plus, ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SavedReply {
    id: string;
    title: string;
    type: "client" | "internal";
    content: string;
}

const DEFAULT_REPLIES: SavedReply[] = [
    {
        id: "1",
        title: "Ack – we're on it",
        type: "client",
        content: `Hi [Name],

Thanks for your website update request – we've received it and our team will review it shortly.

If you have any extra screenshots, files or details that might help, you can add them directly to this ticket in the Web Update Portal.`
    },
    {
        id: "2",
        title: "Ask for more info",
        type: "client",
        content: `Hi [Name],

Thanks for sending this in.

To help us complete this quickly, could you please confirm:
• The exact page URL(s) we should update
• The specific text or content to change
• Any screenshots or reference images`
    },
    {
        id: "3",
        title: "File too large – compression",
        type: "client",
        content: `Hi [Name],

Thanks for sending on the file. It looks like the file size is a bit too large for upload.

Could you please compress it and upload the smaller version via the Web Update Portal?

For PDFs, you can use: smallpdf.com
For images, you can use: tinypng.com`
    },
    {
        id: "4",
        title: "Update complete",
        type: "client",
        content: `Hi [Name],

Great news! Your requested update has been completed and is now live on the website.

Please take a moment to check everything looks correct. If you spot any issues, just reply to this ticket and we'll fix it right away.`
    },
    {
        id: "5",
        title: "Internal – Needs review",
        type: "internal",
        content: `This ticket needs a second review before going live.

Please check:
• All text changes are accurate
• Images are properly sized
• Links are working correctly`
    }
];

export default function SettingsPage() {
    return (
        <ProtectedRoute allow={["admin", "reviewer"]}>
            <SettingsContent />
        </ProtectedRoute>
    );
}

function SettingsContent() {
    const [replies, setReplies] = useState<SavedReply[]>(DEFAULT_REPLIES);
    const [filter, setFilter] = useState<"all" | "client" | "internal">("all");
    const [showAll, setShowAll] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newReply, setNewReply] = useState<Omit<SavedReply, "id">>({
        title: "",
        type: "client",
        content: ""
    });

    const filteredReplies = replies.filter(r => filter === "all" || r.type === filter);
    const visibleReplies = showAll ? filteredReplies : filteredReplies.slice(0, 3);

    const handleAddReply = () => {
        if (!newReply.title.trim() || !newReply.content.trim()) return;
        const id = `reply-${Date.now()}`;
        setReplies([...replies, { ...newReply, id }]);
        setNewReply({ title: "", type: "client", content: "" });
        setIsAddingNew(false);
    };

    const handleDelete = (id: string) => {
        setReplies(replies.filter(r => r.id !== id));
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newReplies = [...replies];
        [newReplies[index - 1], newReplies[index]] = [newReplies[index], newReplies[index - 1]];
        setReplies(newReplies);
    };

    const handleMoveDown = (index: number) => {
        if (index === replies.length - 1) return;
        const newReplies = [...replies];
        [newReplies[index], newReplies[index + 1]] = [newReplies[index + 1], newReplies[index]];
        setReplies(newReplies);
    };

    const handleSaveEdit = (id: string, updates: Partial<SavedReply>) => {
        setReplies(replies.map(r => r.id === id ? { ...r, ...updates } : r));
        setEditingId(null);
    };

    return (
        <div className="space-y-8 pb-8 max-w-5xl">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Settings</h1>
                    <p className="text-slate-500 font-medium text-sm max-w-lg">
                        Manage saved replies and internal macros used in the admin conversation.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddingNew(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-stone-900 rounded-xl transition-all shadow-lg shadow-yellow-200 font-bold text-sm active:scale-95 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Add saved reply
                </Button>
            </header>

            {/* Add New Reply Modal */}
            {isAddingNew && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl mx-4 p-6 space-y-5 animate-in zoom-in-95">
                        <h3 className="text-lg font-black text-slate-900">Add New Saved Reply</h3>

                        <div className="space-y-4">
                            <div>
                                <Label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Title</Label>
                                <Input
                                    type="text"
                                    value={newReply.title}
                                    onChange={(e) => setNewReply({ ...newReply, title: e.target.value })}
                                    placeholder="e.g., Ack – we're on it"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <Label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Type</Label>
                                <Select
                                    value={newReply.type}
                                    onValueChange={(value) => setNewReply({ ...newReply, type: value as "client" | "internal" })}
                                >
                                    <SelectTrigger className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="client">Client reply</SelectItem>
                                        <SelectItem value="internal">Internal note</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-widest">Message text</Label>
                                <Textarea
                                    value={newReply.content}
                                    onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                                    placeholder="Enter the reply template..."
                                    rows={6}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => { setIsAddingNew(false); setNewReply({ title: "", type: "client", content: "" }); }}
                                className="px-5 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddReply}
                                disabled={!newReply.title.trim() || !newReply.content.trim()}
                                className="px-5 py-2 bg-yellow-400 text-stone-900 rounded-xl text-sm font-bold hover:bg-yellow-500 transition-all shadow-md shadow-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Reply
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Saved Replies Section */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-800">Saved replies</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">Filter:</span>
                        <Select
                            value={filter}
                            onValueChange={(value) => setFilter(value as any)}
                        >
                            <SelectTrigger className="bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold px-3 py-1.5 text-slate-600 focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none cursor-pointer min-w-[150px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="client">Client replies</SelectItem>
                                <SelectItem value="internal">Internal notes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {visibleReplies.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-slate-400 font-medium">No saved replies found.</p>
                        </div>
                    ) : (
                        visibleReplies.map((reply, index) => {
                            const globalIndex = replies.findIndex(r => r.id === reply.id);
                            const isEditing = editingId === reply.id;

                            return (
                                <div key={reply.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {isEditing ? (
                                                    <Input
                                                        type="text"
                                                        defaultValue={reply.title}
                                                        onBlur={(e) => handleSaveEdit(reply.id, { title: e.target.value })}
                                                        className="text-base font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-400/20"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <h3 className="text-base font-bold text-slate-800">{reply.title}</h3>
                                                )}
                                                <Select
                                                    value={reply.type}
                                                    onValueChange={(value) => handleSaveEdit(reply.id, { type: value as "client" | "internal" })}
                                                    disabled={!isEditing}
                                                >
                                                    <SelectTrigger className={cn(
                                                        "h-7 w-auto text-xs font-bold px-3 py-1 rounded-lg border transition-all",
                                                        reply.type === "client" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-slate-100 text-slate-600 border-slate-200"
                                                    )}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="client">Client reply</SelectItem>
                                                        <SelectItem value="internal">Internal note</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-yellow-600 tracking-widest">Message text</Label>
                                                {isEditing ? (
                                                    <Textarea
                                                        defaultValue={reply.content}
                                                        onBlur={(e) => handleSaveEdit(reply.id, { content: e.target.value })}
                                                        rows={4}
                                                        className="w-full text-sm text-slate-600 font-medium leading-relaxed bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-yellow-400/20 resize-none"
                                                    />
                                                ) : (
                                                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line line-clamp-4">
                                                        {reply.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(reply.id)}
                                                className="px-3 py-1.5 h-auto bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200 hover:border-red-200"
                                            >
                                                Delete
                                            </Button>
                                        </div>

                                        {/* Reorder & Edit */}
                                        <div className="flex flex-col items-center gap-0.5 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleMoveUp(globalIndex)}
                                                disabled={globalIndex === 0}
                                                className="w-6 h-6 p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleMoveDown(globalIndex)}
                                                disabled={globalIndex === replies.length - 1}
                                                className="w-6 h-6 p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingId(isEditing ? null : reply.id)}
                                                className={`w-6 h-6 p-1 transition-colors ${isEditing ? 'text-yellow-600' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* View All Link */}
                {filteredReplies.length > 3 && (
                    <div className="px-6 py-4 border-t border-slate-100 text-center">
                        <Button
                            variant="ghost"
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors hover:bg-transparent"
                        >
                            {showAll ? `Show less` : `View all ${filteredReplies.length} replies`}
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
}
