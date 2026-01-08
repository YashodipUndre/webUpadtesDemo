import React, { useState } from 'react';
import { RequestItem, DYNAMIC_CATEGORIES, CategoryType } from '@/lib/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Hash, ChevronDown, Link as LinkIcon } from 'lucide-react';

interface TicketItemCardProps {
    item: RequestItem;
    children?: React.ReactNode;
}

export function TicketItemCard({ item, children }: TicketItemCardProps) {
    const [selectedCat, setSelectedCat] = useState<string | null>(null);
    const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-yellow-100/20 transition-all duration-300">
            {/* Header / ID Bar */}
            <div className={`px-5 py-4 bg-white transition-colors duration-300 ${selectedCat ? 'bg-slate-50/50' : ''} ${!selectedCat ? 'rounded-b-2xl' : 'border-b border-slate-100'}`}>
                <div className="flex gap-4">
                    {/* Left: ID Badge */}
                    <div className="flex-shrink-0 pt-0.5">
                        <span className="w-9 h-9 rounded-lg bg-yellow-400 text-stone-900 flex items-center justify-center font-black text-xs shadow-sm shadow-yellow-200">
                            #{item.item_number}
                        </span>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Top: Description & Status */}
                        <div className="flex items-start justify-between gap-4">
                            <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 pt-0.5" title={item.description}>
                                {item.description}
                            </h4>
                            <div className="flex-shrink-0">
                                <StatusBadge status={item.status} />
                            </div>
                        </div>

                        {/* Bottom: Inline Scrollable Category Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -ml-1 pl-1 mask-linear-fade">
                            {item.categories?.map(cat => {
                                const isActive = selectedCat === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCat(isActive ? null : cat);
                                        }}
                                        className={`
                                            flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border
                                            ${isActive
                                                ? 'bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-200 transform scale-105'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50'}
                                        `}
                                    >
                                        <Hash className={`w-3 h-3 ${isActive ? 'text-yellow-400' : 'text-slate-400'}`} />
                                        {cat}
                                    </button>
                                );
                            })}

                            {(!item.categories || item.categories.length === 0) && (
                                <span className="text-[10px] text-slate-400 italic px-2">No categories</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body - Only visible when a category is selected */}
            {selectedCat && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-5 space-y-5">
                        {/* Description - Always Visible */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                                <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                                Description
                            </h4>
                            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                                {item.description}
                            </p>
                        </div>

                        {/* URL - Always Visible */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Page Location</h4>
                                <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 bg-yellow-50/50 border border-yellow-100 rounded-xl text-xs font-bold text-yellow-700 hover:bg-yellow-50 hover:pl-3 transition-all truncate">
                                    <span className="truncate">{item.page_url}</span>
                                    <svg className="w-3 h-3 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </div>

                            {/* Dynamic Details - Filtered by Tab */}
                            {Object.entries(item.details || {}).map(([key, val]) => {
                                if (!val || key === 'page_url' || key === 'description') return null;

                                // Filter logic: If category selected (and not special 'All'), check if key belongs to it
                                if (selectedCat && selectedCat !== 'All') {
                                    const config = DYNAMIC_CATEGORIES.find(c => c.id === selectedCat);
                                    const allowedFields = config?.fields.map(f => f.id) || [];
                                    if (!allowedFields.includes(key)) return null;
                                }

                                const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                const isUrl = typeof val === 'string' && (val.startsWith('http') || val.includes('.com') || val.includes('.net'));

                                return (
                                    <div key={key} className="animate-in fade-in zoom-in-95 duration-300">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">{label}</h4>
                                        {isUrl ? (
                                            <a href={val as string} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline truncate">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
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

                        {/* External Links */}
                        {(item.trello_url || item.filemaker_url) && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                                {item.trello_url && (
                                    <a href={item.trello_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0079BF]/10 text-[#0079BF] rounded-lg text-[10px] font-black uppercase hover:bg-[#0079BF]/20 transition-colors">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 0h-15A4.5 4.5 0 000 4.5v15A4.5 4.5 0 004.5 24h15a4.5 4.5 0 004.5-4.5v-15A4.5 4.5 0 0019.5 0zM10.8 19.2H5.45V4.6h5.35v14.6zm7.75-5.6h-5.35V4.6h5.35v9z" /></svg>
                                        Trello Card
                                    </a>
                                )}
                                {item.filemaker_url && (
                                    <a href={item.filemaker_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-black uppercase hover:bg-purple-200 transition-colors">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                        FileMaker
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {children && (
                        <div className="bg-slate-50 px-5 py-4 border-t border-slate-100">
                            {children}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
