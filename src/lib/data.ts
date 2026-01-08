export type Attachment = {
    name: string;
    url: string;
    type: string;
};

export type Message = {
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

export type CategoryType = 'Text' | 'Image' | 'Document' | 'Defect';

export type CategoryConfig = {
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

export const DYNAMIC_CATEGORIES: CategoryConfig[] = [
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

export type AuditEntry = {
    id: string;
    request_id: string;
    user_id: string;
    user_email: string;
    action: string;
    previous_value?: string;
    new_value?: string;
    created_at: string;
};

export type RequestItem = {
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

export function isPeerReviewAdmin(email?: string) {
    return email === 'admin@dummy.com';
}

export type PeerReviewDecision = {
    user_id: string;
    email: string;
    decision: 'Yes' | 'No' | null;
    updated_at: string | null;
};

export type Request = {
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

export const ITEM_STATUSES = [
    'New',
    'In Progress',
    'Info Needed',
    'Peer Review',
    'Complete',
    'Reopened'
];

export const RESPONSE_TEMPLATES = [
    { label: "General Update", text: "I've started working on this request. I will provide another update once I hit the next milestone." },
    { label: "Request Clarification", text: "Could you please provide more details or an example for this item? I want to make sure the implementation matches your vision exactly." },
    { label: "Ready for Peer Review", text: "The development for this item is finished. I am now submitting it for technical validation." },
    { label: "Deployment Notice", text: "The changes have been deployed to the live site. Please review and let us know if everything looks correct." },
    { label: "Delay Notification", text: "Due to some technical complexities, this item is taking a bit longer than expected. I anticipate a new completion date by tomorrow EOD." }
];

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
    },
    {
        id: "3",
        title: "Implement API Integration for Newsletter",
        client_id: "client-3",
        status: "In Progress",
        urgency: "Normal",
        created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        sla_due_date: new Date(Date.now() + 86400000).toISOString(),
        profiles: { email: "tech@startupschool.edu", school: "Startup School" },
        items: [
            {
                id: "item-3",
                request_id: "3",
                item_number: 1,
                categories: ['Text', 'Defect'],
                description: "Connect the newsletter signup form to Mailchimp API",
                page_url: "https://startupschool.edu/newsletter",
                details: {},
                status: "In Progress",
                assigned_to: "developer1@dummy.com",
                reviewer_id: "dev-1", // Assigned to Developer 1
                estimated_effort: 4,
                due_date: new Date(Date.now() + 172800000).toISOString(),
                peer_reviewers: [],
                created_at: new Date(Date.now() - 43200000).toISOString()
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
            if (userRole === 'admin' || userRole === 'reviewer' || userRole === 'developer') return true;
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
        if (userRole === 'admin' || userRole === 'reviewer' || userRole === 'developer') return true;
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
    const messages = getStored<Message[]>(MESSAGES_KEY, []);
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
        { id: "rev-1", email: "reviewer1@dummy.com", role: 'reviewer' },
        { id: "rev-2", email: "reviewer2@dummy.com", role: 'reviewer' },
        { id: "dev-1", email: "developer1@dummy.com", role: 'developer' },
        { id: "dev-2", email: "developer2@dummy.com", role: 'developer' },
        { id: "dev-3", email: "developer3@dummy.com", role: 'developer' }
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
                // Auto-update status to Peer Review if it's in a lower state
                if (['New', 'In Progress', 'Info Needed'].includes(items[iIndex].status)) {
                    items[iIndex].status = 'Peer Review';
                }
                addAuditEntry(requests[rIndex], 'Admin', `Added Peer Reviewer to Item #${items[iIndex].item_number}`, 'None', reviewer.email);
                setStored(REQUESTS_KEY, requests);
            }
        }
    }
}

export async function removePeerReviewer(requestId: string, itemId: string, userId: string) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1) {
        const items = requests[rIndex].items || [];
        const iIndex = items.findIndex(i => i.id === itemId);
        if (iIndex !== -1) {
            const current = items[iIndex].peer_reviewers || [];
            const rIdx = current.findIndex(r => r.user_id === userId);
            if (rIdx !== -1) {
                const removed = current[rIdx];
                items[iIndex].peer_reviewers.splice(rIdx, 1);
                addAuditEntry(requests[rIndex], 'Admin', `Removed Peer Reviewer from Item #${items[iIndex].item_number}`, removed.email, 'None');
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

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};
