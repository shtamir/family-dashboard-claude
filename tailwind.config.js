// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'tv': '1920px', // 4K TV breakpoint
      },
      fontSize: {
        // Larger font sizes for TV display
        'tv-sm': '1.25rem',   // 20px
        'tv-base': '1.5rem',  // 24px
        'tv-lg': '1.75rem',   // 28px
        'tv-xl': '2rem',      // 32px
        'tv-2xl': '2.5rem',   // 40px
        'tv-3xl': '3rem',     // 48px
      },
      spacing: {
        // Larger spacing for TV interface
        'tv-1': '0.5rem',    // 8px
        'tv-2': '0.75rem',   // 12px
        'tv-3': '1rem',      // 16px
        'tv-4': '1.5rem',    // 24px
        'tv-5': '2rem',      // 32px
        'tv-6': '3rem',      // 48px
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'media', // or 'class' for manual dark mode
}