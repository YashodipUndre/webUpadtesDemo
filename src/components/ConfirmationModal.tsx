"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'info' | 'danger';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "YES, PROCEED",
    cancelText = "Back",
    type = 'warning'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden"
            >
                <div className="flex flex-col items-start">
                    <div className="bg-yellow-100 p-3 rounded-2xl mb-4">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-black text-stone-800 mb-4 uppercase tracking-tight">
                        {title}
                    </h2>

                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        {message}
                    </p>

                    <div className="flex items-center justify-end w-full gap-4">
                        <button
                            onClick={onClose}
                            className="text-slate-500 font-bold hover:text-stone-800 transition-colors uppercase text-sm tracking-wider px-4 py-2"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-yellow-200 active:scale-95 uppercase text-sm tracking-wider"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
