"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { createRequest, DYNAMIC_CATEGORIES, CategoryType } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Loader2, Check } from "lucide-react";

export default function NewRequestPage() {
    return (
        <ProtectedRoute allow={["client"]}>
            <NewRequestForm />
        </ProtectedRoute>
    );
}

interface RequestItemForm {
    categories: CategoryType[];
    dynamicValues: Record<string, string>;
    title?: string;
    description?: string;
    pageUrl?: string;
}

function NewRequestForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [globalUrl, setGlobalUrl] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [items, setItems] = useState<RequestItemForm[]>([
        { categories: ["Text"], dynamicValues: {}, title: "", pageUrl: "" }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addItem = () => {
        const lastItem = items[items.length - 1];
        if (lastItem) {
            // Check fields from ALL selected categories
            let allMissing: any[] = [];
            lastItem.categories.forEach(cat => {
                const catFields = DYNAMIC_CATEGORIES.find(c => c.id === cat)?.fields || [];
                const missing = catFields.filter(f => f.required && !lastItem.dynamicValues[f.id]);
                if (missing.length > 0) allMissing = [...allMissing, ...missing];
            });

            if (allMissing.length > 0) {
                setError(`Please complete the current item before adding a new one. Missing: ${allMissing.map(f => f.label).join(", ")}`);
                return;
            }
        }
        setError(null);
        setItems([...items, { categories: ["Text"], dynamicValues: {}, title: "", pageUrl: "" }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, updates: Partial<RequestItemForm>) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };
        setItems(newItems);
    };



    const handleFieldChange = (itemIndex: number, fieldId: string, value: string) => {
        const item = items[itemIndex];
        const newDynamicValues = { ...item.dynamicValues, [fieldId]: value };
        updateItem(itemIndex, { dynamicValues: newDynamicValues });
    };

    async function submit() {
        if (!title.trim()) {
            setError("Global Ticket Title is required");
            return;
        }

        if (!globalUrl.trim()) {
            setError("Global URL is required");
            return;
        }

        // Validate all items
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // Check required fields from ALL selected categories
            let allMissing: any[] = [];
            item.categories.forEach(cat => {
                const catFields = DYNAMIC_CATEGORIES.find(c => c.id === cat)?.fields || [];
                const missing = catFields.filter(f => f.required && !item.dynamicValues[f.id]);
                if (missing.length > 0) allMissing = [...allMissing, ...missing];
            });

            if (!item.title?.trim()) {
                setError(`Item #${i + 1}: Item Title is required`);
                return;
            }

            if (allMissing.length > 0) {
                setError(`Item #${i + 1}: Please fill in required fields: ${allMissing.map(f => f.label).join(", ")}`);
                return;
            }
        }

        if (!user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formattedItems = items.map(it => ({
                categories: it.categories,
                description: it.description || "",
                pageUrl: it.pageUrl || globalUrl || "",
                details: { ...it.dynamicValues, item_title: it.title }
            }));

            await createRequest(title, description, globalUrl, urgency, user.id, formattedItems);
            router.push("/client");
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-6 px-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-yellow-400 rounded-md flex items-center justify-center shadow-lg shadow-yellow-100">
                    <Plus className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Multi-Item Request</h1>
                    <p className="text-slate-500 font-medium tracking-tight italic text-xs">Bundle multiple website updates into a single ticket</p>
                </div>
            </div>

            <Card className="rounded-lg shadow-xl border-white/40 bg-white/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="bg-slate-50 border border-slate-100 text-slate-600 p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* Global Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                        <div className="space-y-4 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global Ticket Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g., Seasonal Website Refresh"
                                        className="h-12 border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Urgency Level</label>
                                    <Select value={urgency} onValueChange={setUrgency}>
                                        <SelectTrigger className={`h-12 rounded-md font-black text-sm border-slate-200 ${urgency === "Urgent" ? "bg-slate-900 text-white border-slate-900" : "bg-white/80 text-slate-700"}`}>
                                            <SelectValue placeholder="Select urgency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                            <SelectItem value="Urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global URL <span className="text-yellow-600">*</span></label>
                                <Input
                                    value={globalUrl}
                                    onChange={(e) => setGlobalUrl(e.target.value)}
                                    placeholder="https://myschool.com"
                                    className="h-12 border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global Description (Optional)</label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide a general overview or context for this request..."
                                    className="min-h-[80px] border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-8">
                        {items.map((item, index) => {
                            // Aggregate fields from all selected categories, excluding page_url (now a common field)
                            const allFields = item.categories.flatMap(catId =>
                                DYNAMIC_CATEGORIES.find(c => c.id === catId)?.fields || []
                            ).filter(f => f.id !== 'page_url');
                            const uniqueFields = Array.from(new Map(allFields.map(f => [f.id, f])).values());

                            return (
                                <div key={index} className="relative space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 bg-stone-900 text-white rounded flex items-center justify-center font-black text-[10px]">#{index + 1}</span>
                                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Update Item Specification</h3>
                                        </div>
                                        {items.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-bold text-[10px] uppercase tracking-widest h-8 px-2 rounded-md"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    {/* Item Title Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Item Title</label>
                                        <Input
                                            value={item.title || ""}
                                            onChange={(e) => updateItem(index, { title: e.target.value })}
                                            placeholder={`Item #${index + 1} Title`}
                                            className="h-12 border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700 shadow-sm"
                                        />
                                    </div>

                                    {/* Page URL - Common field for all categories */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Page URL (Optional)</label>
                                        <Input
                                            value={item.pageUrl || ""}
                                            onChange={(e) => updateItem(index, { pageUrl: e.target.value })}
                                            placeholder="https://school.com/specific-page (leave empty to use global URL)"
                                            className="h-12 border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700 shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Description (Optional)</label>
                                        <Textarea
                                            value={item.description || ""}
                                            onChange={(e) => updateItem(index, { description: e.target.value })}
                                            placeholder="Add specific details about this item..."
                                            className="min-h-[80px] border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700 resize-none"
                                        />
                                    </div>

                                    {/* Category Tabs */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Update Categories</label>
                                        <div className="flex flex-wrap gap-2">
                                            {DYNAMIC_CATEGORIES.filter(c => c.enabled).map(c => {
                                                const isSelected = item.categories.includes(c.id);
                                                return (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => {
                                                            // Multi-select: toggle categories on/off
                                                            let newCats;
                                                            if (isSelected) {
                                                                newCats = item.categories.filter(cat => cat !== c.id);
                                                                if (newCats.length === 0) newCats = ["Text"]; // Fallback to at least one
                                                            } else {
                                                                newCats = [...item.categories, c.id];
                                                            }
                                                            updateItem(index, { categories: newCats as CategoryType[] });
                                                        }}
                                                        className={`px-3 py-2 rounded-md text-xs font-bold border transition-all flex items-center gap-2 ${isSelected
                                                            ? "bg-yellow-400 border-yellow-500 text-stone-900 shadow-sm"
                                                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="w-3 h-3" />}
                                                        {c.label}
                                                    </button>
                                                );
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
                                                                    {field.required && <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest">Required</span>}
                                                                </div>

                                                                {field.type === 'textarea' ? (
                                                                    <Textarea
                                                                        value={item.dynamicValues[field.id] || ""}
                                                                        onChange={(e) => handleFieldChange(index, field.id, e.target.value)}
                                                                        placeholder={field.placeholder || `Enter specific details...`}
                                                                        className="min-h-[100px] border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700"
                                                                    />
                                                                ) : field.type === 'file' || field.type === 'image' ? (
                                                                    <div className="relative group">
                                                                        <Input
                                                                            type="file"
                                                                            id={`${index}-${field.id}`}
                                                                            className="hidden"
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) handleFieldChange(index, field.id, file.name);
                                                                            }}
                                                                        />
                                                                        <label
                                                                            htmlFor={`${index}-${field.id}`}
                                                                            className="w-full flex items-center gap-4 p-4 bg-white border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-yellow-50 hover:border-yellow-400 transition-all shadow-sm"
                                                                        >
                                                                            <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                                                                                <Plus className="w-5 h-5 text-slate-400 group-hover:text-yellow-600" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-black text-slate-800">{item.dynamicValues[field.id] || `Upload ${field.label}`}</p>
                                                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Drag & Drop or Click to Select</p>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                ) : (
                                                                    <Input
                                                                        type={field.type}
                                                                        value={item.dynamicValues[field.id] || ""}
                                                                        onChange={(e) => handleFieldChange(index, field.id, e.target.value)}
                                                                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                                                        className="h-12 border-white rounded-md focus-visible:ring-yellow-400/20 focus-visible:border-yellow-400 font-bold text-sm text-slate-700 !bg-white !text-slate-700"
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

                    {/* Actions */}
                    <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={addItem}
                            className="flex-1 h-12 border-2 border-dashed border-slate-300 rounded-md text-slate-500 font-bold text-xs hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Request Item
                        </Button>

                        <div className="flex-[2] flex gap-3">
                            <Button
                                onClick={submit}
                                disabled={isSubmitting}
                                className="flex-1 h-12 bg-yellow-400 text-stone-900 font-black rounded-md hover:bg-yellow-500 shadow-lg shadow-yellow-100 text-sm"
                            >
                                Launch Ticket
                                <Check className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/")}
                                className="h-12 bg-slate-100 text-slate-600 font-bold rounded-md hover:bg-slate-200 text-sm"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
