const fs = require('fs');

let content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// 1. Rewrite the LucideIcons destructuring completely clean
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

let destBlock = 'const {\n';
destBlock += '  ' + icons.join(',\n  ') + ',\n';
destBlock += '  Link: LinkIcon,\n';
destBlock += '  Image: LucideImage\n';
destBlock += '} = LucideIcons;';

const oldBlockRegex = /const\s*{\s*[\s\S]*?}\s*=\s*LucideIcons;/;
content = content.replace(oldBlockRegex, destBlock);

// 2. Fix the Math.max syntax error
// Original: animate={{ height: `Math.max(${(v.count / maxVolume) * 100}, 2)%` }}
// Target: animate={{ height: `${Math.max((v.count / maxVolume) * 100, 2)}%` }}
content = content.replace(
    /animate=\{\{\s*height:\s*`Math\.max\(\$\{(.*?)\},\s*(.*?)\)%` \}\}/g,
    'animate={{ height: `${Math.max($1, $2)}%` }}'
);

// Double check if there are other similar ones
content = content.replace(
    /style=\{\{\s*height:\s*`\$\{(.*?)\}%` \}\}/g,
    'style={{ height: `${$1}%` }}'
);

fs.writeFileSync('webUpdatesStandalone.tsx', content, 'utf8');
console.log('Fixed LucideIcons and Math.max syntax error.');
