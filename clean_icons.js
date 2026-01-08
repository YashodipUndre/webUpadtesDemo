const fs = require('fs');
let content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// The messy destructuring block
const blockRegex = /const\s*{\s*[\s\S]*?}\s*=\s*LucideIcons;/;
const matched = content.match(blockRegex);

if (matched) {
    const cleanIcons = [
        'Search', 'Filter', 'X', 'LogOut', 'Settings', 'User', 'Mail', 'Menu',
        'Bold', 'Italic', 'Underline', 'Strikethrough', 'List', 'ListOrdered',
        'Quote', 'Code', 'Type', 'Smile', 'AtSign', 'ChevronRight', 'Calendar',
        'Clock', 'CheckCircle2', 'AlertCircle', 'Trash2', 'Plus', 'ArrowLeft',
        'BarChart2', 'BarChart3', 'MessageSquare', 'Clipboard', 'Layers', 'FileText',
        'ExternalLink', 'Home', 'File', 'MoreHorizontal', 'MoreVertical',
        'Download', 'Upload', 'Archive', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Bell', 'Check', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'Copy',
        'Database', 'Edit', 'Eye', 'EyeOff', 'Info', 'Lock', 'MapPin', 'Moon',
        'RefreshCw', 'Save', 'Send', 'Share', 'Sun', 'Tag', 'Trash', 'UserPlus',
        'Users', 'Zap', 'HelpCircle', 'Activity', 'TrendingUp', 'School',
        'ShieldCheck', 'AlertTriangle', 'Timer', 'ChevronRight as ChevronRightIcon'
    ];

    let newBlock = 'const {\n';
    newBlock += '  ' + cleanIcons.join(',\n  ') + ',\n';
    newBlock += '  Link: LinkIcon,\n';
    newBlock += '  Image: LucideImage\n';
    newBlock += '} = LucideIcons;';

    content = content.replace(blockRegex, newBlock);

    // Also, I noticed some icons might be used with different names in the code
    // Let's ensure LinkIcon is used where appropriate if it's renamed.

    fs.writeFileSync('webUpdatesStandalone.tsx', content, 'utf8');
    console.log('webUpdatesStandalone.tsx icons have been cleaned and fixed.');
}
