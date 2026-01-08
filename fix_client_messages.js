const fs = require('fs');
let content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// Replace all occurrences of sendSupabaseMessage with sendMessage
content = content.replace(/sendSupabaseMessage/g, 'sendMessage');

fs.writeFileSync('webUpdatesStandalone.tsx', content, 'utf8');
console.log('Fixed sendSupabaseMessage -> sendMessage throughout the file.');
