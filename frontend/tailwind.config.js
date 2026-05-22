/** @type {import('tailwindcss').Config} */
export default {
  // Scans these files for Tailwind utility classes to compile only what we use
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define a premium and high-fidelity corporate brand palette
      colors: {
        brand: {
          dark: '#0B0C10',       // Main background deep black
          charcoal: '#1F2833',   // Card / Section background
          steel: '#C5C6C7',      // Secondary font grey
          teal: '#66FCF1',       // High neon-cyan highlights
          emerald: '#45A29E',    // Muted accent emerald green
          gold: '#D4AF37'        // Elegant metallic gold branding
        }
      },
      // Subtle premium animations for buttons and hover card triggers
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        }
      }
    },
  },
  plugins: [],
}
