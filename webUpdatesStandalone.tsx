/**
 * WEB UPDATES TICKETING SYSTEM - STANDALONE VERSION (V4 - FIXED COLLISSIONS)
 * 
 * Instructions:
 * 1. Copy everything.
 * 2. Paste into Gemini Canvas.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
// --- UNIFIED CONSTANTS ---
const ITEMS_PER_PAGE = 5;



// --- ICON DEFINITIONS ---
const Search = LucideIcons.Search || LucideIcons.HelpCircle;
const Filter = LucideIcons.Filter || LucideIcons.HelpCircle;
const X = LucideIcons.X || LucideIcons.HelpCircle;
const LogOut = LucideIcons.LogOut || LucideIcons.HelpCircle;
const Settings = LucideIcons.Settings || LucideIcons.HelpCircle;
const User = LucideIcons.User || LucideIcons.HelpCircle;
const Mail = LucideIcons.Mail || LucideIcons.HelpCircle;
const Menu = LucideIcons.Menu || LucideIcons.HelpCircle;
const Bold = LucideIcons.Bold || LucideIcons.HelpCircle;
const Italic = LucideIcons.Italic || LucideIcons.HelpCircle;
const Underline = LucideIcons.Underline || LucideIcons.HelpCircle;
const Strikethrough = LucideIcons.Strikethrough || LucideIcons.HelpCircle;
const List = LucideIcons.List || LucideIcons.HelpCircle;
const ListOrdered = LucideIcons.ListOrdered || LucideIcons.HelpCircle;
const Quote = LucideIcons.Quote || LucideIcons.HelpCircle;
const Code = LucideIcons.Code || LucideIcons.HelpCircle;
const Type = LucideIcons.Type || LucideIcons.HelpCircle;
const Smile = LucideIcons.Smile || LucideIcons.HelpCircle;
const AtSign = LucideIcons.AtSign || LucideIcons.HelpCircle;
const ChevronRight = LucideIcons.ChevronRight || LucideIcons.HelpCircle;
const Calendar = LucideIcons.Calendar || LucideIcons.HelpCircle;
const Clock = LucideIcons.Clock || LucideIcons.HelpCircle;
const CheckCircle = LucideIcons.CheckCircle || LucideIcons.HelpCircle;
const CheckCircle2 = LucideIcons.CheckCircle2 || LucideIcons.HelpCircle;
const AlertCircle = LucideIcons.AlertCircle || LucideIcons.HelpCircle;
const Trash2 = LucideIcons.Trash2 || LucideIcons.HelpCircle;
const Plus = LucideIcons.Plus || LucideIcons.HelpCircle;
const ArrowLeft = LucideIcons.ArrowLeft || LucideIcons.HelpCircle;
const BarChart = LucideIcons.BarChart || LucideIcons.HelpCircle;
const BarChart2 = LucideIcons.BarChart2 || LucideIcons.HelpCircle;
const BarChart3 = LucideIcons.BarChart3 || LucideIcons.HelpCircle;
const BarChart4 = LucideIcons.BarChart4 || LucideIcons.HelpCircle;
const MessageSquare = LucideIcons.MessageSquare || LucideIcons.HelpCircle;
const Clipboard = LucideIcons.Clipboard || LucideIcons.HelpCircle;
const Layers = LucideIcons.Layers || LucideIcons.HelpCircle;
const FileText = LucideIcons.FileText || LucideIcons.HelpCircle;
const ExternalLink = LucideIcons.ExternalLink || LucideIcons.HelpCircle;
const Home = LucideIcons.Home || LucideIcons.HelpCircle;
const File = LucideIcons.File || LucideIcons.HelpCircle;
const MoreHorizontal = LucideIcons.MoreHorizontal || LucideIcons.HelpCircle;
const MoreVertical = LucideIcons.MoreVertical || LucideIcons.HelpCircle;
const Download = LucideIcons.Download || LucideIcons.HelpCircle;
const Upload = LucideIcons.Upload || LucideIcons.HelpCircle;
const Archive = LucideIcons.Archive || LucideIcons.HelpCircle;
const ArrowRight = LucideIcons.ArrowRight || LucideIcons.HelpCircle;
const ArrowUp = LucideIcons.ArrowUp || LucideIcons.HelpCircle;
const ArrowDown = LucideIcons.ArrowDown || LucideIcons.HelpCircle;
const Bell = LucideIcons.Bell || LucideIcons.HelpCircle;
const Check = LucideIcons.Check || LucideIcons.HelpCircle;
const ChevronDown = LucideIcons.ChevronDown || LucideIcons.HelpCircle;
const ChevronUp = LucideIcons.ChevronUp || LucideIcons.HelpCircle;
const ChevronLeft = LucideIcons.ChevronLeft || LucideIcons.HelpCircle;
const Copy = LucideIcons.Copy || LucideIcons.HelpCircle;
const Database = LucideIcons.Database || LucideIcons.HelpCircle;
const Edit = LucideIcons.Edit || LucideIcons.HelpCircle;
const Eye = LucideIcons.Eye || LucideIcons.HelpCircle;
const EyeOff = LucideIcons.EyeOff || LucideIcons.HelpCircle;
const Info = LucideIcons.Info || LucideIcons.HelpCircle;
const Lock = LucideIcons.Lock || LucideIcons.HelpCircle;
const MapPin = LucideIcons.MapPin || LucideIcons.HelpCircle;
const Moon = LucideIcons.Moon || LucideIcons.HelpCircle;
const RefreshCw = LucideIcons.RefreshCw || LucideIcons.HelpCircle;
const Save = LucideIcons.Save || LucideIcons.HelpCircle;
const Send = LucideIcons.Send || LucideIcons.HelpCircle;
const Share = LucideIcons.Share || LucideIcons.HelpCircle;
const Sun = LucideIcons.Sun || LucideIcons.HelpCircle;
const Tag = LucideIcons.Tag || LucideIcons.HelpCircle;
const Trash = LucideIcons.Trash || LucideIcons.HelpCircle;
const UserPlus = LucideIcons.UserPlus || LucideIcons.HelpCircle;
const Users = LucideIcons.Users || LucideIcons.HelpCircle;
const Zap = LucideIcons.Zap || LucideIcons.HelpCircle;
const HelpCircle = LucideIcons.HelpCircle || LucideIcons.HelpCircle;
const Activity = LucideIcons.Activity || LucideIcons.HelpCircle;
const TrendingUp = LucideIcons.TrendingUp || LucideIcons.HelpCircle;
const School = LucideIcons.School || LucideIcons.HelpCircle;
const ShieldCheck = LucideIcons.ShieldCheck || LucideIcons.HelpCircle;
const AlertTriangle = LucideIcons.AlertTriangle || LucideIcons.HelpCircle;
const Timer = LucideIcons.Timer || LucideIcons.HelpCircle;
const LinkIcon = LucideIcons.Link;
const LucideImage = LucideIcons.Image;



// --- CSS ---
const GlobalStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `



:root {
  /* Premium Yellow & White Palette */
  --primary: #facc15;
  --primary-rgb: 250, 204, 21;
  --primary-hover: #eab308;
  --secondary: #fbbf24;
  /* Amber accent */
  --background: #ffffff;
  --foreground: #1c1917;
  --card: #ffffff;
  --card-foreground: #292524;
  --border: rgba(231, 229, 228, 0.8);
  --input: #ffffff;
  --radius: 1.25rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}

.dark {
  --background: #020617;
  --foreground: #f8fafc;
  --card: #0f172a;
  --card-foreground: #f1f5f9;
  --border: rgba(30, 41, 59, 0.5);
  --input: #0f172a;
}

body {
  background: var(--background);
  color: var(--foreground);

  -webkit-font-smoothing: antialiased;
  background-image:
    radial-gradient(at 0% 0%, rgba(250, 204, 21, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(251, 191, 36, 0.05) 0px, transparent 50%);
  min-height: 100vh;
}

.glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
}

