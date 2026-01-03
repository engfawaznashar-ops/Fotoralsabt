import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          yellow: '#F2C94C',
          black: '#000000',
          sand: '#FFF7D9',
          gray: '#4F4F4F',
        },
        // Semantic Colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        changa: ['Changa', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      fontSize: {
        'display-ar': ['4rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-ar': ['2.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'subheading-ar': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-ar': ['1.125rem', { lineHeight: '1.8', fontWeight: '400' }],
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(242, 201, 76, 0.15)',
        'warm-lg': '0 8px 40px rgba(242, 201, 76, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'bounce-x': 'bounceX 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
        bounceX: {
          '0%': { transform: 'translateX(0)', width: '33%' },
          '50%': { transform: 'translateX(100%)', width: '50%' },
          '100%': { transform: 'translateX(200%)', width: '33%' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

