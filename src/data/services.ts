export type ServiceCategory =
  | 'software'
  | 'web'
  | 'mobile'
  | 'ai'
  | 'cloud'
  | 'security'
  | 'consulting'

export interface Service {
  slug: string
  name: string
  category: ServiceCategory
  description: string
  offerings: string[]
}

export const serviceCategories: Record<
  ServiceCategory,
  { label: string; description: string; icon: string }
> = {
  software: {
    label: 'Software Development',
    description: 'Custom software, enterprise systems, desktop apps, and SaaS platforms.',
    icon: 'Code2',
  },
  web: {
    label: 'Web Development',
    description: 'Company websites, e-commerce, portals, CMS, and SEO.',
    icon: 'Globe',
  },
  mobile: {
    label: 'Mobile Development',
    description: 'Android, iOS, Flutter, and progressive web applications.',
    icon: 'Smartphone',
  },
  ai: {
    label: 'AI Services',
    description: 'AI assistants, voice recognition, medical AI, chatbots, and ML.',
    icon: 'Brain',
  },
  cloud: {
    label: 'Cloud Solutions',
    description: 'Migration, Cloudflare, AWS, Azure, GCP, and VPS deployment.',
    icon: 'Cloud',
  },
  security: {
    label: 'Cybersecurity',
    description: 'Security audits, penetration testing, backup, and disaster recovery.',
    icon: 'Shield',
  },
  consulting: {
    label: 'IT Consulting',
    description: 'Digital transformation, technology strategy, infrastructure, and support.',
    icon: 'Lightbulb',
  },
}