.dark .glass {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card-premium {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card-premium::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-premium:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  border-color: rgba(99, 102, 241, 0.2);
}

.card-premium:hover::before {
  opacity: 1;
}

/* Custom transitions for status badges */
.status-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.prose a {
  color: #ca8a04;
  text-decoration: underline;
  font-weight: 700;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}` }} />
);

// --- NEXT.JS MOCKS ---
const RouterContext = createContext(null);

function useRouter() {
    const ctx = useContext(RouterContext);
    return {
        push: (url) => ctx.setPath(url),
        replace: (url) => ctx.setPath(url),
        back: () => { },
        prefetch: () => { },
    };
}

function useParams() {
    const ctx = useContext(RouterContext);
    return { id: ctx.currentId };
}

function Link({ href, children, className, ...props }) {
    const ctx = useContext(RouterContext);
    return (
        <span
            className={(className || "") + " cursor-pointer"}
            onClick={(e) => {
                e.preventDefault();
                ctx.setPath(href);
            }}
            {...props}
        >
            {children}
        </span>
    );
}

function Image({ src, alt, width, height, ...props }) {
    // Basic mock for next/image
    return <img src={src} alt={alt} style={{ width: width || 'auto', height: height || 'auto' }} {...props} />;
}

// --- SHARED TYPES & MOCK DATA SETUP ---

// --- SOURCE: src/lib/data.ts ---
type Attachment = {
    name: string;
    url: string;
    type: string;
};

type Message = {
    id: string;
    request_id: string;
    item_id?: string | null;
    user_id: string;
    text: string;
    created_at: string;
    is_internal: boolean;
    attachments?: Attachment[];
    profiles?: {
        email: string;
        role: string;
    };
};

type CategoryType = 'Text' | 'Image' | 'Document' | 'Defect';

type CategoryConfig = {
    id: CategoryType;
    label: string;
    enabled: boolean;
    fields: {
        id: string;
        label: string;
        type: 'text' | 'textarea' | 'url' | 'file' | 'image';
        required: boolean;
        placeholder?: string;
    }[];
};

const DYNAMIC_CATEGORIES: CategoryConfig[] = [
    {
        id: 'Text',
        label: 'Text Update',
        enabled: true,
        fields: [
            { id: 'page_url', label: 'Page URL', type: 'url', required: true, placeholder: 'https://school.com/about' },
            { id: 'original_text', label: 'Original Text', type: 'textarea', required: true },
            { id: 'updated_text', label: 'Updated Text', type: 'textarea', required: true }
        ]
    },
    {
        id: 'Image',
        label: 'Image Update',
        enabled: true,
        fields: [
            { id: 'page_url', label: 'Page URL', type: 'url', required: true },
            { id: 'old_image_ref', label: 'Old Image Reference', type: 'text', required: true, placeholder: 'Descriptive name of the image to replace' },
            { id: 'new_image', label: 'New Image', type: 'image', required: true }
        ]
    },
    {
        id: 'Document',
        label: 'Document (Policy)',
        enabled: true,
        fields: [
            { id: 'document_title', label: 'Document Title', type: 'text', required: true, placeholder: 'e.g. Admission Policy 2025' },
            { id: 'file', label: 'Policy Attachment (PDF/DOCX/XLS)', type: 'file', required: true }
        ]
    },
    {
        id: 'Defect',
        label: 'Report Defect',
        enabled: true,
        fields: [
            { id: 'page_url', label: 'Page URL', type: 'url', required: true },
            { id: 'description', label: 'Description of Issue', type: 'textarea', required: true }
        ]
    }
];

type AuditEntry = {
    id: string;
    request_id: string;
    user_id: string;
    user_email: string;
    action: string;
    previous_value?: string;
    new_value?: string;
    created_at: string;
};

type RequestItem = {
    id: string;
    request_id: string;
    item_number: number;
    categories: CategoryType[];
    description: string;
    page_url: string;
    trello_url?: string | null;
    filemaker_url?: string | null;
    details: any; // Dynamic based on category
    status: string;
    assigned_to: string | null;
    reviewer_id: string | null; // Primary assignee/coordinator
    peer_reviewers: PeerReviewDecision[]; // Multiple peer reviewers
    estimated_effort: number;
    due_date: string | null;
    created_at: string;
};

function isPeerReviewAdmin(email?: string) {
    return email === 'admin@dummy.com';
}

type PeerReviewDecision = {
    user_id: string;
    email: string;
    decision: 'Yes' | 'No' | null;
    updated_at: string | null;
};

type Request = {
    id: string;
    title: string;
    client_id: string;
    reviewer_id?: string | null;
    status: string;
    urgency: string;
    created_at: string;
    sla_due_date: string | null;
    profiles?: { email: string, school?: string, role?: string };
    reviewer?: { email: string };
    items?: RequestItem[];
    messages?: Message[];
    audit_logs?: AuditEntry[];
    total_messages?: number;
    unseen_count?: number;
    last_viewed_at?: string;
};

const REQUESTS_KEY = "dummy_requests_v2";
const MESSAGES_KEY = "dummy_messages_v2";

// Helper to get from local storage
function getStored<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
}

// Helper to save to local storage
function setStored<T>(key: string, val: T) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(val));
}

// Initial dummy data
const initialRequests: Request[] = [
    {
        id: "1",
        title: "Update Logo on Homepage",
        client_id: "client-1",
        status: "New",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        sla_due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
        profiles: { email: "school@example.com", school: "Saint Mary's Academy" },
        items: [
            {
                id: "item-1",
                request_id: "1",
                item_number: 1,
                categories: ['Image'],
                description: "New logo is ready in high res",
                page_url: "https://school.com",
                trello_url: "https://trello.com/c/123",
                details: {},
                status: "New",
                assigned_to: null,
                reviewer_id: null,
                estimated_effort: 0,
                due_date: null,
                peer_reviewers: [],
                created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ]
    },
    {
        id: "2",
        title: "Fix Mobile Header Navigation",
        client_id: "client-2",
        status: "Peer Review",
        urgency: "Urgent",
        created_at: new Date().toISOString(), // Today
        sla_due_date: new Date(Date.now() - 3600000).toISOString(),
        profiles: { email: "corporate@example.com", school: "Global Corp High" },
        items: [
            {
                id: "item-2",
                request_id: "2",
                item_number: 1,
                categories: ['Text'],
                description: "Menu button doesn't work on iOS",
                page_url: "https://corporate.com",
                details: {},
                status: "Peer Review",
                assigned_to: null,
                reviewer_id: null,
                estimated_effort: 0,
                due_date: null,
                peer_reviewers: [],
                created_at: new Date().toISOString()
            }
        ]
    }
];

// Initial dummy messages
const initialMessages: Message[] = [
    {
        id: "m1",
        request_id: "2",
        user_id: "client-2",
        text: "Please help, the mobile menu is completely broken.",
        is_internal: false,
        created_at: new Date().toISOString(),
        profiles: { email: "corporate@example.com", role: "client" }
    },
    {
        id: "m2",
        request_id: "2",
        user_id: "admin-1",
        text: "Moving this to Peer Review after initial fixes.",
        is_internal: true,
        created_at: new Date().toISOString(),
        profiles: { email: "admin@dummy.com", role: "admin" }
    }
];

export async function getRequests(currentUserId?: string, userRole?: string) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const messages = getStored<Message[]>(MESSAGES_KEY, initialMessages);

    return requests.map(r => {
        const rMessages = messages.filter(m => m.request_id === r.id);
        const visible = rMessages.filter(m => {
            if (userRole === 'admin' || userRole === 'reviewer') return true;
            return !m.is_internal;
        });

        return {
            ...r,
            total_messages: visible.length,
            unseen_count: 0 // Simplification for dummy
        };
    });
}

export async function getRequestById(id: string, currentUserId?: string, userRole?: string) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const messages = getStored<Message[]>(MESSAGES_KEY, initialMessages);

    const request = requests.find(r => r.id === id);
    if (!request) throw new Error("Request not found");

    const rMessages = messages.filter(m => m.request_id === id);
    const visibleMessages = rMessages.filter(m => {
        if (userRole === 'admin' || userRole === 'reviewer') return true;
        return !m.is_internal;
    });

    const processedItems = request.items?.map(item => {
        if (userRole === 'client') {
            const { peer_reviewers, reviewer_id, assigned_to, ...clientVisibleItem } = item;
            return clientVisibleItem;
        }
        return item;
    });

    return {
        ...request,
        items: processedItems,
        messages: visibleMessages,
        total_messages: visibleMessages.length
    } as Request;
}

export async function createRequest(title: string, urgency: string, userId: string, items: { categories: string[], description: string, pageUrl: string, details?: any }[]) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);

    if (urgency === 'Urgent') {
        console.log("📧 [SYSTEM] Sending Urgent Ticket Notification to Admin Team...");
    }

    const requestId = Math.random().toString(36).substr(2, 9);
    const newRequest: Request = {
        id: requestId,
        title,
        urgency,
        client_id: userId,
        status: 'New', // Ticket overall status (could be computed)
        created_at: new Date().toISOString(),
        sla_due_date: urgency === 'Urgent'
            ? new Date(Date.now() + 86400000).toISOString() // 24h for urgent
            : new Date(Date.now() + 86400000 * 3).toISOString(), // 72h for normal
        profiles: { email: "dummy@client.com" },
        items: items.map((it, idx) => ({
            id: Math.random().toString(36).substr(2, 9),
            request_id: requestId,
            item_number: idx + 1,
            categories: it.categories as CategoryType[],
            description: it.description,
            page_url: it.pageUrl,
            details: it.details || {},
            status: 'New',
            assigned_to: null,
            reviewer_id: null,
            estimated_effort: 0,
            due_date: null,
            peer_reviewers: [],
            created_at: new Date().toISOString()
        }))
    };

    const updated = [newRequest, ...requests];
    setStored(REQUESTS_KEY, updated);
    return newRequest;
}

function addAuditEntry(request: Request, userEmail: string, action: string, prev?: string, next?: string) {
    if (!request.audit_logs) request.audit_logs = [];
    request.audit_logs.push({
        id: Math.random().toString(36).substr(2, 9),
        request_id: request.id,
        user_id: userEmail, // Simplified for mock
        user_email: userEmail,
        action,
        previous_value: prev,
        new_value: next,
        created_at: new Date().toISOString()
    });
}

export async function updateRequestStatus(id: string, status: string, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        const prev = requests[index].status;
        requests[index].status = status;
        addAuditEntry(requests[index], userEmail, `Changed Request Status`, prev, status);
        setStored(REQUESTS_KEY, requests);
    }
}

export async function updateItemStatus(requestId: string, itemId: string, status: string, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1 && requests[rIndex].items) {
        const iIndex = requests[rIndex].items!.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            const item = requests[rIndex].items![iIndex];
            const prev = item.status;
            item.status = status;
            addAuditEntry(requests[rIndex], userEmail, `Changed Item #${item.item_number} Status`, prev, status);
            setStored(REQUESTS_KEY, requests);
        }
    }
}

export async function updateItemExternalLinks(requestId: string, itemId: string, trelloUrl: string | null, filemakerUrl: string | null, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1 && requests[rIndex].items) {
        const iIndex = requests[rIndex].items!.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            const item = requests[rIndex].items![iIndex];
            item.trello_url = trelloUrl;
            item.filemaker_url = filemakerUrl;
            addAuditEntry(requests[rIndex], userEmail, `Updated External Links for Item #${item.item_number}`);
            setStored(REQUESTS_KEY, requests);
        }
    }
}

export async function updateItemEffortAndDate(requestId: string, itemId: string, effort: number, dueDate: string | null, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1 && requests[rIndex].items) {
        const iIndex = requests[rIndex].items!.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            requests[rIndex].items![iIndex].estimated_effort = effort;
            requests[rIndex].items![iIndex].due_date = dueDate;
            addAuditEntry(requests[rIndex], userEmail, `Updated Effort/Date for Item #${requests[rIndex].items![iIndex].item_number}`, `Effort: ${effort}, Due: ${dueDate}`);
            setStored(REQUESTS_KEY, requests);
        }
    }
}

export async function assignItem(requestId: string, itemId: string, reviewerId: string | null, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1 && requests[rIndex].items) {
        const iIndex = requests[rIndex].items!.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            const item = requests[rIndex].items![iIndex];
            const prev = item.reviewer_id;
            item.reviewer_id = reviewerId;
            addAuditEntry(requests[rIndex], userEmail, `Assigned Developer to Item #${item.item_number}`, prev || 'None', reviewerId || 'None');
            setStored(REQUESTS_KEY, requests);
        }
    }
}

export async function sendMessage(requestId: string, userId: string, text: string, isInternal: boolean = false, attachment?: Attachment, senderRole?: string, userEmail?: string) {
    const messages = getStored<Message[]>(MESSAGES_KEY, initialMessages);
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);

    // Check if we need to reopen the ticket
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1 && senderRole === 'client' && requests[rIndex].status === 'Complete') {
        const prev = requests[rIndex].status;
        requests[rIndex].status = 'In Progress';
        addAuditEntry(requests[rIndex], userEmail || 'Client', `Reopened Request via Message`, prev, 'In Progress');
        setStored(REQUESTS_KEY, requests);
    }

    const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        request_id: requestId,
        user_id: userId,
        text,
        is_internal: isInternal,
        created_at: new Date().toISOString(),
        attachments: attachment ? [attachment] : undefined,
        profiles: {
            email: userEmail || (senderRole === 'client' ? "client@dummy.com" : (senderRole === 'admin' ? "admin@dummy.com" : "reviewer@dummy.com")),
            role: senderRole || (isInternal ? "admin" : "client")
        }
    };
    const updated = [...messages, newMessage];
    setStored(MESSAGES_KEY, updated);
    return newMessage;
}

export async function getReviewers() {
    return [
        { id: "rev-1", email: "reviewer1@dummy.com" },
        { id: "rev-2", email: "reviewer2@dummy.com" }
    ];
}

export async function assignRequest(requestId: string, reviewerId: string | null, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        const prev = requests[index].reviewer_id;
        requests[index].reviewer_id = reviewerId;
        addAuditEntry(requests[index], userEmail, `Assigned Request`, prev || 'None', reviewerId || 'None');
        if (reviewerId) {
            console.log(`📧 [SYSTEM] Sending Assignment Notification to Reviewer ID: ${reviewerId}...`);
        }
        setStored(REQUESTS_KEY, requests);
    }
}

export async function updateRequestSLA(requestId: string, slaDate: string | null) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        requests[index].sla_due_date = slaDate;
        setStored(REQUESTS_KEY, requests);
    }
}

export async function addPeerReviewer(requestId: string, itemId: string, reviewer: { id: string, email: string }) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1) {
        const items = requests[rIndex].items || [];
        const iIndex = items.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            const current = items[iIndex].peer_reviewers || [];
            if (!current.find(r => r.user_id === reviewer.id)) {
                items[iIndex].peer_reviewers.push({
                    user_id: reviewer.id,
                    email: reviewer.email,
                    decision: null,
                    updated_at: null
                });
                addAuditEntry(requests[rIndex], 'Admin', `Added Peer Reviewer to Item #${items[iIndex].item_number}`, 'None', reviewer.email);
                setStored(REQUESTS_KEY, requests);
            }
        }
    }
}

export async function submitPeerReviewDecision(requestId: string, itemId: string, userId: string, decision: 'Yes' | 'No') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1) {
        const items = requests[rIndex].items || [];
        const iIndex = items.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            const reviewers = items[iIndex].peer_reviewers || [];
            const revIndex = reviewers.findIndex(r => r.user_id === userId);
            if (revIndex !== -1) {
                reviewers[revIndex].decision = decision;
                reviewers[revIndex].updated_at = new Date().toISOString();
                addAuditEntry(requests[rIndex], reviewers[revIndex].email, `Peer Review Decision for Item #${items[iIndex].item_number}`, 'Pending', decision);
                setStored(REQUESTS_KEY, requests);
            }
        }
    }
}

