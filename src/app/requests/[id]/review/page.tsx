"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getRequestById, DYNAMIC_CATEGORIES, CategoryType } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { useBreadcrumb } from "@/lib/breadcrumb-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ArrowRight, FileText, Loader2 } from "lucide-react";

export default function ReviewRequestPage() {
    return (
        <ProtectedRoute allow={["client", "admin", "reviewer", "developer"]}>
            <ReviewRequestForm />
        </ProtectedRoute>
    );
}

interface RequestItemForm {
    categories: CategoryType[];
    dynamicValues: Record<string, string>;
    title?: string;
    description?: string;
}

function ReviewRequestForm() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const { setPageTitle } = useBreadcrumb();

    const [title, setTitle] = useState("");
    const [globalDescription, setGlobalDescription] = useState("");
    const [globalUrl, setGlobalUrl] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [items, setItems] = useState<RequestItemForm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id || !user) return;
            try {
                const data = await getRequestById(id, user.id, 'client'); // Using 'client' role to fetch mostly
                if (data) {
                    setTitle(data.title);
                    setPageTitle(data.title);
                    setGlobalDescription(data.description || "");
                    setGlobalUrl(data.page_url || "");
                    setUrgency(data.urgency);

                    // Map items back to form structure
                    if (data.items && Array.isArray(data.items)) {
                        const mappedItems: RequestItemForm[] = data.items.map((item: any) => ({
                            categories: item.categories || ["Text"], // Map categories
                            title: item.details?.item_title || item.title || "Untitled Item",
                            description: item.description || "",
                            dynamicValues: item.details || {}
                        }));
                        setItems(mappedItems);
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequest();
        fetchRequest();
        return () => setPageTitle("");
    }, [id, user, setPageTitle]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center shadow-sm">
                    <FileText className="w-5 h-5 text-slate-500" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Review Ticket Request</h1>
                    <p className="text-slate-500 font-medium tracking-tight italic text-xs">Review submitted details before proceeding</p>
                </div>
            </div>

            <Card className="rounded-lg shadow-xl border-white/40 bg-white/50 backdrop-blur-sm overflow-hidden select-none grayscale-[0.05]">
                <CardContent className="p-6 md:p-8 space-y-6">
                    {/* Global Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 pointer-events-none">
                        <div className="space-y-4 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global Ticket Title</label>
                                    <Input
                                        value={title}
                                        readOnly
                                        className="h-12 border-white rounded-md font-bold text-sm text-slate-700 !bg-slate-50/50"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Urgency Level</label>
                                    <div className={`h-12 px-3 flex items-center rounded-md font-black text-sm border border-transparent ${urgency === "Urgent" ? "bg-slate-900 text-white" : "bg-slate-50/50 text-slate-700"}`}>
                                        {urgency}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global URL</label>
                                <Input
                                    value={globalUrl}
                                    readOnly
                                    className="h-12 border-white rounded-md font-bold text-sm text-slate-700 !bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global Description</label>
                                <Textarea
                                    value={globalDescription}
                                    readOnly
                                    className="min-h-[80px] border-white rounded-md font-bold text-sm text-slate-700 !bg-slate-50/50 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Request Items</h3>
                            <div className="h-px bg-slate-100 flex-1" />
                        </div>
                        <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            {items.map((item, index) => {
                                // Aggregate fields from all selected categories
                                const allFields = item.categories.flatMap(catId =>
                                    DYNAMIC_CATEGORIES.find(c => c.id === catId)?.fields || []
                                );
                                const uniqueFields = Array.from(new Map(allFields.map(f => [f.id, f])).values());

                                return (
                                    <div key={index} className="relative space-y-4 pt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 bg-slate-200 text-slate-600 rounded flex items-center justify-center font-black text-[10px]">{index + 1}</span>
                                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Item Specification</h3>
                                            </div>
                                        </div>

                                        {/* Item Title Input */}
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Item Title</label>
                                            <Input
                                                value={item.title || ""}
                                                readOnly
                                                className="h-12 border-white rounded-md font-bold text-sm text-slate-700 !bg-slate-50/50 shadow-sm"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Description</label>
                                            <Textarea
                                                value={item.description || ""}
                                                readOnly
                                                className="min-h-[80px] border-white rounded-md font-bold text-sm text-slate-700 !bg-slate-50/50 resize-none"
                                            />
                                        </div>

                                        {/* Category Tabs (Display Only) */}
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Categories</label>
                                            <div className="flex flex-wrap gap-2">
                                                {DYNAMIC_CATEGORIES.filter(c => c.enabled).map(c => {
                                                    const isSelected = item.categories.includes(c.id);
                                                    return isSelected ? (
                                                        <div
                                                            key={c.id}
                                                            className="px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 bg-yellow-100 text-yellow-700 border-yellow-200 opacity-80"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            {c.label}
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>

                                        {/* Fields Container - Grouped by Category */}
                                        <div className="space-y-4">
                                            {item.categories.map(catId => {
                                                const category = DYNAMIC_CATEGORIES.find(c => c.id === catId);
                                                const categoryFields = (category?.fields || []).filter(f => f.id !== 'page_url');

                                                if (categoryFields.length === 0) return null;

                                                return (
                                                    <div key={catId} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                        {/* Category Header */}
                                                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                                                            <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-stone-900" />
                                                            </div>
                                                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">{category?.label}</h4>
                                                        </div>

                                                        {/* Category Fields */}
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {categoryFields.map((field) => (
                                                                <div key={field.id} className="space-y-1.5">
                                                                    <div className="flex justify-between items-baseline">
                                                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                                                                            {field.label}
                                                                        </label>
                                                                    </div>

                                                                    {field.type === 'textarea' ? (
                                                                        <Textarea
                                                                            value={item.dynamicValues[field.id] || ""}
                                                                            readOnly
                                                                            className="min-h-[100px] border-white rounded-md font-bold text-sm text-slate-700 !bg-white/50 resize-none"
                                                                        />
                                                                    ) : (
                                                                        <Input
                                                                            value={item.dynamicValues[field.id] || ""}
                                                                            readOnly
                                                                            className="h-12 border-white rounded-md font-bold text-sm text-slate-700 !bg-white/50"
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions - Outside the read-only card */}
            <div className="pt-2 flex flex-col md:flex-row gap-3">
                <Button
                    onClick={() => router.push(`/requests/${id}`)}
                    className="flex-1 h-12 bg-yellow-400 text-stone-900 font-black rounded-md hover:bg-yellow-500 shadow-lg shadow-yellow-100 text-sm"
                >
                    Proceed to Ticket Info
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
