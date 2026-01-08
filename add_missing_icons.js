const fs = require('fs');
const content = fs.readFileSync('webUpdatesStandalone.tsx', 'utf8');

// Find all capitalized words used as components <Word ... />
const matches = content.match(/<([A-Z][a-zA-Z0-9]+)/g) || [];
const uniqueTags = [...new Set(matches.map(m => m.slice(1)))];

// Filter out known components defined in the file
const knownComponents = [
    'App', 'MainApp', 'StandaloneApp', 'GlobalStyles', 'Link', 'Image', 'AuthProvider',
    'LayoutShell', 'Navbar', 'Sidebar', 'RequestCard', 'TicketItemCard', 'StatusBadge',
    'ConfirmationModal', 'ProtectedRoute', 'LoginPage', 'SignupPage', 'ClientDashboardPage',
    'ClientDashboardContent', 'ClientDetailPage', 'ClientRequestDetail', 'NewRequestPage',
    'NewRequestForm', 'AdminDashboardPage', 'AdminDashboard', 'AdminReportsPage',
    'AdminReports', 'AdminDetailPage', 'AdminRequestDetail', 'ReviewerDashboardPage',
    'ReviewerDashboard', 'ReviewerDetailPage', 'ReviewerRequestDetail', 'RichTextEditor',
    'IconWrapper', 'MenuIcon', 'PlusIcon', 'StandaloneApp'
];

// Potential icons are those not in knownComponents and likely from Lucide
const potentialIcons = uniqueTags.filter(tag => !knownComponents.includes(tag));

console.log('Potential Icons found:', potentialIcons);

// Update LucideIcons destructuring
const lucideImportMatch = content.match(/const\s*{\s*[\s\S]*?}\s*=\s*LucideIcons;/);
if (lucideImportMatch) {
    const currentIconsText = lucideImportMatch[0];
    // Add missing ones
    let newIconsText = currentIconsText.replace(/}\s*=\s*LucideIcons;/, '');

    potentialIcons.forEach(icon => {
        if (!newIconsText.includes(icon) && icon !== 'RichTextEditor' && icon !== 'ToolbarButton') {
            newIconsText += `  ${icon},\n`;
        }
    });

    newIconsText += '} = LucideIcons;';

    // Also include BarChart3 explicitly just in case
    if (!newIconsText.includes('BarChart3')) {
        newIconsText = newIconsText.replace('}', '  BarChart3,\n}');
    }

    const updatedContent = content.replace(lucideImportMatch[0], newIconsText);
    fs.writeFileSync('webUpdatesStandalone.tsx', updatedContent, 'utf8');
    console.log('webUpdatesStandalone.tsx has been updated with missing icons.');
}
