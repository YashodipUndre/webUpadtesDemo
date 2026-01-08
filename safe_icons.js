const fs = require('fs');

let content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// 1. Remove the destructuring block
const oldBlockRegex = /const\s*{\s*[\s\S]*?}\s*=\s*LucideIcons;/;
content = content.replace(oldBlockRegex, '');

// 2. Add individual definitions for all icons to be extremely safe
const icons = [
    'Search', 'Filter', 'X', 'LogOut', 'Settings', 'User', 'Mail', 'Menu',
    'Bold', 'Italic', 'Underline', 'Strikethrough', 'List', 'ListOrdered',
    'Quote', 'Code', 'Type', 'Smile', 'AtSign', 'ChevronRight', 'Calendar',
    'Clock', 'CheckCircle', 'CheckCircle2', 'AlertCircle', 'Trash2', 'Plus', 'ArrowLeft',
    'BarChart', 'BarChart2', 'BarChart3', 'BarChart4', 'MessageSquare', 'Clipboard', 'Layers', 'FileText',
    'ExternalLink', 'Home', 'File', 'MoreHorizontal', 'MoreVertical',
    'Download', 'Upload', 'Archive', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Bell', 'Check', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'Copy',
    'Database', 'Edit', 'Eye', 'EyeOff', 'Info', 'Lock', 'MapPin', 'Moon',
    'RefreshCw', 'Save', 'Send', 'Share', 'Sun', 'Tag', 'Trash', 'UserPlus',
    'Users', 'Zap', 'HelpCircle', 'Activity', 'TrendingUp', 'School',
    'ShieldCheck', 'AlertTriangle', 'Timer'
];

let newIconsBlock = '\n// --- ICON DEFINITIONS ---\n';
icons.forEach(icon => {
    newIconsBlock += `const ${icon} = LucideIcons.${icon} || LucideIcons.HelpCircle;\n`;
});
newIconsBlock += `const LinkIcon = LucideIcons.Link;\n`;
newIconsBlock += `const LucideImage = LucideIcons.Image;\n`;

content = content.replace('// --- GLOBAL ICONS ---', newIconsBlock);

// 3. Fix the Math.max error again (just in case)
content = content.replace(
    /animate=\{\{\s*height:\s*`Math\.max\(\$\{(.*?)\},\s*(.*?)\)%` \}\}/g,
    'animate={{ height: `${Math.max($1, $2)}%` }}'
);

fs.writeFileSync('webUpdatesStandalone.tsx', content, 'utf8');
console.log('Converted icon destructuring to individual consts and fixed Math.max.');
