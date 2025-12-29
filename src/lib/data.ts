import { supabase } from './supabase';

export type Message = {
    id: string;
    request_id: string;
    user_id: string;
    text: string;
    created_at: string;
    is_internal: boolean;
    profiles?: {
        email: string;
        role: string;
    };
};

export type Request = {
    id: string;
    title: string;
    client_id: string;
    reviewer_id: string | null;
    status: string;
    urgency: string;
    created_at: string;
    profiles?: { email: string };
    reviewer?: { email: string };
    messages?: Message[];
    // Stats
    total_messages?: number;
    unseen_count?: number;
    last_viewed_at?: string;
};

export async function getRequests(currentUserId?: string, userRole?: string) {
    let query = supabase
        .from('requests')
        .select(`
            *,
            profiles:client_id (email),
            reviewer:profiles!reviewer_id (email),
            messages (created_at, is_internal),
            request_views (last_viewed_at, user_id)
        `)
        .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;

    // Process counts client-side for "Unseen" and "Internal" logic
    return (data as any[]).map(r => {
        const userView = Array.isArray(r.request_views)
            ? r.request_views.find((v: any) => v.user_id === currentUserId)
            : null;
        const lastViewed = userView ? new Date(userView.last_viewed_at) : new Date(0);

        // Filter messages the user is allowed to see
        const visibleMessages = (r.messages || []).filter((m: any) => {
            if (userRole === 'admin' || userRole === 'reviewer') return true;
            return !m.is_internal;
        });

        return {
            ...r,
            total_messages: visibleMessages.length,
            unseen_count: visibleMessages.filter((m: any) => new Date(m.created_at) > lastViewed).length || 0
        } as Request;
    });
}

export async function getRequestById(id: string, currentUserId?: string, userRole?: string) {
    const { data, error } = await supabase
        .from('requests')
        .select(`
            *,
            profiles:client_id (email),
            reviewer:profiles!reviewer_id (email),
            messages (
                *,
                profiles:user_id (email, role)
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;

    if (currentUserId) {
        await markRequestAsRead(id, currentUserId);
    }

    // Filter messages for the single request view as well
    const visibleMessages = (data.messages || []).filter((m: any) => {
        if (userRole === 'admin' || userRole === 'reviewer') return true;
        return !m.is_internal;
    });

    return {
        ...data,
        messages: visibleMessages,
        total_messages: visibleMessages.length
    } as Request;
}

export async function markRequestAsRead(requestId: string, userId: string) {
    const { error } = await supabase
        .from('request_views')
        .upsert({
            user_id: userId,
            request_id: requestId,
            last_viewed_at: new Date().toISOString()
        }, { onConflict: 'user_id,request_id' });

    if (error) console.error("View update error:", error);
}

export async function getReviewers() {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('role', 'reviewer');

    if (error) throw error;
    return data;
}

export async function assignRequest(requestId: string, reviewerId: string | null) {
    const { error } = await supabase
        .from('requests')
        .update({ reviewer_id: reviewerId })
        .eq('id', requestId);

    if (error) throw error;
}

export async function bulkAssignRequests(requestIds: string[], reviewerId: string | null) {
    const { error } = await supabase
        .from('requests')
        .update({ reviewer_id: reviewerId })
        .in('id', requestIds);

    if (error) throw error;
}

export async function createRequest(title: string, urgency: string, userId: string) {
    const { data, error } = await supabase
        .from('requests')
        .insert([
            { title, urgency, client_id: userId, status: 'New' }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateRequestStatus(id: string, status: string) {
    const { error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
}

export async function sendMessage(requestId: string, userId: string, text: string, isInternal: boolean = false) {
    const { data, error } = await supabase
        .from('messages')
        .insert([
            { request_id: requestId, user_id: userId, text, is_internal: isInternal }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}
