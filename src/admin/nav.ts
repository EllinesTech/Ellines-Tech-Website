export type AdminNavItem = {
  to: string
  label: string
  icon: string
}

export type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

/** Haven-style admin navigation — adapted for Ellines Tech */
export const adminNavGroups: AdminNavGroup[] = [
  {
    title: 'Manage',
    items: [
      { to: '/admin', label: 'Dashboard', icon: 'Home' },
      { to: '/admin/activity', label: 'Activity Feed', icon: 'Activity' },
      { to: '/admin/products', label: 'Products', icon: 'Package' },
      { to: '/admin/shop', label: 'Product Pricing', icon: 'ShoppingBag' },
      { to: '/admin/services', label: 'Services', icon: 'Layers' },
      { to: '/admin/portfolio', label: 'Portfolio', icon: 'Briefcase' },
      { to: '/admin/media', label: 'Site Photos', icon: 'Image' },
      { to: '/admin/clients', label: 'Clients', icon: 'Building2' },
      { to: '/admin/leads', label: 'Leads', icon: 'Inbox' },
      { to: '/admin/invoices', label: 'Invoices', icon: 'Receipt' },
      { to: '/admin/users', label: 'Users', icon: 'Users' },
      { to: '/admin/permissions', label: 'Permissions', icon: 'KeyRound' },
      { to: '/admin/reviews', label: 'Reviews', icon: 'Star' },
      { to: '/admin/newsletter', label: 'Newsletter', icon: 'Mail' },
      { to: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
      { to: '/admin/reports', label: 'Reports', icon: 'LineChart' },
      { to: '/admin/visitors', label: 'Site Visitors', icon: 'Globe' },
      { to: '/admin/online', label: 'Online Users', icon: 'Radio' },
      { to: '/admin/settings', label: 'Settings', icon: 'Settings' },
      { to: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
      { to: '/admin/messages', label: 'Messages', icon: 'MessageSquare' },
      { to: '/admin/live-chat', label: 'Live Chat', icon: 'MessageCircle' },
      { to: '/admin/chat-settings', label: 'Chat Settings', icon: 'Bot' },
      { to: '/admin/social', label: 'Social Media', icon: 'Share2' },
      { to: '/admin/email', label: 'Email Config', icon: 'AtSign' },
      { to: '/admin/site-controls', label: 'Site Controls', icon: 'SlidersHorizontal' },
    ],
  },
  {
    title: 'Content & Features',
    items: [
      { to: '/admin/pages', label: 'Page Editor', icon: 'FilePen' },
      { to: '/admin/faq', label: 'FAQ Manager', icon: 'CircleHelp' },
      { to: '/admin/resources', label: 'Resources', icon: 'BookOpen' },
      { to: '/admin/testimonials', label: 'Testimonials', icon: 'Quote' },
    ],
  },
  {
    title: 'Power Tools',
    items: [
      { to: '/admin/design', label: 'Design Studio', icon: 'Palette' },
      { to: '/admin/security', label: 'Security', icon: 'Shield' },
      { to: '/admin/integrations', label: 'Integrations', icon: 'Puzzle' },
      { to: '/admin/logs', label: 'System Logs', icon: 'ScrollText' },
      { to: '/admin/backup', label: 'Backup & Restore', icon: 'Database' },
    ],
  },
  {
    title: 'Owner',
    items: [
      { to: '/admin/god-mode', label: 'Control Center', icon: 'Zap' },
      { to: '/admin/profile', label: 'Profile', icon: 'User' },
    ],
  },
]