export async function bulkAssignRequests(requestIds: string[], reviewerId: string | null, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    requestIds.forEach(id => {
        const index = requests.findIndex(r => r.id === id);
        if (index !== -1) {
            const prev = requests[index].reviewer_id;
            requests[index].reviewer_id = reviewerId;
            addAuditEntry(requests[index], userEmail, `Bulk Assigned Request`, prev || 'None', reviewerId || 'None');
        }
    });
    setStored(REQUESTS_KEY, requests);
}

export async function markRequestAsRead(requestId: string, userId: string) {
    // No-op for dummy
}


// --- SOURCE: src/lib/auth-context.tsx ---





// Define a simple local User type
interface LocalUser {
    id: string;
    email: string;
    role: Role;
}

type Role = "client" | "admin" | "reviewer" | "developer" | null;

interface AuthContextType {
    user: LocalUser | null;
    role: Role;
    isLoading: boolean;
    login: (email: string, role: Role) => Promise<void>;
    signup: (email: string, role: Role) => Promise<void>;
    logout: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "web_updates_session";

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<LocalUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hydrate session from localStorage
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            setUser(data);
        }
        setIsLoading(false);
    }, []);

    const signup = async (email: string, role: Role) => {
        const newUser: LocalUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        setUser(newUser);
    };

    const login = async (email: string, role: Role) => {
        // In a dummy app, we just accept whatever the user picks on the UI
        let id = "dummy-id-" + Date.now();
        if (email === 'reviewer1@dummy.com') id = 'rev-1';
        else if (email === 'reviewer2@dummy.com') id = 'rev-2';
        else if (email === 'admin@dummy.com') id = 'admin-1';

        const dummyUser: LocalUser = {
            id,
            email,
            role
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(dummyUser));
        setUser(dummyUser);
    };

    const logout = async () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        router.push("/login");
    };

    const refreshRole = async () => {
        // No-op in dummy mode
    };

    const role = user?.role || null;

    return (
        <AuthContext.Provider value={{ user, role, isLoading, logout, refreshRole, login, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}


// --- SOURCE: src/components/ui/icons.tsx ---


function IconWrapper({ children }: { children: React.ReactNode }) {
    return (
        <span className="w-5 h-5 inline-flex items-center justify-center">
            {children}
        </span>
    );
}

const MenuIcon = () => (
    <IconWrapper>
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </IconWrapper>
);

const PlusIcon = () => (
    <IconWrapper>
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </IconWrapper>
);


// --- SOURCE: src/components/StatusBadge.tsx ---


function StatusBadge({ status, size = "md" }: { status: string, size?: "sm" | "md" }) {
    const colors: Record<string, string> = {
        'New': 'bg-yellow-400/10 text-yellow-600 border-yellow-200',
        'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
        'Info Needed': 'bg-rose-50 text-rose-600 border-rose-100',
        'Peer Review': 'bg-stone-100 text-stone-700 border-stone-200',
        'Complete': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };

    const sizeClasses = {
        sm: "px-2 py-0.5 text-[9px]",
        md: "px-2.5 py-1 text-[11px]"
    };

    return (
        <span className={`inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-wider border transition-all ${sizeClasses[size]} ${colors[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
            {status}
        </span>
    );
}


// --- SOURCE: src/components/ConfirmationModal.tsx ---





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

function ConfirmationModal({
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


// --- SOURCE: src/components/ProtectedRoute.tsx ---






interface ProtectedRouteProps {
    children: React.ReactNode;
    allow: Role[];
}

function ProtectedRoute({ children, allow }: ProtectedRouteProps) {
    const { role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isLoading && !role) {
                router.push("/login");
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [role, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (!role) {
        return null;
    }

    if (!allow.includes(role)) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-sm border border-red-100">
                    <h3 className="font-bold text-lg mb-2">Access Denied</h3>
                    <p>You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}


// --- SOURCE: src/components/Navbar.tsx ---







function Navbar() {
    const { user, role, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Dashboard", show: role === "client" },
        { href: "/requests/new", label: "New Ticket", show: role === "client" },
        { href: "/admin", label: "Overview", show: role === "admin" },
        { href: "/admin/reports", label: "Reports", show: role === "admin" },
        { href: "/reviewer", label: "Reviews", show: role === "reviewer" },
    ].filter(link => link.show);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group text-slate-900 animate-in fade-in">
                            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-yellow-100 ring-2 ring-white">
                                <span className="text-stone-900 font-black text-xl tracking-tighter">US</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 ml-1">
                                Web<span className="text-yellow-500">Updates</span>
                            </span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3.5 py-2 text-sm font-bold text-slate-500 hover:text-yellow-600 hover:bg-yellow-50/50 rounded-lg transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-5">
                        {!user && (
                            <div className="flex items-center gap-5">
                                <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-yellow-600 transition-colors">Sign In</Link>
                                <Link href="/signup" className="px-6 py-2.5 text-sm font-bold text-stone-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-100 active:scale-95">Get Started</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-md"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 pb-3 border-t border-slate-100">
                                {!user && (
                                    <div className="px-3 space-y-1">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-md"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-3 py-2 text-base font-medium text-yellow-600 hover:bg-yellow-50 rounded-md"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}


// --- SOURCE: src/components/Sidebar.tsx ---






function Sidebar() {
    const { user, role, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[60] w-12 h-12 bg-yellow-400 text-stone-900 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <aside className={`
                fixed left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
                top-16 h-[calc(100vh-64px)] overflow-y-auto
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* User Profile Section */}
                <div className="pt-4 pb-6 px-6 border-b border-slate-100 bg-white">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group relative">
                            <User className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">{role || "No Role"}</p>
                            <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]" title={user.email}>
                                {user.email?.split('@')[0]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 p-4 py-8 space-y-1 overflow-y-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Account Details</div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 mb-4">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-bold truncate">{user.email}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group"
                    >
                        <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all group active:scale-95"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 animate-in fade-in"
                />
            )}
        </>
    );
}


// --- SOURCE: src/components/LayoutShell.tsx ---







function LayoutShell({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-white text-slate-900">
            <Navbar />

            <div className="flex flex-1">
                {user && <Sidebar />}

                <div className="flex-1 flex flex-col">
                    <main className="flex-1 w-full px-6 py-0">
                        <div className="pt-6">
                            {children}
                        </div>
                    </main>

                    <footer className="py-8 border-t border-slate-200">
                        <div className="px-6 text-center lg:text-left">
                            <p className="text-sm text-slate-500 font-medium">© 2025 Web Updates • Built for visual excellence</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}


// --- SOURCE: src/components/RequestCard.tsx ---






interface RequestCardProps {
    request: Request;
    onOpen: () => void;
}

function RequestCard({ request, onOpen }: RequestCardProps) {
    const formattedDate = new Date(request.created_at).toLocaleDateString();

    return (
        <div
            onClick={onOpen}
            className={`cursor-pointer group relative p-5 rounded-3xl border transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl
                ${request.urgency === 'Urgent'
                    ? 'bg-gradient-to-r from-red-50/50 to-white border-red-100 shadow-lg shadow-red-100/10'
                    : 'bg-white border-slate-100 shadow-md shadow-slate-200/40 hover:shadow-yellow-100/20'
                } flex flex-col md:flex-row md:items-center gap-5`}
        >
            {/* Status Indicator Bar (Left Side for Row) */}
            <div className={`absolute left-0 top-5 bottom-5 w-1.5 rounded-r-full transition-all duration-500 ${request.status === 'Complete' ? 'bg-emerald-400' :
                request.status === 'In Progress' ? 'bg-blue-400' :
                    request.urgency === 'Urgent' ? 'bg-rose-400' : 'bg-yellow-400'
                } opacity-50 group-hover:opacity-100`} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 pl-3">

                {/* 1. ID, Title & Badges */}
                <div className="flex-1 space-y-1.5 min-w-[280px]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 flex items-center justify-center text-stone-600 font-bold text-[10px] border border-slate-100 group-hover:bg-yellow-400 group-hover:text-stone-900 group-hover:border-yellow-400 transition-colors">
                            #{request.id.slice(0, 4)}
                        </span>
                        {request.urgency === 'Urgent' && (
                            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black uppercase rounded-md border border-rose-100 tracking-wider">
                                🔥 Critical
                            </span>
                        )}
                        <StatusBadge status={request.status} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-1">
                        {request.title}
                    </h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {request.profiles?.school || 'General'}
                    </span>
                </div>

                {/* 2. Metadata (Date & Items) */}
                <div className="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-6 md:pr-4">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Created</label>
                        <p className="text-[10px] font-bold text-slate-700">{formattedDate}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Items</label>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                            <span className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{request.items?.length || 0}</span> Tasks
                        </div>
                    </div>
                </div>

                {/* 3. User Info */}
                <div className="flex items-center gap-2.5 md:border-l md:border-slate-100 md:pl-6 min-w-[140px]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-[2px] shadow-inner shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[9px] font-black text-slate-500">
                            {request.profiles?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reported By</span>
                        <span className="text-[10px] font-bold text-slate-600 truncate w-full">{request.profiles?.email}</span>
                    </div>
                </div>
            </div>

            {/* 4. Action / Notification */}
            <div className="flex flex-col items-end justify-center pl-1 gap-1.5">
                {request.unseen_count! > 0 && (
                    <span className="bg-yellow-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        +{request.unseen_count} NEW
                    </span>
                )}
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-yellow-400 group-hover:text-stone-900 group-hover:border-yellow-400 transition-all">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>

            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
        </div>
    );
}


// --- SOURCE: src/components/TicketItemCard.tsx ---




interface TicketItemCardProps {
    item: RequestItem;
    children?: React.ReactNode;
}

function TicketItemCard({ item, children }: TicketItemCardProps) {
    const [selectedCat, setSelectedCat] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl hover:shadow-yellow-100/20 transition-all duration-300">
            {/* Header / ID Bar */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-50/80 to-white border-b border-slate-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <span className="mt-1 w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-stone-900 font-black text-sm shadow-md shadow-yellow-200 flex-shrink-0">
                        #{item.item_number}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {item.categories?.map((cat, idx) => {
                                const isActive = selectedCat === cat;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedCat(isActive ? null : cat as string)}
                                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border shadow-sm ${isActive
                                            ? "bg-stone-900 border-stone-900 text-white transform scale-105"
                                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            }) ?? (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 border border-slate-200">
                                        Uncategorized
                                    </span>
                                )}
                        </div>
                        <h4 className="text-base font-black text-slate-800 leading-snug line-clamp-2 pr-4" title={item.description}>
                            {item.description}
                        </h4>
                    </div>
                </div>
                <div className="mt-1 flex-shrink-0">
                    <StatusBadge status={item.status} />
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


// --- SOURCE: src/components/RichTextEditor.tsx ---





interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    leadingActions?: React.ReactNode;
    trailingActions?: React.ReactNode;
}

