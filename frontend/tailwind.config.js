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
          dark: '#0A0A0A',       // Matte Black
          charcoal: '#1A1A1A',   // Deep Charcoal
          steel: '#B0B5B9',      // Metallic Silver text
          red: '#E60000',        // Tachometer Red
          emerald: '#FF3333',    // Muted accent red
          silver: '#E0E0E0'      // Metallic Silver
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
