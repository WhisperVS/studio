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
        // Core Tailwind variables - mapped to our RGB theme system
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        
        // Card/Panel colors
        card: 'rgb(var(--card))',
        'card-foreground': 'rgb(var(--card-foreground))',
        
        // Modal/Dialog colors
        popover: 'rgb(var(--popover))',
        'popover-foreground': 'rgb(var(--popover-foreground))',
        
        // Primary button colors
        primary: 'rgb(var(--primary))',
        'primary-foreground': 'rgb(var(--primary-foreground))',
        
        // Secondary colors
        secondary: 'rgb(var(--secondary))',
        'secondary-foreground': 'rgb(var(--secondary-foreground))',
        
        // Muted/disabled colors
        muted: 'rgb(var(--muted))',
        'muted-foreground': 'rgb(var(--muted-foreground))',
        
        // Accent colors
        accent: 'rgb(var(--accent))',
        'accent-foreground': 'rgb(var(--accent-foreground))',
        
        // Destructive/Delete button colors
        destructive: 'rgb(var(--destructive))',
        'destructive-foreground': 'rgb(var(--destructive-foreground))',
        
        // Input and border colors
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))',
        
        // Chart colors
        chart: {
          '1': 'rgb(var(--chart-1))',
          '2': 'rgb(var(--chart-2))',
          '3': 'rgb(var(--chart-3))',
          '4': 'rgb(var(--chart-4))',
          '5': 'rgb(var(--chart-5))',
        },
        
        // Sidebar colors
        sidebar: 'rgb(var(--sidebar))',
        'sidebar-foreground': 'rgb(var(--sidebar-foreground))',
        'sidebar-primary': 'rgb(var(--sidebar-primary))',
        'sidebar-primary-foreground': 'rgb(var(--sidebar-primary-foreground))',
        'sidebar-accent': 'rgb(var(--sidebar-accent))',
        'sidebar-accent-foreground': 'rgb(var(--sidebar-accent-foreground))',
        'sidebar-border': 'rgb(var(--sidebar-border))',
        'sidebar-ring': 'rgb(var(--sidebar-ring))',
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
