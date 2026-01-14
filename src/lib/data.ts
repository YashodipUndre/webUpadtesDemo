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
            { id: 'page_url', label: 'Page URL', type: 'url', required: false, placeholder: 'https://school.com/about' },
            { id: 'original_text', label: 'Original Text', type: 'textarea', required: true },
            { id: 'updated_text', label: 'Updated Text', type: 'textarea', required: true }
        ]
    },
    {
        id: 'Image',
        label: 'Image Update',
        enabled: true,
        fields: [
            { id: 'page_url', label: 'Page URL', type: 'url', required: false },
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
            { id: 'page_url', label: 'Page URL', type: 'url', required: false },
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
    description?: string;
    page_url?: string;
    client_id: string;
    reviewer_id?: string | null;
    status: string;
    urgency: string;
    created_at: string;
    start_date?: string | null;
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

const REQUESTS_KEY = "dummy_requests_v3";
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
        id: "REQ-2026-001",
        title: "Critical Security Patch: Login Form",
        description: "We noticed a potential vulnerability in the student login form. It seems to allow brute force attempts without lockout.",
        page_url: "https://www.school.edu/login",
        client_id: "user_123",
        status: "New",
        urgency: "Urgent",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        sla_due_date: new Date(Date.now() + 86400000).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_101",
                request_id: "REQ-2026-001",
                item_number: 1,
                categories: ["Defect"],
                description: "Implement rate limiting on the login API endpoint.",
                page_url: "https://www.school.edu/login",
                details: {},
                status: "New",
                assigned_to: null,
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 0,
                due_date: null,
                created_at: new Date(Date.now() - 3600000 * 2).toISOString()
            }
        ],
        audit_logs: [
            {
                id: "log_1",
                request_id: "REQ-2026-001",
                user_id: "client@school.edu",
                user_email: "client@school.edu",
                action: "Created Request",
                created_at: new Date(Date.now() - 3600000 * 2).toISOString()
            }
        ]
    },
    {
        id: "REQ-2026-002",
        title: "Summer Camp 2026 Landing Page",
        description: "We need a new landing page for the upcoming Summer Science Camp. I've attached the brochure text and hero image.",
        page_url: "https://www.school.edu/summer-camp",
        client_id: "user_123",
        status: "In Progress",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        sla_due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
        start_date: new Date(Date.now() - 86400000).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_102",
                request_id: "REQ-2026-002",
                item_number: 1,
                categories: ["Text"],
                description: "Create main page content from attached brochure.",
                page_url: "https://www.school.edu/summer-camp",
                details: { original_text: "N/A", updated_text: "See attached document for full text." },
                status: "In Progress",
                assigned_to: "dev_1",
                reviewer_id: "rev_1",
                peer_reviewers: [],
                estimated_effort: 4,
                due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: "itm_103",
                request_id: "REQ-2026-002",
                item_number: 2,
                categories: ["Image"],
                description: "Upload hero banner image (camping_kids.jpg).",
                page_url: "https://www.school.edu/summer-camp",
                details: { old_image_ref: "None", new_image: "pending_upload" },
                status: "New",
                assigned_to: "dev_1",
                reviewer_id: "rev_1",
                peer_reviewers: [],
                estimated_effort: 1,
                due_date: null,
                created_at: new Date(Date.now() - 86400000 * 2).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_2", request_id: "REQ-2026-002", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
            { id: "log_3", request_id: "REQ-2026-002", user_id: "admin@dummy.com", user_email: "admin@dummy.com", action: "Updated Status to In Progress", created_at: new Date(Date.now() - 86400000).toISOString() }
        ]
    },
    {
        id: "REQ-2026-003",
        title: "Faculty Bio Updates: Science Dept",
        description: "Please update the bios for Dr. Smith and Mrs. Jones. They have new publications to add.",
        page_url: "https://www.school.edu/faculty/science",
        client_id: "user_123",
        status: "Peer Review",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        start_date: new Date(Date.now() - 86400000 * 3).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_104",
                request_id: "REQ-2026-003",
                item_number: 1,
                categories: ["Text"],
                description: "Update Dr. Smith's bio.",
                page_url: "https://www.school.edu/faculty/science/smith",
                details: {},
                status: "Peer Review",
                assigned_to: "dev_2",
                reviewer_id: "rev_2",
                peer_reviewers: [],
                estimated_effort: 1,
                due_date: new Date(Date.now() - 3600000).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 4).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_4", request_id: "REQ-2026-003", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
            { id: "log_5", request_id: "REQ-2026-003", user_id: "dev_2", user_email: "developer2@dummy.com", action: "Updated Status to Peer Review", created_at: new Date(Date.now() - 3600000).toISOString() }
        ]
    },
    {
        id: "REQ-2026-004",
        title: "Annual Report 2025 Publication",
        description: "The 2025 Annual Report is ready for publication. Please upload the PDF to the reports section.",
        page_url: "https://www.school.edu/reports",
        client_id: "user_123",
        status: "Complete",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        start_date: new Date(Date.now() - 86400000 * 9).toISOString(),
        sla_due_date: new Date(Date.now() - 86400000 * 5).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_105",
                request_id: "REQ-2026-004",
                item_number: 1,
                categories: ["Document"],
                description: "Upload Annual_Report_2025.pdf",
                page_url: "https://www.school.edu/reports",
                details: {},
                status: "Complete",
                assigned_to: "dev_3",
                reviewer_id: "rev_1",
                peer_reviewers: [],
                estimated_effort: 0.5,
                due_date: new Date(Date.now() - 86400000 * 6).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 10).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_6", request_id: "REQ-2026-004", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
            { id: "log_7", request_id: "REQ-2026-004", user_id: "admin@dummy.com", user_email: "admin@dummy.com", action: "Updated Status to Complete", created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
        ]
    },
    {
        id: "REQ-2026-005",
        title: "New Alumni Portal Integration",
        description: "We are launching a new portal for alumni. Need to add a 'Login' button to the top header.",
        page_url: "https://www.school.edu/",
        client_id: "user_123",
        status: "Info Needed",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_106",
                request_id: "REQ-2026-005",
                item_number: 1,
                categories: ["Text", "Defect"],
                description: "Add Alumni Login button to header.",
                page_url: "https://www.school.edu/",
                details: {},
                status: "Info Needed",
                assigned_to: "dev_1",
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 0,
                due_date: null,
                created_at: new Date(Date.now() - 86400000 * 1).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_8", request_id: "REQ-2026-005", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
            { id: "log_9", request_id: "REQ-2026-005", user_id: "dev_1", user_email: "developer1@dummy.com", action: "Updated Status to Info Needed", created_at: new Date(Date.now() - 3600000 * 5).toISOString() }
        ]
    },
    {
        id: "REQ-2026-006",
        title: "Fundraising Gala 2026 Page",
        description: "Create a new page for the upcoming Fundraising Gala. Needs tickieting information and a gallery of last year's event.",
        page_url: "https://www.school.edu/gala",
        client_id: "user_123",
        status: "New",
        urgency: "Normal",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000 * 10).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_107",
                request_id: "REQ-2026-006",
                item_number: 1,
                categories: ["Text", "Image"],
                description: "Build Gala Landing Page.",
                page_url: "https://www.school.edu/gala",
                details: { original_text: "N/A", updated_text: "Content pending from Marketing team." },
                status: "New",
                assigned_to: null,
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 0,
                due_date: null,
                created_at: new Date(Date.now() - 3600000 * 5).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_10", request_id: "REQ-2026-006", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 3600000 * 5).toISOString() }
        ]
    },
    {
        id: "REQ-2026-007",
        title: "Footer Link 404 Error",
        description: "The 'Privacy Policy' link in the footer is returning a 404 error.",
        page_url: "https://www.school.edu/",
        client_id: "user_123",
        status: "New",
        urgency: "Urgent",
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_108",
                request_id: "REQ-2026-007",
                item_number: 1,
                categories: ["Defect"],
                description: "Fix broken Privacy Policy link.",
                page_url: "https://www.school.edu/",
                details: {},
                status: "New",
                assigned_to: null,
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 0,
                due_date: null,
                created_at: new Date(Date.now() - 3600000 * 1).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_11", request_id: "REQ-2026-007", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 3600000 * 1).toISOString() }
        ]
    },
    {
        id: "REQ-2026-008",
        title: "Staff Directory Update: Mrs. Davis",
        description: "Mrs. Davis has moved to the English department. Please update her profile.",
        page_url: "https://www.school.edu/staff",
        client_id: "user_123",
        status: "In Progress",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_109",
                request_id: "REQ-2026-008",
                item_number: 1,
                categories: ["Text"],
                description: "Update department for Mrs. Davis.",
                page_url: "https://www.school.edu/staff/davis",
                details: {},
                status: "In Progress",
                assigned_to: "dev_3",
                reviewer_id: "rev_2",
                peer_reviewers: [],
                estimated_effort: 0.5,
                due_date: new Date(Date.now() + 86400000).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 3).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_12", request_id: "REQ-2026-008", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
            { id: "log_13", request_id: "REQ-2026-008", user_id: "admin@dummy.com", user_email: "admin@dummy.com", action: "Updated Status to In Progress", created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
        ]
    },
    {
        id: "REQ-2026-009",
        title: "Math Dept Curriculum PDF",
        description: "Upload the new 2026 Math Curriculum PDF.",
        page_url: "https://www.school.edu/academics/math",
        client_id: "user_123",
        status: "Complete",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        start_date: new Date(Date.now() - 86400000 * 7).toISOString(),
        sla_due_date: new Date(Date.now() - 86400000 * 4).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_110",
                request_id: "REQ-2026-009",
                item_number: 1,
                categories: ["Document"],
                description: "Upload Math_Curriculum_2026.pdf",
                page_url: "https://www.school.edu/academics/math",
                details: {},
                status: "Complete",
                assigned_to: "dev_2",
                reviewer_id: "rev_1",
                peer_reviewers: [],
                estimated_effort: 0.5,
                due_date: new Date(Date.now() - 86400000 * 5).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 8).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_20", request_id: "REQ-2026-009", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 8).toISOString() },
            { id: "log_21", request_id: "REQ-2026-009", user_id: "admin@dummy.com", user_email: "admin@dummy.com", action: "Updated Status to Complete", created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
        ]
    },
    {
        id: "REQ-2026-010",
        title: "Homepage Carousel Stutter",
        description: "The image carousel on the homepage stutters when sliding on Firefox.",
        page_url: "https://www.school.edu/",
        client_id: "user_123",
        status: "Peer Review",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_111",
                request_id: "REQ-2026-010",
                item_number: 1,
                categories: ["Defect"],
                description: "Optimize carousel animation loop for Firefox.",
                page_url: "https://www.school.edu/",
                details: {},
                status: "Peer Review",
                assigned_to: "dev_1",
                reviewer_id: "rev_1",
                peer_reviewers: [],
                estimated_effort: 2,
                due_date: new Date(Date.now() + 3600000).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 4).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_14", request_id: "REQ-2026-010", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 4).toISOString() },
            { id: "log_15", request_id: "REQ-2026-010", user_id: "dev_1", user_email: "developer1@dummy.com", action: "Updated Status to Peer Review", created_at: new Date(Date.now() - 86400000 * 1).toISOString() }
        ]
    },
    {
        id: "REQ-2026-011",
        title: "New Blog Post: STEM Awards",
        description: "Post the news about our robotics team winning state.",
        page_url: "https://www.school.edu/news",
        client_id: "user_123",
        status: "Info Needed",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000 * 4).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_112",
                request_id: "REQ-2026-011",
                item_number: 1,
                categories: ["Text", "Image"],
                description: "Create blog post 'Robotics Team Wins State'.",
                page_url: "https://www.school.edu/news",
                details: {},
                status: "Info Needed",
                assigned_to: "dev_2",
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 1,
                due_date: null,
                created_at: new Date(Date.now() - 86400000 * 1).toISOString()
            }
        ],
        messages: [
            { id: "m_11", request_id: "REQ-2026-011", user_id: "dev_2", is_internal: false, text: "Can you provide the high-res photo of the team holdign the trophy?", created_at: new Date().toISOString(), profiles: { email: "developer2@dummy.com", role: "developer" } }
        ],
        audit_logs: [
            { id: "log_16", request_id: "REQ-2026-011", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
            { id: "log_17", request_id: "REQ-2026-011", user_id: "dev_2", user_email: "developer2@dummy.com", action: "Updated Status to Info Needed", created_at: new Date().toISOString() }
        ]
    },
    {
        id: "REQ-2026-012",
        title: "Sports Schedule Fall 2026",
        description: "Upload the preliminary Fall 2026 sports schedule to the athletics page.",
        page_url: "https://www.school.edu/athletics",
        client_id: "user_123",
        status: "New",
        urgency: "Normal",
        created_at: new Date(Date.now() - 7200000).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_113",
                request_id: "REQ-2026-012",
                item_number: 1,
                categories: ["Text"],
                description: "Update athletics calendar component.",
                page_url: "https://www.school.edu/athletics",
                details: {},
                status: "New",
                assigned_to: null,
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 0,
                due_date: null,
                created_at: new Date(Date.now() - 7200000).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_18", request_id: "REQ-2026-012", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 7200000).toISOString() }
        ]
    },
    {
        id: "REQ-2026-013",
        title: "Privacy Policy Update",
        description: "Legal has sent new terms for the Privacy Policy. Needs immediate update.",
        page_url: "https://www.school.edu/privacy",
        client_id: "user_123",
        status: "In Progress",
        urgency: "Urgent",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        sla_due_date: new Date(Date.now() + 3600000 * 12).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_114",
                request_id: "REQ-2026-013",
                item_number: 1,
                categories: ["Text"],
                description: "Replace entire Privacy Policy text.",
                page_url: "https://www.school.edu/privacy",
                details: { updated_text: "Attached in email..." },
                status: "In Progress",
                assigned_to: "dev_3",
                reviewer_id: "rev_2",
                peer_reviewers: [],
                estimated_effort: 0.5,
                due_date: new Date(Date.now() + 3600000 * 6).toISOString(),
                created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_19", request_id: "REQ-2026-013", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: "log_20_1", request_id: "REQ-2026-013", user_id: "dev_3", user_email: "developer3@dummy.com", action: "Updated Status to In Progress", created_at: new Date(Date.now() - 43200000).toISOString() }
        ]
    },
    {
        id: "REQ-2026-014",
        title: "Gallery: Art Fair 2025",
        description: "Create a photo gallery for the recent Art Fair.",
        page_url: "https://www.school.edu/arts/gallery",
        client_id: "user_123",
        status: "Complete",
        urgency: "Normal",
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        sla_due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_115",
                request_id: "REQ-2026-014",
                item_number: 1,
                categories: ["Image"],
                description: "Upload 20+ images to new gallery album.",
                page_url: "https://www.school.edu/arts/gallery",
                details: {},
                status: "Complete",
                assigned_to: "dev_1",
                reviewer_id: "rev_1",
                peer_reviewers: [],
                estimated_effort: 3,
                due_date: new Date(Date.now() - 86400000 * 3).toISOString(),
                created_at: new Date(Date.now() - 86400000 * 6).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_22", request_id: "REQ-2026-014", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 86400000 * 6).toISOString() },
            { id: "log_23", request_id: "REQ-2026-014", user_id: "dev_1", user_email: "developer1@dummy.com", action: "Updated Status to Complete", created_at: new Date(Date.now() - 86400000 * 3).toISOString() }
        ]
    },
    {
        id: "REQ-2026-015",
        title: "Contact Form Typo",
        description: "The word 'address' is misspelled on the contact form label.",
        page_url: "https://www.school.edu/contact",
        client_id: "user_123",
        status: "New",
        urgency: "Normal",
        created_at: new Date(Date.now() - 1800000).toISOString(),
        sla_due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        profiles: { email: "client@school.edu", school: "Saint Mary's Academy", role: "Client" },
        items: [
            {
                id: "itm_116",
                request_id: "REQ-2026-015",
                item_number: 1,
                categories: ["Text", "Defect"],
                description: "Fix label typo: 'Adress' -> 'Address'.",
                page_url: "https://www.school.edu/contact",
                details: {},
                status: "New",
                assigned_to: null,
                reviewer_id: null,
                peer_reviewers: [],
                estimated_effort: 0,
                due_date: null,
                created_at: new Date(Date.now() - 1800000).toISOString()
            }
        ],
        audit_logs: [
            { id: "log_24", request_id: "REQ-2026-015", user_id: "client@school.edu", user_email: "client@school.edu", action: "Created Request", created_at: new Date(Date.now() - 1800000).toISOString() }
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

export async function createRequest(title: string, description: string, pageUrl: string, urgency: string, userId: string, items: { categories: string[], description: string, pageUrl: string, details?: any }[]) {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);

    if (urgency === 'Urgent') {
        console.log("📧 [SYSTEM] Sending Urgent Ticket Notification to Admin Team...");
    }

    const requestId = Math.random().toString(36).substr(2, 9);
    const newRequest: Request = {
        id: requestId,
        title,
        description,
        page_url: pageUrl,
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

            // AUTO-COMPLETE: If all items are now Complete, automatically complete the ticket
            const allItems = requests[rIndex].items!;
            const allComplete = allItems.length > 0 && allItems.every(i => i.status === 'Complete');

            if (allComplete && requests[rIndex].status !== 'Complete') {
                const prevTicketStatus = requests[rIndex].status;
                requests[rIndex].status = 'Complete';
                addAuditEntry(requests[rIndex], 'System', 'Auto-completed ticket (all items complete)', prevTicketStatus, 'Complete');
            }

            setStored(REQUESTS_KEY, requests);
        }
    }
}

// Batch update multiple items - ensures auto-complete check runs after ALL items are updated
export async function updateMultipleItemStatuses(requestId: string, itemIds: string[], status: string, userEmail: string = 'System') {
    const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);
    const rIndex = requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1 && requests[rIndex].items) {
        // Update all specified items
        for (const itemId of itemIds) {
            const iIndex = requests[rIndex].items!.findIndex(i => i.id === itemId);
            if (iIndex !== -1) {
                const item = requests[rIndex].items![iIndex];
                const prev = item.status;
                item.status = status;
                addAuditEntry(requests[rIndex], userEmail, `Changed Item #${item.item_number} Status`, prev, status);
            }
        }

        // AUTO-COMPLETE: Check if all items are now Complete
        const allItems = requests[rIndex].items!;
        const allComplete = allItems.length > 0 && allItems.every(i => i.status === 'Complete');

        if (allComplete && requests[rIndex].status !== 'Complete') {
            const prevTicketStatus = requests[rIndex].status;
            requests[rIndex].status = 'Complete';
            addAuditEntry(requests[rIndex], 'System', 'Auto-completed ticket (all items complete)', prevTicketStatus, 'Complete');
        }

        setStored(REQUESTS_KEY, requests);
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
