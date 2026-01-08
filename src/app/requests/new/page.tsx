"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { createRequest, DYNAMIC_CATEGORIES, CategoryType } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

export default function NewRequestPage() {
    return (
        <ProtectedRoute allow={["client"]}>
            <NewRequestForm />
        </ProtectedRoute>
    );
}

interface RequestItemForm {
    category: CategoryType;
    dynamicValues: Record<string, string>;
}

function NewRequestForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [items, setItems] = useState<RequestItemForm[]>([
        { category: "Text", dynamicValues: {} }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addItem = () => {
        setItems([...items, { category: "Text", dynamicValues: {} }]);
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

    const setCategory = (index: number, category: CategoryType) => {
        updateItem(index, { category });
    };

    const handleFieldChange = (itemIndex: number, fieldId: string, value: string) => {
        const item = items[itemIndex];
        const newDynamicValues = { ...item.dynamicValues, [fieldId]: value };
        updateItem(itemIndex, { dynamicValues: newDynamicValues });
    };

    async function submit() {
        if (!title.trim()) {
            setError("Request title is required");
            return;
        }

        // Validate all items
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // Merge fields from all selected categories
            const allFields = DYNAMIC_CATEGORIES.find(c => c.id === item.category)?.fields || [];

            // Deduplicate fields by ID
            const uniqueFields = Array.from(new Map(allFields.map(f => [f.id, f])).values());

            const missing = uniqueFields.filter(f => f.required && !item.dynamicValues[f.id]);
            if (missing && missing.length > 0) {
                setError(`Item #${i + 1}: Please fill in required fields: ${missing.map(f => f.label).join(", ")}`);
                return;
            }
        }

        if (!user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formattedItems = items.map(it => ({
                categories: [it.category],
                description: it.dynamicValues.description || it.dynamicValues.original_text || title,
                pageUrl: it.dynamicValues.page_url || "",
                details: it.dynamicValues
            }));

            await createRequest(title, urgency, user.id, formattedItems);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto py-6 px-4">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-100">
                    <svg className="w-5 h-5 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Multi-Item Request</h1>
                    <p className="text-slate-500 font-medium tracking-tight italic text-xs">Bundle multiple website updates into a single ticket</p>
                </div>
            </div>

            <div className="glass p-6 md:p-8 rounded-[2rem] shadow-xl border-white/40 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 border-b border-slate-100">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Global Ticket Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Seasonal Website Refresh"
                            className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Urgency Level</label>
                        <div className="relative">
                            <select
                                value={urgency}
                                onChange={(e) => setUrgency(e.target.value)}
                                className={`w-full p-3 border rounded-xl focus:ring-4 transition-all outline-none font-black text-sm appearance-none cursor-pointer shadow-sm ${urgency === "Urgent"
                                    ? "bg-red-50 border-red-200 text-red-600 focus:ring-red-500/10 focus:border-red-500"
                                    : "bg-white/80 border-slate-200 text-slate-700 focus:ring-yellow-400/20 focus:border-yellow-400"
                                    }`}
                            >
                                <option>Normal</option>
                                <option>Urgent</option>
                            </select>
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${urgency === "Urgent" ? "text-red-400" : "text-slate-400"}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {items.map((item, index) => {
                        const allFields = DYNAMIC_CATEGORIES.find(c => c.id === item.category)?.fields || [];
                        const uniqueFields = Array.from(new Map(allFields.map(f => [f.id, f])).values());

                        return (
                            <div key={index} className="relative space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-stone-900 text-white rounded flex items-center justify-center font-black text-[10px]">#{index + 1}</span>
                                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Update Item Specification</h3>
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-red-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Update Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {DYNAMIC_CATEGORIES.filter(c => c.enabled).map(c => {
                                            const isSelected = item.category === c.id;
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setCategory(index, c.id)}
                                                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${isSelected
                                                        ? "bg-yellow-400 border-yellow-500 text-stone-900 shadow-sm"
                                                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    {c.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    {uniqueFields.map((field) => (
                                        <div key={field.id} className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest flex justify-between">
                                                {field.label}
                                                {field.required && <span className="text-yellow-600 font-bold">REQUIRED</span>}
                                            </label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={item.dynamicValues[field.id] || ""}
                                                    onChange={(e) => handleFieldChange(index, field.id, e.target.value)}
                                                    placeholder={field.placeholder || `Enter specific details...`}
                                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm min-h-[80px]"
                                                />
                                            ) : field.type === 'file' || field.type === 'image' ? (
                                                <div className="relative group">
                                                    <input
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
                                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-yellow-50', 'border-yellow-400'); }}
                                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-yellow-50', 'border-yellow-400'); }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            e.currentTarget.classList.remove('bg-yellow-50', 'border-yellow-400');
                                                            const file = e.dataTransfer.files[0];
                                                            if (file) handleFieldChange(index, field.id, file.name);
                                                        }}
                                                        className="w-full flex items-center gap-4 p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-yellow-50 hover:border-yellow-400 transition-all shadow-sm"
                                                    >
                                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-800">{item.dynamicValues[field.id] || `Upload ${field.label}`}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Drag & Drop or Click to Select</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    value={item.dynamicValues[field.id] || ""}
                                                    onChange={(e) => handleFieldChange(index, field.id, e.target.value)}
                                                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                                                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-3">
                    <button
                        onClick={addItem}
                        className="flex-1 p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold text-xs hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Add Another Request Item
                    </button>

                    <div className="flex-[2] flex gap-3">
                        <button
                            onClick={submit}
                            disabled={isSubmitting}
                            className="flex-1 bg-yellow-400 text-stone-900 font-black px-6 py-3 rounded-xl hover:bg-yellow-500 transition-all active:scale-[0.98] shadow-lg shadow-yellow-100 flex items-center justify-center gap-2 text-sm"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-3 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Launch Ticket</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-slate-100 text-slate-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
