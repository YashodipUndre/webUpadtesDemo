"use client";

import React, { useRef, useEffect, useState } from "react";
import {
    Bold, Italic, Underline, Strikethrough,
    Link, List, ListOrdered, Quote, Code,
    Type, Smile, AtSign
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    leadingActions?: React.ReactNode;
    trailingActions?: React.ReactNode;
}

export function RichTextEditor({ value, onChange, placeholder, className, leadingActions, trailingActions }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showToolbar, setShowToolbar] = useState(true);
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        strike: false,
        list: false,
        orderedList: false,
        quote: false,
        code: false
    });

    // Update innerHTML only if it differs from value (to avoid cursor jumps)
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const updateActiveStates = () => {
        if (typeof document !== 'undefined') {
            setActiveStates({
                bold: document.queryCommandState("bold"),
                italic: document.queryCommandState("italic"),
                underline: document.queryCommandState("underline"),
                strike: document.queryCommandState("strikeThrough"),
                list: document.queryCommandState("insertUnorderedList"),
                orderedList: document.queryCommandState("insertOrderedList"),
                quote: document.queryCommandValue("formatBlock") === "blockquote",
                code: document.queryCommandValue("formatBlock") === "pre",
            });
        }
    };

    const execCommand = (command: string, val: string = "") => {
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveStates();
        editorRef.current?.focus();
    };

    const insertText = (text: string) => {
        document.execCommand("insertText", false, text);
        if (editorRef.current) onChange(editorRef.current.innerHTML);
        editorRef.current?.focus();
    };

    const ToolbarButton = ({ icon: Icon, active, onClick, title }: any) => (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={`p-1.5 rounded transition-all ${active ? "bg-yellow-400 text-stone-900 shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className={`flex flex-col border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-yellow-400/50 focus-within:border-yellow-400 transition-all ${className}`}>
            {showToolbar && (
                <div className="flex items-center flex-wrap gap-1 p-2 bg-slate-50/80 border-b border-slate-100 animate-in slide-in-from-top-2 duration-200">
                    <ToolbarButton icon={Bold} active={activeStates.bold} onClick={() => execCommand("bold")} title="Bold" />
                    <ToolbarButton icon={Italic} active={activeStates.italic} onClick={() => execCommand("italic")} title="Italic" />
                    <ToolbarButton icon={Underline} active={activeStates.underline} onClick={() => execCommand("underline")} title="Underline" />
                    <ToolbarButton icon={Strikethrough} active={activeStates.strike} onClick={() => execCommand("strikeThrough")} title="Strikethrough" />

                    <div className="w-px h-4 bg-slate-300 mx-1" />

                    <ToolbarButton icon={Link} onClick={() => { const url = prompt("Enter URL:"); if (url) execCommand("createLink", url); }} title="Link" />
                    <ToolbarButton icon={List} active={activeStates.list} onClick={() => execCommand("insertUnorderedList")} title="Bullet List" />
                    <ToolbarButton icon={ListOrdered} active={activeStates.orderedList} onClick={() => execCommand("insertOrderedList")} title="Ordered List" />

                    <div className="w-px h-4 bg-slate-300 mx-1" />

                    <ToolbarButton icon={Code} active={activeStates.code} onClick={() => execCommand("formatBlock", "pre")} title="Code Block" />
                    <ToolbarButton icon={Quote} active={activeStates.quote} onClick={() => execCommand("formatBlock", "blockquote")} title="Quote" />
                </div>
            )}

            <div
                ref={editorRef}
                contentEditable
                onInput={(e) => {
                    onChange(e.currentTarget.innerHTML);
                    updateActiveStates();
                }}
                onSelect={updateActiveStates}
                onKeyUp={updateActiveStates}
                onMouseUp={updateActiveStates}
                className="p-3 min-h-[40px] max-h-[300px] overflow-y-auto outline-none text-slate-700 font-medium prose prose-sm max-w-none prose-p:my-1 prose-pre:bg-slate-100 prose-pre:p-2 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-yellow-50/30 prose-blockquote:py-1"
                data-placeholder={placeholder}
            />

            <div className="flex items-center justify-between p-2 bg-white border-t border-slate-100 gap-2">
                <div className="flex items-center gap-1">
                    {/* Leading Actions (Attachments) */}
                    {leadingActions}

                    <div className="w-px h-5 bg-slate-200 mx-2" />

                    {/* Editor Toggles */}
                    <button
                        onClick={() => setShowToolbar(!showToolbar)}
                        className={`p-2 rounded-lg hover:bg-slate-100 transition-colors ${showToolbar ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
                        title="Toggle Formatting"
                    >
                        <Type className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => insertText("😊")}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-yellow-600 transition-colors"
                        title="Emoji"
                    >
                        <Smile className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => insertText("@")}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                        title="Mention"
                    >
                        <AtSign className="w-5 h-5" />
                    </button>
                </div>

                {/* Trailing Actions (Send Button) */}
                <div className="flex items-center">
                    {trailingActions}
                </div>
            </div>

            <style jsx>{`
                [contentEditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    cursor: text;
                }
            `}</style>
        </div>
    );
}
