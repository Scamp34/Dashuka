/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // WHY: Peter Beavis inspired dark minimal aesthetic
      colors: {
        background: '#0a0a0a',
        'text-primary': '#ffffff',
        'text-secondary': '#737373',
        accent: '#ffffff',
        border: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        // WHY: Clean, elegant serif for headings (like Peter Beavis)
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // WHY: Modern sans-serif for body text
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      // WHY: Custom animations for smooth page transitions
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      // WHY: Staggered delays for grid items
      transitionDelay: {
        '0': '0ms',
        '75': '75ms',
        '150': '150ms',
        '225': '225ms',
        '300': '300ms',
        '375': '375ms',
        '450': '450ms',
      },
    },
  },
  plugins: [],
}
