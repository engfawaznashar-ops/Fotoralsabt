/**
 * Design System Tokens for فطور السبت
 * Consistent spacing, colors, shadows, and typography
 */

// Spacing System (px)
export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  '2xl': 80,
} as const

// Color Palette
export const colors = {
  // Brand
  yellow: {
    DEFAULT: '#F2C94C',
    light: '#F6E7A1',
    dark: '#E5B83D',
    gradient: 'linear-gradient(135deg, #F2C94C 0%, #F6E7A1 100%)',
  },
  black: '#000000',
  sand: '#FFF7D9',
  warmGray: '#4F4F4F',
  white: '#FFFFFF',
  
  // Semantic
  success: '#27AE60',
  warning: '#F2994A',
  error: '#EB5757',
  info: '#2F80ED',
} as const

// Typography
export const typography = {
  fontFamily: {
    heading: 'Changa, sans-serif',
    body: 'Tajawal, sans-serif',
    accent: 'Cairo, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const

// Shadows (soft, 8-12 blur)
export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
  md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.10)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.12)',
  warm: '0 4px 20px rgba(242, 201, 76, 0.15)',
  warmLg: '0 8px 40px rgba(242, 201, 76, 0.2)',
} as const

// Border Radius
export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
} as const

// Animation
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const

// Grid
export const grid = {
  columns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap: {
    sm: '16px',
    md: '24px',
    lg: '32px',
  },
} as const

// Z-Index
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const



