/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          border: 'var(--color-border)', // gray-200
          input: 'var(--color-input)', // white
          ring: 'var(--color-ring)', // navy-800
          background: 'var(--color-background)', // gray-50
          foreground: 'var(--color-foreground)', // gray-900
          primary: {
            DEFAULT: 'var(--color-primary)', // navy-800
            foreground: 'var(--color-primary-foreground)' // white
          },
          secondary: {
            DEFAULT: 'var(--color-secondary)', // sage-700
            foreground: 'var(--color-secondary-foreground)' // white
          },
          destructive: {
            DEFAULT: 'var(--color-destructive)', // red-600
            foreground: 'var(--color-destructive-foreground)' // white
          },
          muted: {
            DEFAULT: 'var(--color-muted)', // gray-50
            foreground: 'var(--color-muted-foreground)' // gray-500
          },
          accent: {
            DEFAULT: 'var(--color-accent)', // amber-600
            foreground: 'var(--color-accent-foreground)' // white
          },
          popover: {
            DEFAULT: 'var(--color-popover)', // white
            foreground: 'var(--color-popover-foreground)' // gray-900
          },
          card: {
            DEFAULT: 'var(--color-card)', // white
            foreground: 'var(--color-card-foreground)' // gray-900
          },
          success: {
            DEFAULT: 'var(--color-success)', // emerald-600
            foreground: 'var(--color-success-foreground)' // white
          },
          warning: {
            DEFAULT: 'var(--color-warning)', // amber-600
            foreground: 'var(--color-warning-foreground)' // white
          },
          error: {
            DEFAULT: 'var(--color-error)', // red-600
            foreground: 'var(--color-error-foreground)' // white
          }
        },
        fontFamily: {
          'sans': ['Source Sans Pro', 'sans-serif'],
          'heading': ['Inter', 'sans-serif'],
          'mono': ['JetBrains Mono', 'monospace']
        },
        fontSize: {
          'nav': '14px'
        },
        spacing: {
          'sidebar': '240px',
          'sidebar-padding': '16px',
          'content-margin': '24px'
        },
        zIndex: {
          'sidebar': '100',
          'mobile-nav': '200'
        },
        animation: {
          'pulse-slow': 'pulse 2s ease-in-out infinite'
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('tailwindcss-animate')
    ],
  }