function RichTextEditor({ value, onChange, placeholder, className, leadingActions, trailingActions }: RichTextEditorProps) {
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

                    <ToolbarButton icon={LinkIcon} onClick={() => { const url = prompt("Enter URL:"); if (url) execCommand("createLink", url); }} title="Link" />
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


// --- SOURCE: src/app/login/page.tsx ---







function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState("client");
    const { login } = useAuth();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, selectedRole as any);

            if (selectedRole === 'client') router.push('/');
            else if (selectedRole === 'admin') router.push('/admin');
            else if (selectedRole === 'reviewer') router.push('/reviewer');
            else if (selectedRole === 'developer') router.push('/reviewer');
            else router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh] relative overflow-hidden py-20">
            {/* Dynamic Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-lg z-10 px-6">
                <form onSubmit={handleLogin} className="glass p-10 rounded-3xl shadow-2xl border border-white/40">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-2xl shadow-yellow-100 mb-6 -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-4xl font-black text-stone-900 tracking-tighter">US</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="text-xs text-slate-500 font-medium mt-2">(Dummy Mode)</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Email</label>
                            <input
                                placeholder="name@organization.com"
                                className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Password</label>
                            <input
                                placeholder="••••••••"
                                type="password"
                                className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Access Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="client">Client</option>
                                <option value="admin">System Admin</option>
                                <option value="reviewer">Peer Reviewer</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-stone-900 text-white font-black px-4 py-3.5 rounded-xl mt-10 hover:bg-stone-800 transition-all active:scale-[0.98] shadow-xl shadow-yellow-100 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-sm tracking-tight">Login</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            New User?{" "}
                            <Link href="/signup" className="text-yellow-600 hover:text-yellow-700 font-black hover:underline underline-offset-8 transition-all">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- SOURCE: src/app/signup/page.tsx ---







function SignupPage() {
    const router = useRouter();
    const { refreshRole } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState("client");
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuth();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            await signup(email, role as any);

            if (role === 'admin') router.push('/admin');
            else if (role === 'reviewer') router.push('/reviewer');
            else router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh] relative overflow-hidden py-20">
            {/* Dynamic Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-lg z-10 px-6">
                <form onSubmit={handleSignup} className="glass p-10 rounded-3xl shadow-2xl border border-white/40">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-2xl shadow-yellow-100 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-4xl font-black text-stone-900 tracking-tighter">US</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Begin Your Journey</h2>
                        <p className="text-xs text-slate-500 font-medium mt-2">Join the next generation of update management</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Email Address</label>
                            <input
                                placeholder="name@organization.com"
                                className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Confirm Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 shadow-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 ml-1 tracking-widest transition-colors group-focus-within:text-yellow-600">Department Role</label>
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-3.5 bg-white/80 border border-slate-200 rounded-xl focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-sm text-slate-700 appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="client">Client</option>
                                    <option value="reviewer">Peer Reviewer</option>
                                    <option value="admin">System Admin</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-400 text-stone-900 font-black px-4 py-3.5 rounded-xl mt-10 hover:bg-yellow-500 transition-all active:scale-[0.98] shadow-xl shadow-yellow-100 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-3 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="text-sm tracking-tight">Sign Up</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-black hover:underline underline-offset-8 transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- SOURCE: src/app/page.tsx ---












function ClientDashboardPage() {
    const { role, isLoading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!isLoading && role) {
            if (role === 'admin') router.replace('/admin');
            else if (role === 'reviewer') router.replace('/reviewer');
        }
    }, [role, isLoading, router]);


    return (
        <ProtectedRoute allow={["client", "admin", "reviewer"]}>
            {isLoading || role !== 'client' ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
            ) : (
                <ClientDashboardContent />
            )}
        </ProtectedRoute>
    );
}

function ClientDashboardContent() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("DateDesc");
    const router = useRouter();
    const [page, setPage] = useState(1);


    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequests() {
                try {
                    const data = await getRequests(user?.id, 'client');
                    setRequests(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (user?.id) fetchRequests();
        }, 2000);
        return () => clearTimeout(timer);
    }, [user?.id]);

    useEffect(() => {
        setPage(1);
    }, [filter, query, sort]);


    function filtered() {
        let arr = [...requests];

        // 1. Status Filter
        if (filter !== "All") arr = arr.filter((r) => r.status === filter);

        // 2. Search Query
        if (query) {
            const q = query.toLowerCase();
            arr = arr.filter((r) =>
                (r.title + (r.profiles?.email || "") + r.id).toLowerCase().includes(q)
            );
        }

        // 3. Sorting
        arr.sort((a, b) => {
            let diff = 0;
            if (sort === "DateDesc") {
                diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else if (sort === "DateAsc") {
                diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else if (sort === "Urgency") {
                const priority: Record<string, number> = { "Urgent": 2, "Normal": 1 };
                const pA = priority[a.urgency] || 0;
                const pB = priority[b.urgency] || 0;
                diff = pB - pA;
                if (diff === 0) {
                    diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
            }

            // Secondary sort by ID for stability
            if (diff === 0) return a.id.localeCompare(b.id);
            return diff;
        });

        return arr;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const filteredRequests = filtered();

    return (
        <div className="space-y-6 pb-6">
            {/* Header Row: Title & Controls */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Requests</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        {filteredRequests.length} of {requests.length} shown
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative group min-w-[300px]">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            placeholder="Search by page, description..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm font-medium placeholder:text-slate-400 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none w-full bg-white border border-slate-200 rounded-xl text-sm font-bold pl-4 pr-9 py-2 text-slate-600 focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer transition-all shadow-sm"
                            >
                                <option value="Urgency">All urgency</option>
                                <option value="DateDesc">Newest</option>
                                <option value="DateAsc">Oldest</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none w-full bg-white border border-slate-200 rounded-xl text-sm font-bold pl-4 pr-9 py-2 text-slate-600 focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer transition-all shadow-sm"
                            >
                                <option value="All">All</option>
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Info Needed">Info Needed</option>
                                <option value="Peer Review">Peer Review</option>
                                <option value="Complete">Complete</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/requests/new")}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-stone-900 rounded-xl transition-all shadow-sm active:scale-95 text-sm font-bold whitespace-nowrap"
                            title="Create New Request"
                        >
                            <PlusIcon />
                            <span>Create Ticket</span>
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Main Content Box */}
            <div className="bg-white border border-slate-200 rounded-3xl min-h-[400px] relative overflow-hidden shadow-sm">
                {filteredRequests.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">No requests found</h3>
                        <p className="text-sm text-slate-500 font-medium">Try clearing search or changing filters.</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-4 grid grid-cols-1 gap-1 flex-1">
                            {filteredRequests.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((r) => (
                                <RequestCard
                                    key={r.id}
                                    request={r}
                                    onOpen={() => router.push(`/requests/${r.id}`)}
                                />
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        {filteredRequests.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Previous
                                </button>
                                <span className="text-xs font-bold text-slate-400">
                                    Page {page} of {Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(Math.ceil(filteredRequests.length / ITEMS_PER_PAGE), p + 1))}
                                    disabled={page >= Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


// --- SOURCE: src/app/requests/new/page.tsx ---








function NewRequestPage() {
    return (
        <ProtectedRoute allow={["client"]}>
            <NewRequestForm />
        </ProtectedRoute>
    );
}

interface RequestItemForm {
    categories: CategoryType[];
    dynamicValues: Record<string, string>;
}

function NewRequestForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [urgency, setUrgency] = useState("Normal");
    const [items, setItems] = useState<RequestItemForm[]>([
        { categories: ["Text"], dynamicValues: {} }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addItem = () => {
        setItems([...items, { categories: ["Text"], dynamicValues: {} }]);
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

    const toggleCategory = (index: number, category: CategoryType) => {
        const item = items[index];
        const current = new Set(item.categories);
        if (current.has(category)) {
            if (current.size > 1) current.delete(category); // Prevent empty
        } else {
            current.add(category);
        }
        updateItem(index, { categories: Array.from(current) });
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
            const allFields = item.categories.flatMap(cat =>
                DYNAMIC_CATEGORIES.find(c => c.id === cat)?.fields || []
            );
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
                categories: it.categories,
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
                    </div>
                </div>

                <div className="space-y-8">
                    {items.map((item, index) => {
                        const allFields = item.categories.flatMap(cat =>
                            DYNAMIC_CATEGORIES.find(c => c.id === cat)?.fields || []
                        );
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
                                            const isSelected = item.categories.includes(c.id);
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => toggleCategory(index, c.id)}
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


// --- SOURCE: src/app/requests/[id]/page.tsx ---











function ClientDetailPage() {
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

    async function sendReply() {
        if ((!reply.trim() && !attachment) || !user || !request) return;
        setIsSending(true);
        try {
            await sendMessage(request.id, user.id, reply, false, attachment || undefined, 'client', user.email || 'Client');
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

    async function handleReopen() {
        if (!request || !user) return;
        setIsSending(true);
        try {
            await updateRequestStatus(request.id, "Reopened", user.email || 'Client');
            await sendMessage(request.id, user.id, "Client reopened the ticket.", false, undefined, 'client', user.email || 'Client');
            const updated = await getRequestById(id, user.id, 'client');
            setRequest(updated);
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
                <div className="text-right">
                    <StatusBadge status={request.status} />
                    {request.urgency === "Urgent" && (
                        <div className="text-red-600 mt-2 font-semibold">Marked Urgent</div>
                    )}
                    {request.status === "Complete" && (
                        <button
                            onClick={handleReopen}
                            disabled={isSending}
                            className="mt-2 px-4 py-2 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-lg hover:bg-red-200 transition-colors"
                        >
                            {isSending ? "Reopening..." : "Reopen Ticket"}
                        </button>
                    )}
                </div>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200 shadow-sm">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Support Team</h3>
                                <p className="text-xs text-slate-500">Typically replies within 1 hour</p>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
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
                                                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                            >
                                                <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                                    <div className="flex items-center gap-2 mb-1 px-1">
                                                        {!isMe && (
                                                            <span className="text-[10px] font-bold text-yellow-600">
                                                                Support Team
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

                                                    <span className="text-[9px] text-yellow-600 mt-1 px-1 select-none">
                                                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
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
                        </div>

                        <div className="bg-white p-4 border-t border-slate-200">
                            {attachment && (
                                <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-700">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-yellow-900 truncate max-w-[200px]">{attachment.name}</span>
                                    </div>
                                    <button onClick={() => setAttachment(null)} className="p-1 hover:bg-yellow-200 rounded-full text-yellow-600 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}
                            <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                <RichTextEditor
                                    value={reply}
                                    onChange={setReply}
                                    placeholder="Type a message..."
                                    className="min-h-[80px]"
                                    leadingActions={
                                        <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        </label>
                                    }
                                    trailingActions={
                                        <button
                                            onClick={sendReply}
                                            disabled={isSending || (!reply.trim() && !attachment)}
                                            className="px-4 py-2 bg-yellow-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                        >
                                            {isSending ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                <>
                                                    SEND
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                </>
                                            )}
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 mb-4 border-b pb-2">Ticket Items</h3>
                        <div className="space-y-4">
                            {request.items?.map(item => (
                                <TicketItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
}


// --- SOURCE: src/app/admin/page.tsx ---












function AdminDashboardPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    );
}

function AdminDashboard() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<Request[]>([]);
    const [reviewers, setReviewers] = useState<{ id: string, email: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selected, setSelected] = useState(new Set<string>());
    const [massReviewerId, setMassReviewerId] = useState("");
    const [filters, setFilters] = useState({
        status: "All",
        client: "All",
        urgency: "All",
        reviewer: "All",
        school: "All",
        category: "All",
        active: "All",
    });
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchData() {
                try {
                    const [reqData, revData] = await Promise.all([
                        getRequests(user?.id, 'admin'),
                        getReviewers()
                    ]);
                    setRequests(reqData);
                    setReviewers(revData);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (user?.id) fetchData();
        }, 2000);
        return () => clearTimeout(timer);
    }, [user?.id]);

    async function refreshData() {
        setIsLoading(true);
        try {
            const data = await getRequests(user?.id, 'admin');
            setRequests(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function toggle(id: string) {
        const s = new Set(selected);
        if (s.has(id)) s.delete(id);
        else s.add(id);
        setSelected(s);
    }

    async function handleBulkAction(action: 'In Progress' | 'Complete' | 'Peer Review') {
        const ids = Array.from(selected);
        if (ids.length === 0) return;

        setIsLoading(true);
        try {
            await Promise.all(ids.map(id => updateRequestStatus(id, action, user?.email || 'Admin')));
            await refreshData();
            setSelected(new Set());
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleMassAssign() {
        if (!massReviewerId) return;
        const ids = Array.from(selected);
        if (ids.length === 0) return;

        setIsLoading(true);
        try {
            await bulkAssignRequests(ids, massReviewerId, user?.email || 'Admin');
            // Move all to Peer Review status and notify
            await Promise.all(ids.map(async (id) => {
                await updateRequestStatus(id, 'Peer Review', user?.email || 'Admin');
                await sendMessage(id, user!.id, `System: Request assigned to reviewer and moved to Peer Review.`, true, undefined, 'admin', user?.email || 'Admin');
            }));
            await refreshData();
            setSelected(new Set());
            setMassReviewerId("");
            alert(`Successfully assigned and moved ${ids.length} requests to Peer Review.`);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleIndividualAssign(requestId: string, reviewerId: string) {
        setIsLoading(true);
        try {
            await assignRequest(requestId, reviewerId || null, user?.email || 'Admin');
            if (reviewerId) {
                await updateRequestStatus(requestId, 'Peer Review', user?.email || 'Admin');
                await sendMessage(requestId, user!.id, `System: Request assigned to reviewer and moved to Peer Review.`, true, undefined, 'admin', user?.email || 'Admin');
            }
            await refreshData();
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const visible = requests.filter((r) => {
        // Dynamic filters
        if (filters.school !== "All" && r.profiles?.school !== filters.school) return false;
        if (filters.client !== "All" && r.profiles?.email !== filters.client) return false;
        if (filters.status !== "All" && r.status !== filters.status) return false;
        if (filters.urgency !== "All" && r.urgency !== filters.urgency) return false;
        if (filters.category !== "All" && !r.items?.some(i => i.categories?.includes(filters.category as any))) return false;

        // State filter (Active vs Completed)
        if (filters.active === 'Active' && r.status === 'Complete') return false;
        if (filters.active === 'Completed' && r.status !== 'Complete') return false;

        if (filters.reviewer !== "All") {
            if (filters.reviewer === "Unassigned") return !r.reviewer_id;
            if (r.reviewer?.email !== filters.reviewer) return false;
        }
        return true;
    });

    const uniqueSchools = Array.from(new Set(requests.map(r => r.profiles?.school).filter(Boolean)));
    const uniqueClients = Array.from(new Set(requests.map(r => r.profiles?.email).filter(Boolean)));
    const categories = ["Image", "Video", "Audio", "Text", "Document", "Other"];

    if (isLoading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1.5 text-slate-800">
                    <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600">Admin Console</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/admin/reports"
                        className="px-5 py-2 bg-white text-slate-800 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all font-bold text-xs shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <BarChart3 className="w-4 h-4 text-yellow-500" />
                        View Analytics
                    </Link>
                    <button
                        onClick={() => handleBulkAction('Peer Review')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-5 py-2 bg-amber-500 text-stone-900 rounded-xl hover:bg-amber-600 disabled:opacity-40 transition-all shadow-md shadow-amber-100 font-bold text-xs active:scale-95"
                    >
                        Send to Review
                    </button>
                    <button
                        onClick={() => handleBulkAction('Complete')}
                        disabled={selected.size === 0 || isLoading}
                        className="px-5 py-2 bg-stone-900 text-white rounded-xl hover:bg-stone-800 disabled:opacity-40 transition-all shadow-md shadow-stone-200 font-bold text-xs active:scale-95"
                    >
                        Bulk Close
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <section className="col-span-1 lg:col-span-5 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-1">
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Total</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Active</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.filter(r => r.status !== 'Complete').length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Review</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.filter(r => r.status === 'Peer Review').length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-0.5">Urgent</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{requests.filter(r => r.urgency === 'Urgent' && r.status !== 'Complete').length}</p>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-4 bg-white/50 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/60 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">School</label>
                        <select
                            value={filters.school}
                            onChange={(e) => setFilters({ ...filters, school: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Schools</option>
                            {uniqueSchools.map(school => (
                                <option key={school} value={school!}>{school}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option>New</option>
                            <option>In Progress</option>
                            <option>Info Needed</option>
                            <option>Peer Review</option>
                            <option>Complete</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Urgency</label>
                        <select
                            value={filters.urgency}
                            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">Any Priority</option>
                            <option>Normal</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[140px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">State</label>
                        <select
                            value={filters.active}
                            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="All">All Items</option>
                            <option value="Active">Active Only</option>
                            <option value="Completed">Completed Only</option>
                        </select>
                    </div>
                </section>

                <section className="bg-yellow-50/50 p-5 rounded-3xl border border-yellow-100 flex flex-col justify-center">
                    <label className="text-[10px] font-black uppercase text-yellow-600 mb-2 ml-1 tracking-widest">Mass Action</label>
                    <div className="flex gap-2">
                        <select
                            value={massReviewerId}
                            onChange={(e) => setMassReviewerId(e.target.value)}
                            disabled={selected.size === 0}
                            className="flex-1 bg-white border border-yellow-200 rounded-xl text-xs font-bold px-3 py-2 text-slate-700 focus:ring-2 focus:ring-yellow-400/10 outline-none disabled:opacity-50 appearance-none shadow-sm"
                        >
                            <option value="">Assign To...</option>
                            {reviewers.map(rev => (
                                <option key={rev.id} value={rev.id}>{rev.email.split('@')[0]}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleMassAssign}
                            disabled={selected.size === 0 || !massReviewerId}
                            className="bg-yellow-400 text-stone-900 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-yellow-500 disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-yellow-100"
                        >
                            Go
                        </button>
                    </div>
                </section>
            </div>

            {
                error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                        Error: {error}
                    </div>
                )
            }

            <div className="card-premium overflow-hidden bg-white rounded-[2.5rem] border-slate-200 shadow-xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto min-w-[900px]">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="px-6 py-5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-400"
                                        onChange={(e) => {
                                            if (e.target.checked) setSelected(new Set(visible.map(v => v.id)));
                                            else setSelected(new Set());
                                        }}
                                        checked={selected.size > 0 && selected.size === visible.length}
                                    />
                                </th>
                                <th className="px-6 py-5">Request</th>
                                <th className="px-6 py-5">Client</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Priority</th>
                                <th className="px-6 py-5">SLA Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {visible.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center text-slate-400 font-bold italic text-sm">
                                        No matching operational requests identified.
                                    </td>
                                </tr>
                            ) : (
                                visible.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((r) => {
                                    const getSLAStatus = (slaDate: string | null, status: string) => {
                                        if (status === 'Complete') return { label: 'Met', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
                                        if (!slaDate) return { label: 'No SLA', color: 'bg-slate-50 text-slate-400 border-slate-100' };

                                        const now = new Date();
                                        const due = new Date(slaDate);
                                        const diff = due.getTime() - now.getTime();

                                        if (diff < 0) return { label: 'Breached', color: 'bg-rose-50 text-rose-600 border-rose-100' };
                                        if (diff < 3600000 * 24) return { label: 'Due Soon', color: 'bg-amber-50 text-amber-600 border-amber-100' };
                                        return { label: 'On Track', color: 'bg-blue-50 text-blue-600 border-blue-100' };
                                    };

                                    const sla = getSLAStatus(r.sla_due_date, r.status);

                                    return (
                                        <tr
                                            key={r.id}
                                            className={`hover:bg-slate-50/80 transition-all group ${r.urgency === "Urgent" ? "bg-red-50/30" : ""}`}
                                        >
                                            <td className="px-6 py-5">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-yellow-500 focus:ring-yellow-400"
                                                    checked={selected.has(r.id)}
                                                    onChange={() => toggle(r.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm group-hover:text-yellow-600 transition-colors">{r.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {r.id.slice(0, 8)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 ml-auto">
                                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-400">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                            </svg>
                                                            {r.total_messages || 0}
                                                        </div>
                                                        {r.unseen_count! > 0 && (
                                                            <span className="bg-yellow-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                                                {r.unseen_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-bold text-slate-500">{r.profiles?.email.split('@')[0]}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{r.profiles?.email}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${r.urgency === "Urgent"
                                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                                    : "bg-slate-50 text-slate-400 border-slate-100"
                                                    }`}>
                                                    {r.urgency}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border inline-block whitespace-nowrap ${sla.color}`}>
                                                    {sla.label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    href={`/admin/requests/${r.id}`}
                                                    className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-yellow-600 hover:border-yellow-600 hover:bg-yellow-50 transition-all shadow-sm"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination Controls */}
            {visible.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-bold text-slate-400">
                        Page {page} of {Math.ceil(visible.length / ITEMS_PER_PAGE)}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(Math.ceil(visible.length / ITEMS_PER_PAGE), p + 1))}
                        disabled={page >= Math.ceil(visible.length / ITEMS_PER_PAGE)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}


// --- SOURCE: src/app/admin/reports/page.tsx ---








function AdminReportsPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminReports />
        </ProtectedRoute>
    );
}

function AdminReports() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchData() {
                try {
                    const data = await getRequests(undefined, 'admin');
                    setRequests(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchData();
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    // --- Data Processing ---

    // 1. Requests by School (Volume & Workload)
    const schoolStats = requests.reduce((acc, r) => {
        const schoolName = r.profiles?.school || "Unknown School";
        if (!acc[schoolName]) {
            acc[schoolName] = { count: 0, effort: 0, items: 0 };
        }
        acc[schoolName].count += 1;
        r.items?.forEach(item => {
            acc[schoolName].items += 1;
            acc[schoolName].effort += (item.estimated_effort || 0);
        });
        return acc;
    }, {} as Record<string, { count: number; effort: number; items: number }>);

    const sortedSchools = Object.entries(schoolStats).sort((a, b) => b[1].count - a[1].count);

    // 2. Ticket Volume Over Time (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const volumeOverTime = last7Days.map(date => ({
        date,
        count: requests.filter(r => r.created_at.startsWith(date)).length
    }));

    const maxVolume = Math.max(...volumeOverTime.map(v => v.count), 1);

    // 3. Status Distribution
    const statusCounts = {
        New: requests.filter(r => r.status === 'New').length,
        'In Progress': requests.filter(r => ['In Progress', 'Peer Review', 'Info Needed'].includes(r.status)).length,
        Complete: requests.filter(r => r.status === 'Complete').length,
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-stone-900" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 transition-all">
                        Operations Analytics
                    </h1>
                </div>
                <p className="text-slate-500 font-medium max-w-2xl">
                    Performance tracking and workload distribution across all schools and campuses.
                </p>
            </header>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Tickets" value={requests.length} icon={<BarChart3 className="w-5 h-5" />} color="yellow" />
                <StatCard title="Active Workload" value={statusCounts['In Progress']} icon={<Clock className="w-5 h-5" />} color="blue" />
                <StatCard title="High Urgency" value={requests.filter(r => r.urgency === 'Urgent').length} icon={<AlertCircle className="w-5 h-5" />} color="rose" />
                <StatCard title="Avg Resolution Time" value="1.2 Days" icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* School Leaderboard */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                                <School className="w-4 h-4 text-yellow-500" />
                                Workload per School
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter">Maintenance Distribution</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sortedSchools.map(([name, stats], idx) => (
                            <div key={name} className="group">
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center text-[9px] font-black text-slate-400 border border-slate-100">{idx + 1}</span>
                                        <span className="text-xs font-bold text-slate-700">{name}</span>
                                    </div>
                                    <div className="text-right leading-none">
                                        <span className="text-[10px] font-black text-yellow-600 block">{stats.count} Tickets</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stats.effort} Total Hours</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stats.count / (sortedSchools[0][1].count || 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-200/50"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ticket Volume Chart */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6 flex flex-col">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                            <TrendingUp className="w-4 h-4 text-yellow-500" />
                            Trend Analysis
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter">Last 7 Days Activity</p>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-2 min-h-[180px] pb-2 px-2">
                        {volumeOverTime.map((v, i) => (
                            <div key={v.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all bg-stone-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg pointer-events-none">
                                    {v.count}
                                </div>
                                <motion.div
                                    initial={{ height: 4 }}
                                    animate={{ height: `${Math.max((v.count / maxVolume) * 100, 2)}%` }} // Ensure at least 2% height
                                    style={{ height: `${(v.count / maxVolume) * 100}%` }} // Fallback
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className={`w-full max-w-[30px] rounded-t-lg min-h-[4px] transition-all ${v.count === maxVolume && v.count > 0 ? 'bg-yellow-400' : 'bg-slate-100 group-hover:bg-yellow-200'}`}
                                />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter rotate-0 mt-2">
                                    {new Date(v.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Top Clients */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Top Clients</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">By Request Volume</p>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(requests.reduce((acc, r) => {
                            const email = r.profiles?.email || 'Unknown';
                            acc[email] = (acc[email] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>))
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([email, count], i) => (
                                <div key={email} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                                            #{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-700">{email.split('@')[0]}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-slate-800">{count}</span>
                                </div>
                            ))}
                    </div>
                </section>

                {/* Team Workload */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Team Workload</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Requests</p>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(requests.filter(r => r.status !== 'Complete').reduce((acc, r) => {
                            const reviewer = r.reviewer_id ? `Reviewer ${r.reviewer_id.slice(-4)}` : 'Unassigned';
                            acc[reviewer] = (acc[reviewer] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)).map(([reviewer, count], i) => (
                            <div key={reviewer} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                                    <span>{reviewer}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / (requests.length || 1)) * 100}%` }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status Breakdown */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Status Breakdown</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Distribution</p>
                    </div>
                    <div className="space-y-3">
                        {['New', 'In Progress', 'Peer Review', 'Info Needed', 'Complete'].map(status => {
                            const count = requests.filter(r => r.status === status).length;
                            const percentage = Math.round((count / (requests.length || 1)) * 100);
                            return (
                                <div key={status} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${status === 'New' ? 'bg-blue-400' :
                                        status === 'Complete' ? 'bg-emerald-400' :
                                            status === 'Peer Review' ? 'bg-amber-400' : 'bg-slate-400'
                                        }`} />
                                    <span className="text-[10px] font-bold text-slate-600 w-20">{status}</span>
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className={`h-full ${status === 'New' ? 'bg-blue-400' :
                                                status === 'Complete' ? 'bg-emerald-400' :
                                                    status === 'Peer Review' ? 'bg-amber-400' : 'bg-slate-400'
                                                }`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-800">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Urgency Distribution */}
                <section className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Urgency</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Priority Split</p>
                    </div>
                    <div className="flex items-center justify-center h-48 relative">
                        {/* Simple Donut Chart Representation */}
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                                {/* Background Circle */}
                                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                                {/* Urgent Segment */}
                                <motion.path
                                    initial={{ strokeDasharray: "0, 100" }}
                                    animate={{ strokeDasharray: `${(requests.filter(r => r.urgency === 'Urgent').length / (requests.length || 1)) * 100}, 100` }}
                                    className="text-rose-500"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-slate-800">{requests.filter(r => r.urgency === 'Urgent').length}</span>
                                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wide">Urgent</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-[-10px]">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-[10px] font-bold text-slate-500">Urgent</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                            <span className="text-[10px] font-bold text-slate-500">Normal</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}


function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
    const colorMap: any = {
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        rose: "bg-rose-50 text-rose-700 border-rose-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return (
        <div className={`p-4 rounded-2xl border ${colorMap[color]} shadow-sm flex items-center justify-between`}>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">{title}</p>
                <p className="text-2xl font-black tracking-tight">{value}</p>
            </div>
            <div className="p-2 bg-white/60 rounded-xl shadow-sm">
                {icon}
            </div>
        </div>
    );
}


// --- SOURCE: src/app/admin/requests/[id]/page.tsx ---















function AdminDetailPage() {
    return (
        <ProtectedRoute allow={["admin"]}>
            <AdminRequestDetail />
        </ProtectedRoute>
    );
}

function AdminRequestDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState("");
    const [activeTab, setActiveTab] = useState<'client' | 'internal'>('client');
    const [clientMessage, setClientMessage] = useState("");
    const [clientAttachment, setClientAttachment] = useState<Attachment | null>(null);
    const [internalNote, setInternalNote] = useState("");
    const [internalAttachment, setInternalAttachment] = useState<Attachment | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [reviewers, setReviewers] = useState<{ id: string, email: string }[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [itemsPage, setItemsPage] = useState(1);
    const [showAllAudit, setShowAllAudit] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, 'admin');
                    setRequest(data);
                    setStatus(data.status);
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

    const handleItemStatusUpdate = async (itemId: string, newStatus: string) => {
        if (!user || !request) return;
        setIsUpdating(true);
        try {
            await updateItemStatus(request.id, itemId, newStatus, user.email || 'Admin');
            await sendMessage(request.id, user.id, `Item status updated to: ${newStatus}`, true, undefined, 'admin', user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleItemEffortUpdate = async (itemId: string, effort: number, dueDate: string | null) => {
        if (!user || !request) return;
        try {
            await updateItemEffortAndDate(request.id, itemId, effort, dueDate, user.email || 'Admin');
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const handleItemAssignment = async (itemId: string, reviewerId: string | null) => {
        if (!user || !request) return;
        setIsUpdating(true);
        try {
            await assignItem(request.id, itemId, reviewerId, user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };


    async function handleStatusChange(newStatus: string) {
        if (!request || !user) return;

        if (newStatus === "Complete") {
            setShowCompleteConfirm(true);
            return;
        }

        setIsUpdating(true);
        try {
            await updateRequestStatus(request.id, newStatus, user.email || 'Admin');
            await sendMessage(request.id, user.id, `Global Ticket Status updated to: ${newStatus}`, false, undefined, 'admin', user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            setStatus(newStatus);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function confirmComplete() {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            const newStatus = "Complete";
            await updateRequestStatus(request.id, newStatus, user.email || 'Admin');
            await sendMessage(request.id, user.id, `Ticket marked as COMPLETED. All items finalized.`, false, undefined, 'admin', user.email || 'Admin');
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
            setStatus(newStatus);
            setShowCompleteConfirm(false);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendMessageToClient() {
        if ((!clientMessage.trim() && !clientAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, clientMessage, false, clientAttachment || undefined, 'admin', user.email || 'Admin');
            setClientMessage("");
            setClientAttachment(null);
            setShowConfirm(false);
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
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
            await sendMessage(request.id, user.id, internalNote, true, internalAttachment || undefined, 'admin', user.email || 'Admin');
            setInternalNote("");
            setInternalAttachment(null);
            const updated = await getRequestById(id, user.id, 'admin');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
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
                    <h1 className="text-2xl font-bold">Admin — {request.title}</h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <StatusBadge status={request.status} />
                    <div className="text-sm mt-2 font-medium">
                        Urgency: <span className={request.urgency === 'Urgent' ? 'text-red-600 font-bold' : ''}>{request.urgency}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shadow-sm">
                                    <span className="text-xs font-black">{request.profiles?.email?.substring(0, 2).toUpperCase() || 'CL'}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{request.profiles?.email}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${request.profiles?.role === 'client' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">{request.profiles?.role || 'Client'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${request.status === 'Complete' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    {request.status}
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            <div className="flex justify-center mb-6">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {request.messages?.map((m) => {
                                const isMe = m.user_id === user?.id;
                                const isInternal = m.is_internal;

                                return (
                                    <div
                                        key={m.id}
                                        className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                {!isMe && (
                                                    <span className="text-[10px] font-bold text-yellow-600">
                                                        {m.profiles?.email.split('@')[0]}
                                                    </span>
                                                )}
                                                {isInternal && (
                                                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black rounded uppercase">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                        Internal
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${isInternal
                                                    ? "bg-amber-50 text-slate-800 border-amber-200"
                                                    : isMe
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
                                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${isMe && !isInternal
                                                                    ? "bg-yellow-50 border-yellow-100 hover:bg-yellow-100"
                                                                    : "bg-white border-slate-100 hover:border-slate-300"
                                                                    }`}
                                                            >
                                                                <div className={`w-8 h-8 flex items-center justify-center rounded ${isMe && !isInternal ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-xs font-bold truncate ${isMe && !isInternal ? "text-stone-900" : "text-slate-700"}`}>{att.name}</p>
                                                                    <p className={`text-[9px] uppercase ${isMe && !isInternal ? "text-slate-400" : "text-slate-400"}`}>Attachment</p>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <span className="text-[9px] text-yellow-600 mt-1 px-1 select-none">
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Footer */}
                        <div className={`p-4 border-t border-slate-200 transition-colors ${activeTab === 'internal' ? 'bg-amber-50/30' : 'bg-white'}`}>
                            {/* Mode Toggle Pills */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                                    <button
                                        onClick={() => setActiveTab('client')}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ${activeTab === 'client' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'client' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        Reply to Client
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('internal')}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ${activeTab === 'internal' ? 'bg-white text-amber-700 shadow-sm ring-1 ring-amber-900/5' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'internal' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                        Internal Note
                                    </button>
                                </div>
                            </div>

                            {/* Dynamic Input Area */}
                            {activeTab === 'client' ? (
                                <div className="space-y-3">
                                    {clientAttachment && (
                                        <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-700">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </div>
                                                <span className="text-xs font-bold text-yellow-900 truncate max-w-[200px]">{clientAttachment.name}</span>
                                            </div>
                                            <button onClick={() => setClientAttachment(null)} className="p-1 hover:bg-yellow-200 rounded-full text-yellow-600 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                        <RichTextEditor
                                            value={clientMessage}
                                            onChange={setClientMessage}
                                            placeholder="Type a message to client..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setClientAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={() => setShowConfirm(true)}
                                                    disabled={isUpdating || (!clientMessage.trim() && !clientAttachment)}
                                                    className="px-4 py-2 bg-yellow-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                                >
                                                    {isUpdating ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                        <>
                                                            SEND
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {internalAttachment && (
                                        <div className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-amber-700">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </div>
                                                <span className="text-xs font-bold text-amber-900 truncate max-w-[200px]">{internalAttachment.name}</span>
                                            </div>
                                            <button onClick={() => setInternalAttachment(null)} className="p-1 hover:bg-amber-200 rounded-full text-amber-600 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                        <RichTextEditor
                                            value={internalNote}
                                            onChange={setInternalNote}
                                            placeholder="Add private note..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer transition-all" title="Attach to Internal">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setInternalAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={sendInternalNote}
                                                    disabled={isUpdating || (!internalNote.trim() && !internalAttachment)}
                                                    className="px-4 py-2 bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:bg-amber-100 disabled:text-amber-300 transition-all shadow-md hover:shadow-lg shadow-amber-100 active:scale-95 flex items-center gap-2"
                                                >
                                                    {isUpdating ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                        <>
                                                            SAVE NOTE
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="space-y-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500" />

                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Ticket Management</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Override global settings</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3 text-yellow-500" />
                                        Global Status
                                    </label>
                                    <StatusBadge status={status} size="sm" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={isUpdating}
                                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-slate-700 text-sm appearance-none cursor-pointer group-hover:border-slate-300"
                                    >
                                        {status !== 'Complete' && (
                                            <>
                                                <option>New</option>
                                                <option>In Progress</option>
                                                <option>Info Needed</option>
                                                <option>Peer Review</option>
                                            </>
                                        )}
                                        {(status === 'Complete' || status === 'Reopened') && <option>Reopened</option>}
                                        <option>Complete</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-yellow-500" />
                                        Global SLA Due Date
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={request.sla_due_date ? new Date(request.sla_due_date).toISOString().slice(0, 16) : ""}
                                        onChange={async (e) => {
                                            const newDate = e.target.value ? new Date(e.target.value).toISOString() : null;
                                            await updateRequestSLA(request.id, newDate);
                                            const updated = await getRequestById(id, user?.id, 'admin');
                                            setRequest(updated);
                                        }}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none font-bold text-slate-700 text-sm group-hover:border-slate-300"
                                    />
                                </div>

                                {request.sla_due_date && (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                        {new Date(request.sla_due_date) < new Date() ? (
                                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl">
                                                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                                                    <AlertTriangle className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">SLA BREACHED</p>
                                                    <p className="text-[9px] font-bold text-red-400 mt-1 uppercase">Immediate action required</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <Timer className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">ON TRACK</p>
                                                    <p className="text-[9px] font-bold text-emerald-500 mt-1 uppercase">
                                                        {Math.floor((new Date(request.sla_due_date).getTime() - Date.now()) / 3600000)}h {Math.floor(((new Date(request.sla_due_date).getTime() - Date.now()) % 3600000) / 60000)}m remaining
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Item Specifications</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Manage individual request components</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                <span className="text-[10px] font-black text-slate-500 uppercase">
                                    {((itemsPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(itemsPage * ITEMS_PER_PAGE, request.items?.length || 0)} <span className="text-slate-300 mx-1">/</span> {request.items?.length || 0}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {request.items?.slice((itemsPage - 1) * ITEMS_PER_PAGE, itemsPage * ITEMS_PER_PAGE).map(item => (
                                <TicketItemCard key={item.id} item={item}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Trello URL</label>
                                                <input
                                                    type="url"
                                                    value={item.trello_url || ""}
                                                    onChange={async (e) => {
                                                        await updateItemExternalLinks(id, item.id, e.target.value || null, item.filemaker_url || null, user?.email || 'Admin');
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-medium"
                                                    placeholder="https://trello.com/..."
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">FileMaker Link</label>
                                                <input
                                                    type="url"
                                                    value={item.filemaker_url || ""}
                                                    onChange={async (e) => {
                                                        await updateItemExternalLinks(id, item.id, item.trello_url || null, e.target.value || null, user?.email || 'Admin');
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-medium"
                                                    placeholder="fmp://..."
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Effort (hrs)</label>
                                                <input
                                                    type="number"
                                                    value={item.estimated_effort}
                                                    onChange={(e) => handleItemEffortUpdate(item.id, parseInt(e.target.value) || 0, item.due_date)}
                                                    onBlur={async () => {
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Due Date</label>
                                                <input
                                                    type="date"
                                                    value={item.due_date ? item.due_date.split('T')[0] : ""}
                                                    onChange={(e) => handleItemEffortUpdate(item.id, item.estimated_effort, e.target.value ? new Date(e.target.value).toISOString() : null)}
                                                    onBlur={async () => {
                                                        const updated = await getRequestById(id, user?.id, 'admin');
                                                        setRequest(updated);
                                                    }}
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                                    disabled={request.status === 'Complete'}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Status</label>
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleItemStatusUpdate(item.id, e.target.value)}
                                                disabled={request.status === 'Complete'}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option>New</option>
                                                <option>In Progress</option>
                                                <option>Info Needed</option>
                                                <option>Peer Review</option>
                                                {isPeerReviewAdmin(user?.email) && <option>Complete</option>}
                                            </select>
                                            {!isPeerReviewAdmin(user?.email) && item.status !== 'Complete' && (
                                                <p className="text-[8px] text-slate-400 mt-1 italic">Only Peer Review Admins can mark as Complete</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Assigned Developer</label>
                                            <select
                                                value={item.reviewer_id || ""}
                                                onChange={(e) => handleItemAssignment(item.id, e.target.value || null)}
                                                disabled={request.status === 'Complete'}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option value="">Unassigned</option>
                                            </select>
                                        </div>

                                        <div className="pt-2 border-t border-slate-100">
                                            <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Assigned Reviewers ({item.peer_reviewers?.length || 0})</label>
                                            <div className="space-y-2">
                                                {item.peer_reviewers?.map(pr => (
                                                    <div key={pr.user_id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                                        <span className="text-[10px] font-bold text-slate-600">{pr.email.split('@')[0]}</span>
                                                        <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${pr.decision === 'Yes' ? 'bg-emerald-100 text-emerald-700' :
                                                            pr.decision === 'No' ? 'bg-rose-100 text-rose-700' :
                                                                'bg-slate-100 text-slate-400'
                                                            }`}>
                                                            {pr.decision || 'PENDING'}
                                                        </div>
                                                    </div>
                                                ))}
                                                <select
                                                    value=""
                                                    onChange={async (e) => {
                                                        const rev = reviewers.find(r => r.id === e.target.value);
                                                        if (rev) {
                                                            await addPeerReviewer(request.id, item.id, rev);
                                                            const updated = await getRequestById(id, user?.id, 'admin');
                                                            setRequest(updated);
                                                        }
                                                    }}
                                                    disabled={request.status === 'Complete'}
                                                    className="w-full p-2 bg-slate-100 border-dashed border-2 border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:border-slate-300 transition-all cursor-pointer disabled:cursor-not-allowed disabled:hover:border-slate-200"
                                                >
                                                    <option value="">+ Assign Reviewer</option>
                                                    {reviewers.filter(r => !item.peer_reviewers?.find(p => p.user_id === r.id)).map(r => (
                                                        <option key={r.id} value={r.id}>{r.email}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </TicketItemCard>
                            ))}
                        </div>
                        {/* Pagination Controls */}
                        {request.items && request.items.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                                <button
                                    onClick={() => setItemsPage(p => Math.max(1, p - 1))}
                                    disabled={itemsPage === 1}
                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Page</span>
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 border border-indigo-100 italic">
                                        {itemsPage}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter mx-1">of</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                        {Math.ceil((request.items?.length || 0) / ITEMS_PER_PAGE)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setItemsPage(p => Math.min(Math.ceil((request.items?.length || 0) / ITEMS_PER_PAGE), p + 1))}
                                    disabled={itemsPage >= Math.ceil((request.items?.length || 0) / ITEMS_PER_PAGE)}
                                    className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            </div >

            {/* AUDIT LOG SECTION */}
            <section className="mt-8 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-100" >
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
                                {visibleLogs.map(log => (
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
            </section >

            {/* Confirmation Modal */}
            {
                showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-4 text-yellow-600">
                                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Confirm Send</h2>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                This message will be visible to the <span className="font-bold text-slate-800">Client</span> and may trigger an email notification. Are you sure you want to proceed?
                            </p>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    Back to Edit
                                </button>
                                <button
                                    onClick={sendMessageToClient}
                                    className="flex-1 py-3 bg-yellow-400 text-stone-900 font-black rounded-2xl hover:bg-yellow-500 shadow-lg shadow-yellow-100 transition-all active:scale-95"
                                >
                                    YES, SEND
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Confirmation Modal for Complete */}
            <ConfirmationModal
                isOpen={showCompleteConfirm}
                onClose={() => setShowCompleteConfirm(false)}
                onConfirm={confirmComplete}
                title="CONFIRM COMPLETION"
                message="Are you sure you want to mark this ticket as Completed? This declares all items finalized and notifies the client."
                confirmText="YES, COMPLETE"
            />
        </div >
    );
}


// --- SOURCE: src/app/reviewer/page.tsx ---











function ReviewerDashboardPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerDashboard />
        </ProtectedRoute>
    );
}

function ReviewerDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequests() {
                try {
                    const data = await getRequests(user?.id, 'reviewer');
                    setRequests(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (user?.id) fetchRequests();
        }, 2000);
        return () => clearTimeout(timer);
    }, [user?.id]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Filter by whether any item has this user as a peer reviewer OR Peer Review status
    const filtered = requests.filter((r) => {
        const isPeerReviewer = r.items?.some(item => item.peer_reviewers?.some(pr => pr.user_id === user?.id));
        const isEligible = isPeerReviewer || r.status === 'Peer Review';

        if (!isEligible) return false;

        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || r.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const [page, setPage] = useState(1);


    // Reset page when filtering
    useEffect(() => {
        setPage(1);
    }, [searchQuery, filterStatus]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-4">
            <header className="space-y-2">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-100 italic">
                        Secured Review Board
                    </span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Personal Review Queue</h1>
                <p className="text-slate-500 font-medium max-w-2xl text-sm">
                    Evaluation board for requests exclusively assigned to your profile for technical validation and quality assurance.
                </p>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold animate-in fade-in">
                    System Error: {error}
                </div>
            )}

            <div className="card-premium p-6 bg-white rounded-[2.5rem] border-slate-200 shadow-xl shadow-yellow-100/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full" />
                        Review Queue
                        <span className="ml-1 px-2.5 py-1 bg-yellow-400 text-stone-900 rounded-full text-[11px] font-black">
                            {filtered.length}
                        </span>
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl justify-end">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by ID or Title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none group-hover:border-slate-300"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-3 h-3 text-slate-500" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                            {['All', 'Peer Review', 'In Progress', 'Complete'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterStatus === status
                                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200"
                                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                        <div className="w-20 h-20 bg-white shadow-xl shadow-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-5 transform -rotate-6">
                            <Search className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h4 className="text-slate-900 font-bold text-base mb-1">No Results Found</h4>
                        <p className="text-slate-400 font-medium text-sm">Try adjusting your filters or search query.</p>
                        {(searchQuery || filterStatus !== "All") && (
                            <button
                                onClick={() => { setSearchQuery(""); setFilterStatus("All"); }}
                                className="mt-4 px-6 py-2 bg-yellow-400 text-stone-900 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-200"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((r) => (
                            <RequestCard
                                key={r.id}
                                request={r}
                                onOpen={() => router.push(`/reviewer/requests/${r.id}`)}
                            />
                        ))}
                        {/* Pagination Controls */}
                        {filtered.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 mt-4 rounded-xl">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Previous
                                </button>
                                <span className="text-xs font-bold text-slate-400">
                                    Page {page} of {Math.ceil(filtered.length / ITEMS_PER_PAGE)}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(Math.ceil(filtered.length / ITEMS_PER_PAGE), p + 1))}
                                    disabled={page >= Math.ceil(filtered.length / ITEMS_PER_PAGE)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


// --- SOURCE: src/app/reviewer/requests/[id]/page.tsx ---













function ReviewerDetailPage() {
    return (
        <ProtectedRoute allow={["reviewer"]}>
            <ReviewerRequestDetail />
        </ProtectedRoute>
    );
}

function ReviewerRequestDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user } = useAuth();
    const [request, setRequest] = useState<Request | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'client' | 'internal'>('internal');
    const [clientMessage, setClientMessage] = useState("");
    const [clientAttachment, setClientAttachment] = useState<Attachment | null>(null);
    const [internalNote, setInternalNote] = useState("");
    const [internalAttachment, setInternalAttachment] = useState<Attachment | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [itemSearchQuery, setItemSearchQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchRequest() {
                try {
                    const data = await getRequestById(id, user?.id, 'reviewer');
                    setRequest(data);
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
            await sendMessage(request.id, user.id, `Item #${request.items?.find(i => i.id === itemId)?.item_number} marked as ${newStatus}`, true, undefined, 'reviewer', user.email || 'Developer');

            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    async function handleReviewAction(action: 'approve' | 'request_changes') {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            const newStatus = action === 'approve' ? 'In Progress' : 'Info Needed';
            const systemMessage = action === 'approve'
                ? "Reviewer approved the overall work bundle."
                : "Reviewer requested changes for the bundle.";

            await updateRequestStatus(request.id, newStatus, user.email || 'Reviewer');
            await sendMessage(request.id, user.id, systemMessage, false, undefined, 'reviewer', user.email || 'Reviewer');

            alert(action === 'approve' ? "Approved and admin notified" : "Changes requested and admin notified");
            router.push("/reviewer");
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function confirmComplete() {
        if (!request || !user) return;
        setIsUpdating(true);
        try {
            const newStatus = "Complete";
            await updateRequestStatus(request.id, newStatus, user.email || 'Reviewer');
            await sendMessage(request.id, user.id, `Reviewer marked ticket as COMPLETED.`, false, undefined, 'reviewer', user.email || 'Reviewer');
            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
            setShowCompleteConfirm(false);
            alert("Ticket marked as Complete");
            router.push("/reviewer");
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendMessageToClient() {
        if ((!clientMessage.trim() && !clientAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, clientMessage, false, clientAttachment || undefined, 'reviewer', user.email || 'Reviewer');
            setClientMessage("");
            setClientAttachment(null);
            setShowConfirm(false);
            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
            alert("Message sent to client");
        } catch (err: any) {
            alert("Error sending message: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    }

    async function sendInternalNote() {
        if ((!internalNote.trim() && !internalAttachment) || !user || !request) return;
        setIsUpdating(true);
        try {
            await sendMessage(request.id, user.id, internalNote, true, internalAttachment || undefined, 'reviewer', user.email || 'Reviewer');
            setInternalNote("");
            setInternalAttachment(null);
            const updated = await getRequestById(id, user.id, 'reviewer');
            setRequest(updated);
            alert("Internal note saved");
        } catch (err: any) {
            alert("Error saving note: " + err.message);
        } finally {
            setIsUpdating(false);
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
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                        <span className="text-yellow-600">Review Board:</span> {request.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                        Client: {request.profiles?.email} • Created: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="text-right">
                    <StatusBadge status={request.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <main className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shadow-sm">
                                    <span className="text-xs font-black">{request.profiles?.email?.substring(0, 2).toUpperCase() || 'CL'}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{request.profiles?.email}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${request.profiles?.role === 'client' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">{request.profiles?.role || 'Client'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase ${request.status === 'Complete' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    {request.status}
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            <div className="flex justify-center mb-6">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {request.messages?.map((m) => {
                                const isMe = m.user_id === user?.id;
                                const isInternal = m.is_internal;

                                return (
                                    <div
                                        key={m.id}
                                        className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                            <div className="flex items-center gap-2 mb-1 px-1">
                                                {!isMe && (
                                                    <span className="text-[10px] font-bold text-yellow-600">
                                                        {m.profiles?.email.split('@')[0]}
                                                    </span>
                                                )}
                                                {isInternal && (
                                                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black rounded uppercase">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                        Internal
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${isInternal
                                                    ? "bg-amber-50 text-slate-800 border-amber-200"
                                                    : isMe
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
                                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${isMe && !isInternal
                                                                    ? "bg-yellow-50 border-yellow-100 hover:bg-yellow-100"
                                                                    : "bg-white border-slate-100 hover:border-slate-300"
                                                                    }`}
                                                            >
                                                                <div className={`w-8 h-8 flex items-center justify-center rounded ${isMe && !isInternal ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-xs font-bold truncate ${isMe && !isInternal ? "text-stone-900" : "text-slate-700"}`}>{att.name}</p>
                                                                    <p className={`text-[9px] uppercase ${isMe && !isInternal ? "text-slate-400" : "text-slate-400"}`}>Attachment</p>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <span className="text-[9px] text-yellow-600 mt-1 px-1 select-none">
                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Footer */}
                        <div className={`p-4 border-t border-slate-200 transition-colors ${activeTab === 'internal' ? 'bg-amber-50/30' : 'bg-white'}`}>
                            <div className="flex justify-center mb-4">
                                <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                                    <button
                                        onClick={() => setActiveTab('client')}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ${activeTab === 'client' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'client' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        Reply to Client
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('internal')}
                                        className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ${activeTab === 'internal' ? 'bg-white text-amber-700 shadow-sm ring-1 ring-amber-900/5' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'internal' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                        Internal Note
                                    </button>
                                </div>
                            </div>

                            {activeTab === 'client' ? (
                                <div className="space-y-3">
                                    {clientAttachment && (
                                        <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-700">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </div>
                                                <span className="text-xs font-bold text-yellow-900 truncate max-w-[200px]">{clientAttachment.name}</span>
                                            </div>
                                            <button onClick={() => setClientAttachment(null)} className="p-1 hover:bg-yellow-200 rounded-full text-yellow-600 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                        <RichTextEditor
                                            value={clientMessage}
                                            onChange={setClientMessage}
                                            placeholder="Type a message to client..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-all" title="Attach">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setClientAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={() => setShowConfirm(true)}
                                                    disabled={isUpdating || (!clientMessage.trim() && !clientAttachment)}
                                                    className="px-4 py-2 bg-yellow-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                                >
                                                    {isUpdating ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                        <>
                                                            SEND
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {internalAttachment && (
                                        <div className="flex items-center justify-between p-2 bg-amber-50 border border-amber-100 rounded-lg mx-1 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-amber-700">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </div>
                                                <span className="text-xs font-bold text-amber-900 truncate max-w-[200px]">{internalAttachment.name}</span>
                                            </div>
                                            <button onClick={() => setInternalAttachment(null)} className="p-1 hover:bg-amber-200 rounded-full text-amber-600 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-xl shadow-sm transition-all overflow-hidden">
                                        <RichTextEditor
                                            value={internalNote}
                                            onChange={setInternalNote}
                                            placeholder="Add private note..."
                                            className="min-h-[80px]"
                                            leadingActions={
                                                <label className="p-2 text-amber-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg cursor-pointer transition-all" title="Attach to Internal">
                                                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) setInternalAttachment({ name: file.name, url: URL.createObjectURL(file), type: file.type }); }} />
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                </label>
                                            }
                                            trailingActions={
                                                <button
                                                    onClick={sendInternalNote}
                                                    disabled={isUpdating || (!internalNote.trim() && !internalAttachment)}
                                                    className="px-4 py-2 bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:bg-amber-100 disabled:text-amber-300 transition-all shadow-md hover:shadow-lg shadow-amber-100 active:scale-95 flex items-center gap-2"
                                                >
                                                    {isUpdating ? <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" /> : (
                                                        <>
                                                            SAVE NOTE
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <aside className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 text-sm uppercase tracking-wider">Overall Bundle Action</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleReviewAction('request_changes')}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-stone-100 text-stone-600 rounded-2xl hover:bg-stone-200 disabled:opacity-50 transition-all font-black shadow-sm active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Request Changes (Bundle)
                            </button>
                            <button
                                onClick={() => handleReviewAction('approve')}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-stone-900 rounded-2xl hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 transition-all font-black shadow-xl shadow-yellow-100 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Approve Bundle
                            </button>
                            <button
                                onClick={() => setShowCompleteConfirm(true)}
                                disabled={isUpdating}
                                className="w-full px-4 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 disabled:opacity-50 transition-all font-black shadow-xl shadow-emerald-100 active:scale-95 uppercase tracking-widest text-[10px]"
                            >
                                Mark as Complete
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b pb-3 gap-3">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Item Details & Actions</h3>
                            <div className="relative flex-1 max-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search Items..."
                                    value={itemSearchQuery}
                                    onChange={(e) => setItemSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {request.items?.filter(item =>
                                item.description.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
                                item.item_number.toString().includes(itemSearchQuery)
                            ).map(item => (
                                <TicketItemCard key={item.id} item={item}>
                                    <div className="pt-3 border-t border-slate-200">
                                        <label className="text-[9px] font-black uppercase text-slate-400 block mb-2">Peer Review Status</label>
                                        <div className="space-y-2">
                                            {item.peer_reviewers?.map(pr => (
                                                <div key={pr.user_id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-600">{pr.email.split('@')[0]}</span>
                                                    {pr.user_id === user?.id ? (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={async () => {
                                                                    await submitPeerReviewDecision(request.id, item.id, user.id, 'Yes');
                                                                    const updated = await getRequestById(id, user.id, 'reviewer');
                                                                    setRequest(updated);
                                                                }}
                                                                className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${pr.decision === 'Yes' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`}
                                                            >
                                                                YES
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    await submitPeerReviewDecision(request.id, item.id, user.id, 'No');
                                                                    const updated = await getRequestById(id, user.id, 'reviewer');
                                                                    setRequest(updated);
                                                                }}
                                                                className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${pr.decision === 'No' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}`}
                                                            >
                                                                NO
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={`px-2 py-1 rounded text-[9px] font-black uppercase ${pr.decision === 'Yes' ? 'bg-emerald-100 text-emerald-700' :
                                                            pr.decision === 'No' ? 'bg-rose-100 text-rose-700' :
                                                                'bg-slate-100 text-slate-400'
                                                            }`}>
                                                            {pr.decision || 'PENDING'}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {(!item.peer_reviewers || item.peer_reviewers.length === 0) && (
                                                <p className="text-[10px] text-slate-400 italic">No peer reviewers assigned yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    {item.reviewer_id === user?.id && (
                                        <div className="pt-3 border-t border-slate-200">
                                            <p className="text-[9px] font-black uppercase text-yellow-600 mb-2">Assigned Developer Actions</p>
                                            <div className="flex gap-2">
                                                {item.status !== 'In Progress' && item.status !== 'Peer Review' && item.status !== 'Complete' && (
                                                    <button
                                                        onClick={() => handleDeveloperStatus(item.id, 'In Progress')}
                                                        disabled={isUpdating}
                                                        className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm"
                                                    >
                                                        Start Work
                                                    </button>
                                                )}

                                                {item.status === 'In Progress' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDeveloperStatus(item.id, 'Peer Review')}
                                                            disabled={isUpdating}
                                                            className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-sm"
                                                        >
                                                            Request Peer Review
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeveloperStatus(item.id, 'Complete')}
                                                            disabled={isUpdating}
                                                            className="flex-1 py-2 bg-stone-800 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-stone-900 transition-all shadow-sm"
                                                        >
                                                            Mark Complete
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => handleDeveloperStatus(item.id, 'Info Needed')}
                                                    disabled={isUpdating}
                                                    className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm"
                                                >
                                                    Blocked / Info Needed
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </TicketItemCard>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 text-yellow-600">
                            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Confirm Send</h2>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            This message will be visible to the <span className="font-bold text-slate-800">Client</span> and may trigger an email notification. Are you sure you want to proceed?
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                            >
                                Back to Edit
                            </button>
                            <button
                                onClick={sendMessageToClient}
                                className="flex-1 py-3 bg-yellow-400 text-stone-900 font-black rounded-2xl hover:bg-yellow-500 shadow-lg shadow-yellow-100 transition-all active:scale-95"
                            >
                                YES, SEND
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Modal for Complete */}
            <ConfirmationModal
                isOpen={showCompleteConfirm}
                onClose={() => setShowCompleteConfirm(false)}
                onConfirm={confirmComplete}
                title="CONFIRM COMPLETION"
                message="Are you sure you want to mark this ticket as Completed? This declares all items finalized and notifies the client."
                confirmText="YES, COMPLETE"
            />
        </div>
    );
}


function MainApp() {
    const [path, setPath] = useState("/");

    const currentId = useMemo(() => {
        if (path.includes("/requests/")) {
            return path.split("/").pop();
        }
        return "1";
    }, [path]);

    const displayPath = useMemo(() => {
        if (path.startsWith("/admin/requests/")) return "/admin/requests/[id]";
        if (path.startsWith("/reviewer/requests/")) return "/reviewer/requests/[id]";
        if (path.startsWith("/requests/") && !path.endsWith("/new")) return "/requests/[id]";
        return path;
    }, [path]);

    return (
        <RouterContext.Provider value={{ path, setPath, currentId }}>
            <GlobalStyles />
            <AuthProvider>
                <LayoutShell>
                    {displayPath === "/" && <ClientDashboardPage />}
                    {displayPath === "/login" && <LoginPage />}
                    {displayPath === "/signup" && <SignupPage />}
                    {displayPath === "/requests/new" && <NewRequestPage />}
                    {displayPath === "/requests/[id]" && <ClientDetailPage />}
                    {displayPath === "/admin" && <AdminDashboardPage />}
                    {displayPath === "/admin/reports" && <AdminReportsPage />}
                    {displayPath === "/admin/requests/[id]" && <AdminDetailPage />}
                    {displayPath === "/reviewer" && <ReviewerDashboardPage />}
                    {displayPath === "/reviewer/requests/[id]" && <ReviewerDetailPage />}
                </LayoutShell>
            </AuthProvider>
        </RouterContext.Provider>
    );
}

export default MainApp;
