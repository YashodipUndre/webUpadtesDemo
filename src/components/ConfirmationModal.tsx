"use client";

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

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
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-none">
                <AlertDialogHeader className="flex flex-col items-start text-left">
                    <div className="bg-yellow-100 p-3 rounded-2xl mb-4">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-black text-stone-800 mb-2 uppercase tracking-tight">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed mb-6">
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center justify-end w-full gap-4 sm:space-x-4">
                    <AlertDialogCancel
                        onClick={onClose}
                        className="text-slate-500 font-bold hover:text-stone-800 transition-colors uppercase text-sm tracking-wider px-4 py-2 border-none hover:bg-transparent"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-yellow-200 active:scale-95 uppercase text-sm tracking-wider"
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
