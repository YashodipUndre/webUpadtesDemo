import { supabase } from './supabase';

export type Message = {
    id: string;
    request_id: string;
    user_id: string;
    text: string;
    created_at: string;
    profiles?: {
        email: string;
        role: string;
    };
};

export type Request = {
    id: string;
    title: string;
    client_id: string;
    status: string;
    urgency: string;
    created_at: string;
    profiles?: {
        email: string;
    };
    messages?: Message[];
};

export async function getRequests() {
    const { data, error } = await supabase
        .from('requests')
        .select(`
            *,
            profiles:client_id (email)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Request[];
}

export async function getRequestById(id: string) {
    const { data, error } = await supabase
        .from('requests')
        .select(`
            *,
            profiles:client_id (email),
            messages (
                *,
                profiles:user_id (email, role)
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Request;
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

export async function sendMessage(requestId: string, userId: string, text: string) {
    const { data, error } = await supabase
        .from('messages')
        .insert([
            { request_id: requestId, user_id: userId, text }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}
