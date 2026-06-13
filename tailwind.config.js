/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
      // 🚀 AGREGAMOS LAS ANIMACIONES EXCLUSIVAS PARA TUS DEMOS INTERACTIVAS
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Parpadeo fino para el botón "Quiero esta invitación"
        'bounce-short': 'bounceShort 2s ease-in-out infinite',          // Rebote suave para el widget flotante de estilos
        'fadeIn': 'fadeIn 0.4s ease-out forwards',                      // Entrada suave para el buscador RSVP
        'scaleUp': 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' // Efecto pop de éxito al confirmar
      },
      keyframes: {
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' } // Un rebote más sutil que el tradicional de Tailwind
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}