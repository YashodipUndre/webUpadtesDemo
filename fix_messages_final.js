const fs = require('fs');
let content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// 1. Fix sendMessage to use initial data if storage is empty
content = content.replace(
    /export async function sendMessage\(requestId: string, userId: string, text: string, isInternal: boolean = false, attachment\?: Attachment, senderRole\?: string, userEmail\?: string\) \{([\s\S]*?)const messages = getStored<Message\[\]>\(MESSAGES_KEY, \[\]\);([\s\S]*?)const requests = getStored<Request\[\]>\(REQUESTS_KEY, initialRequests\);/,
    'export async function sendMessage(requestId: string, userId: string, text: string, isInternal: boolean = false, attachment?: Attachment, senderRole?: string, userEmail?: string) {$1const messages = getStored<Message[]>(MESSAGES_KEY, initialMessages);$2const requests = getStored<Request[]>(REQUESTS_KEY, initialRequests);'
);

// 2. Double check if sendSupabaseMessage is still there (though I already ran a script)
content = content.replace(/sendSupabaseMessage/g, 'sendMessage');

fs.writeFileSync('webUpdatesStandalone.tsx', content, 'utf8');
console.log('Fixed sendMessage data initialization and ensured no sendSupabaseMessage remains.');
