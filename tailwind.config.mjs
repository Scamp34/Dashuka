/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // WHY dark theme default: Matches reference Peter Beavis portfolio design
      // Photos stand out against dark background, professional gallery aesthetic
      colors: {
        background: '#111111',
        'text-primary': '#f5f5f5',
        'text-secondary': '#a3a3a3',
        accent: '#6366f1',
      },
    },
  },
  plugins: [],
}
