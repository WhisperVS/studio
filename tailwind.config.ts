import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1600px",
      },
    },
    extend: {
      fontSize: {
        sm: ['0.829rem', '1.25rem'], // Override text-sm with custom values
      },
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        // Main page colors
        background: 'var(--page-background)',
        foreground: 'var(--page-text)',
        
        // Card/Panel colors
        card: {
          DEFAULT: 'var(--card-background)',
          foreground: 'var(--card-text)',
        },
        
        // Modal/Dialog colors
        popover: {
          DEFAULT: 'var(--modal-background)',
          foreground: 'var(--modal-text)',
        },
        
        // Default button colors (for compatibility)
        primary: {
          DEFAULT: 'var(--btn-default-bg)',
          foreground: 'var(--btn-default-text)',
        },
        
        // Outline button colors
        secondary: {
          DEFAULT: 'var(--btn-outline-bg)',
          foreground: 'var(--btn-outline-text)',
        },
        
        // Muted/disabled colors
        muted: {
          DEFAULT: 'var(--dropdown-hover)',
          foreground: 'var(--input-placeholder)',
        },
        
        // Accent colors
        accent: {
          DEFAULT: 'var(--accent-color)',
          foreground: 'var(--accent-text)',
        },
        
        // Destructive/Delete button colors
        destructive: {
          DEFAULT: 'var(--btn-destructive-bg)',
          foreground: 'var(--btn-destructive-text)',
        },
        
        // Input and border colors
        border: 'var(--input-border)',
        input: 'var(--input-background)',
        ring: 'var(--focus-ring)',
        
        // Chart colors
        chart: {
          '1': 'var(--chart-color-1)',
          '2': 'var(--chart-color-2)',
          '3': 'var(--chart-color-3)',
          '4': 'var(--chart-color-4)',
          '5': 'var(--chart-color-5)',
        },
        
        // Sidebar colors
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-text)',
          primary: 'var(--sidebar-link-text)',
          'primary-foreground': 'var(--sidebar-active-text)',
          accent: 'var(--sidebar-link-hover)',
          'accent-foreground': 'var(--sidebar-active-text)',
          border: 'var(--sidebar-border)',
          ring: 'var(--focus-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
