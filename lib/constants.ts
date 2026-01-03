// Brand Configuration
export const BRAND = {
  name: 'فطور السبت',
  tagline: 'المعرفة بصوت جديد',
  description: 'بودكاست أسبوعي يقدم لك أفضل الكتب والأفكار من خلال حوارات ملهمة ومناقشات عميقة',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://fotoralalsabt.com',
} as const

// Brand Colors
export const COLORS = {
  yellow: '#F2C94C',
  black: '#000000',
  sand: '#FFF7D9',
  warmGray: '#4F4F4F',
} as const

// Social Links
export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/fotoralalsabt',
  instagram: 'https://instagram.com/fotoralalsabt',
  youtube: 'https://youtube.com/@fotoralalsabt',
  github: 'https://github.com/fotoralalsabt',
} as const

// Navigation Links
export const NAV_LINKS = [
  { label: 'الرئيسية', href: '/' },
  { label: 'الحلقات', href: '/episodes' },
  { label: 'الكتب', href: '/books' },
  { label: 'المتحدثون', href: '/speakers' },
  { label: 'الاقتباسات', href: '/quotes' },
] as const

// Sentiment Types
export const SENTIMENTS = [
  'إيجابي',
  'ملهم',
  'تحفيزي',
  'تحليلي',
  'هادئ',
  'نقدي',
] as const

// Quote Categories
export const QUOTE_CATEGORIES = [
  'التطوير الذاتي',
  'القيادة',
  'النجاح',
  'العادات',
  'القراءة',
  'الإنتاجية',
  'العلاقات',
  'الصحة',
  'التعلم',
  'الإبداع',
  'المال',
  'الأعمال',
] as const

// Pagination
export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
} as const

// API Settings
export const API = {
  defaultTimeout: 30000, // 30 seconds
  maxRetries: 3,
} as const

// AI Settings
export const AI = {
  defaultModel: 'gpt-4-turbo-preview',
  maxTokens: 4000,
  temperature: 0.7,
} as const



