const fs = require('fs');

let content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// 1. Move ITEMS_PER_PAGE to the top and unify it
// First, find all definitions and remove them
content = content.replace(/const CLIENT_ITEMS_PER_PAGE = 5;/g, '');
content = content.replace(/const ADMIN_ITEMS_PER_PAGE = 5;/g, '');
content = content.replace(/const ADMIN_DETAIL_ITEMS_PER_PAGE = 3;/g, '');
content = content.replace(/const ITEMS_PER_PAGE = \d+;/g, '');

// Insert UNIFIED definition after imports
const unifiedDef = '\n// --- UNIFIED CONSTANTS ---\nconst ITEMS_PER_PAGE = 5;\n';
content = content.replace(/import \* as LucideIcons from "lucide-react";/g, 'import * as LucideIcons from "lucide-react";' + unifiedDef);

// 2. Replace all occurrences of renamed items back to ITEMS_PER_PAGE or ensure usage is correct
content = content.split('CLIENT_ITEMS_PER_PAGE').join('ITEMS_PER_PAGE');
content = content.split('ADMIN_ITEMS_PER_PAGE').join('ITEMS_PER_PAGE');
content = content.split('ADMIN_DETAIL_ITEMS_PER_PAGE').join('ITEMS_PER_PAGE');

// 3. Fix Link vs LinkIcon in RichTextEditor
// Looking for ToolbarButton icon={Link}
content = content.replace(/icon={Link}/g, 'icon={LinkIcon}');

fs.writeFileSync('webUpdatesStandalone.tsx', content, 'utf8');
console.log('webUpdatesStandalone.tsx (V5) has been fixed successfully!');