export const services: Service[] = [
  {
    slug: 'custom-software',
    name: 'Custom Software Development',
    category: 'software',
    description: 'Tailored software solutions designed around your unique business processes.',
    offerings: ['Requirements analysis', 'Architecture design', 'Agile development', 'Maintenance & support'],
  },
  {
    slug: 'enterprise-systems',
    name: 'Enterprise Systems',
    category: 'software',
    description: 'Scalable enterprise applications for large organizations and institutions.',
    offerings: ['ERP integration', 'Legacy modernization', 'Microservices', 'API development'],
  },
  {
    slug: 'desktop-applications',
    name: 'Desktop Applications',
    category: 'software',
    description: 'Cross-platform desktop software for Windows, macOS, and Linux.',
    offerings: ['Electron apps', 'Native desktop', 'Offline-first', 'Auto-updates'],
  },
  {
    slug: 'saas-platforms',
    name: 'SaaS Platforms',
    category: 'software',
    description: 'Multi-tenant SaaS products with subscription billing and user management.',
    offerings: ['Multi-tenancy', 'Subscription billing', 'Admin dashboards', 'API-first design'],
  },
  {
    slug: 'company-websites',
    name: 'Company Websites',
    category: 'web',
    description: 'Professional corporate websites that build trust and generate leads.',
    offerings: ['Brand-aligned design', 'Content management', 'Lead capture', 'Performance optimization'],
  },
  {
    slug: 'ecommerce-development',
    name: 'E-commerce Development',
    category: 'web',
    description: 'Online stores with secure payments and inventory management.',
    offerings: ['Store setup', 'Payment integration', 'Product management', 'Analytics'],
  },
  {
    slug: 'portals-cms',
    name: 'Portals & CMS Solutions',
    category: 'web',
    description: 'Custom portals and content management systems for organizations.',
    offerings: ['User portals', 'Document management', 'Role-based access', 'Workflow automation'],
  },
  {
    slug: 'seo',
    name: 'SEO Services',
    category: 'web',
    description: 'Search engine optimization to increase visibility and organic traffic.',
    offerings: ['Technical SEO', 'Content strategy', 'Local SEO', 'Analytics & reporting'],
  },
  {
    slug: 'android-apps',
    name: 'Android App Development',
    category: 'mobile',
    description: 'Native Android applications optimized for the African market.',
    offerings: ['Material Design', 'Play Store deployment', 'Offline capabilities', 'Push notifications'],
  },
  {
    slug: 'ios-apps',
    name: 'iOS App Development',
    category: 'mobile',
    description: 'Native iOS applications for iPhone and iPad.',
    offerings: ['Swift development', 'App Store deployment', 'Apple ecosystem', 'Performance tuning'],
  },
  {
    slug: 'flutter-development',
    name: 'Flutter Development',
    category: 'mobile',
    description: 'Cross-platform mobile apps with a single codebase for Android and iOS.',
    offerings: ['Single codebase', 'Custom UI', 'Firebase integration', 'Fast iteration'],
  },
  {
    slug: 'progressive-web-apps',
    name: 'Progressive Web Apps',
    category: 'mobile',
    description: 'Web applications that work like native apps on any device.',
    offerings: ['Offline support', 'Install prompts', 'Push notifications', 'Responsive design'],
  },
  {
    slug: 'ai-assistants',
    name: 'AI Assistants',
    category: 'ai',
    description: 'Custom AI assistants for customer support, internal knowledge, and automation.',
    offerings: ['Custom training', 'Multi-channel', 'Analytics', 'Continuous learning'],
  },
  {
    slug: 'voice-recognition',
    name: 'Voice Recognition',
    category: 'ai',
    description: 'Speech-to-text and voice command systems for hands-free interaction.',
    offerings: ['Real-time transcription', 'Voice commands', 'Multilingual', 'Custom vocabularies'],
  },
  {
    slug: 'medical-ai',
    name: 'Medical AI',
    category: 'ai',
    description: 'AI solutions designed for healthcare — clinical documentation, triage, and diagnostics support.',
    offerings: ['Clinical NLP', 'Diagnostic support', 'HIPAA-aware design', 'EHR integration'],
  },
  {
    slug: 'chatbots',
    name: 'Chatbots',
    category: 'ai',
    description: 'Intelligent chatbots for websites, WhatsApp, and enterprise messaging.',
    offerings: ['WhatsApp bots', 'Website widgets', 'CRM integration', 'Conversation analytics'],
  },
  {
    slug: 'machine-learning',
    name: 'Machine Learning',
    category: 'ai',
    description: 'Custom ML models for prediction, classification, and automation.',
    offerings: ['Model training', 'Data pipelines', 'MLOps', 'Edge deployment'],
  },
  {
    slug: 'cloud-migration',
    name: 'Cloud Migration',
    category: 'cloud',
    description: 'Seamless migration of applications and data to the cloud.',
    offerings: ['Assessment', 'Migration planning', 'Zero-downtime migration', 'Cost optimization'],
  },
  {
    slug: 'cloudflare',
    name: 'Cloudflare Solutions',
    category: 'cloud',
    description: 'CDN, DNS, security, and edge computing with Cloudflare.',
    offerings: ['CDN setup', 'DNS management', 'WAF & DDoS protection', 'Workers & Pages'],
  },
  {
    slug: 'aws-azure-gcp',
    name: 'AWS, Azure & Google Cloud',
    category: 'cloud',
    description: 'Cloud infrastructure design and management across major providers.',
    offerings: ['Architecture design', 'Managed services', 'Auto-scaling', 'Monitoring'],
  },
  {
    slug: 'vps-deployment',
    name: 'VPS Deployment',
    category: 'cloud',
    description: 'Virtual private server setup, configuration, and maintenance.',
    offerings: ['Server provisioning', 'Docker deployment', 'SSL & security', 'Backup automation'],
  },
  {
    slug: 'security-audits',
    name: 'Security Audits',
    category: 'security',
    description: 'Comprehensive security assessments for applications and infrastructure.',
    offerings: ['Vulnerability scanning', 'Code review', 'Compliance checks', 'Remediation plans'],
  },
  {
    slug: 'penetration-testing',
    name: 'Penetration Testing',
    category: 'security',
    description: 'Ethical hacking to identify and fix security vulnerabilities.',
    offerings: ['Web app testing', 'Network testing', 'Social engineering', 'Detailed reports'],
  },
  {
    slug: 'data-backup',
    name: 'Data Backup',
    category: 'security',
    description: 'Automated backup solutions to protect critical business data.',
    offerings: ['Scheduled backups', 'Cloud storage', 'Encryption', 'Restore testing'],
  },
  {
    slug: 'disaster-recovery',
    name: 'Disaster Recovery',
    category: 'security',
    description: 'Business continuity planning and disaster recovery infrastructure.',
    offerings: ['DR planning', 'Failover systems', 'RTO/RPO targets', 'Regular drills'],
  },
  {
    slug: 'digital-transformation',
    name: 'Digital Transformation',
    category: 'consulting',
    description: 'Guide your organization through digital modernization and innovation.',
    offerings: ['Process digitization', 'Change management', 'Technology roadmap', 'ROI analysis'],
  },
  {
    slug: 'technology-strategy',
    name: 'Technology Strategy',
    category: 'consulting',
    description: 'Strategic technology planning aligned with business goals.',
    offerings: ['Tech stack selection', 'Vendor evaluation', 'Build vs buy analysis', 'Roadmapping'],
  },
  {
    slug: 'infrastructure-design',
    name: 'Infrastructure Design',
    category: 'consulting',
    description: 'Scalable, secure IT infrastructure architecture for growing businesses.',
    offerings: ['Network design', 'Server architecture', 'Cloud strategy', 'Documentation'],
  },
  {
    slug: 'it-support',
    name: 'IT Support',
    category: 'consulting',
    description: 'Ongoing technical support and managed IT services.',
    offerings: ['Help desk', 'Remote support', 'System monitoring', 'SLA-based support'],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
