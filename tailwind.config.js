// import plugin from 'tailwindcss/plugin';
// const shadcnConfig = {
// darkMode: ["class"],
// content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
// theme: {
//   extend: {
//     colors: {
//       border: "hsl(var(--border))",
//       input: "hsl(var(--input))",
//       ring: "hsl(var(--ring))",
//       background: "hsl(var(--background))",
//       foreground: "hsl(var(--foreground))",
//       primary: {
//         DEFAULT: "hsl(var(--primary))",
//         foreground: "hsl(var(--primary-foreground))",
//       },
//       secondary: {
//         DEFAULT: "hsl(var(--secondary))",
//         foreground: "hsl(var(--secondary-foreground))",
//       },
//       destructive: {
//         DEFAULT: "hsl(var(--destructive))",
//         foreground: "hsl(var(--destructive-foreground))",
//       },
//       muted: {
//         DEFAULT: "hsl(var(--muted))",
//         foreground: "hsl(var(--muted-foreground))",
//       },
//       accent: {
//         DEFAULT: "hsl(var(--accent))",
//         foreground: "hsl(var(--accent-foreground))",
//       },
//       popover: {
//         DEFAULT: "hsl(var(--popover))",
//         foreground: "hsl(var(--popover-foreground))",
//       },
//       card: {
//         DEFAULT: "hsl(var(--card))",
//         foreground: "hsl(var(--card-foreground))",
//       },
//     },
//     borderRadius: {
//       lg: "var(--radius)",
//       md: "calc(var(--radius) - 2px)",
//       sm: "calc(var(--radius) - 4px)",
//     },
//   },
// },
// plugins: [require("tailwindcss-animate")],
// }

// const config = {
// darkMode: shadcnConfig.darkMode,
// content: ["./components/**/*.{js,vue,ts}", "./layouts/**/*.vue", "./pages/**/*.vue", "./plugins/**/*.{js,ts}", "./nuxt.config.{js,ts}", "./app.vue", "*.{js,ts,jsx,tsx,mdx}", ...shadcnConfig.content],
// theme: {
//   extend: {
//     ...shadcnConfig.theme.extend,
//     backgroundImage: {
//       'custom-bg': "url('/heroBg.png')",
//     },
//     animation: {
//       marquee: 'marquee linear infinite',
//     },
//     colors: {
//       ...shadcnConfig.theme.extend.colors,
//       primary: '#2A732A',
//       'primary-dark': '#1F5A1F',
//       secondary: '#F6911D',
//       'secondary-dark': '#E07D0A',
//       accent: '#E20025',
//       'accent-dark': '#C30020',
//       beige: '#e9d5a9',
//       gray: {
//         25:  "#fafafa",
//         50:  "#f2f2f2",
//         100: "#e6e6e6",
//         200: "#cccccc",
//         300: "#b3b3b3",
//         400: "#999999",
//         500: "#808080",
//         600: "#666666",
//         700: "#4d4d4d",
//         800: "#333333",
//         900: "#1a1a1a",
//         925: "#0d0d0d",
//       },
//     },
//     fontFamily: {
//       sans: ['Inter', 'sans-serif'],
//       display: ['"Playfair Display"', 'serif']
//     },
//     keyframes: {
//       fadeIn: {
//         '0%': { opacity: '0' },
//         '100%': { opacity: '1' }
//       },
//       fadeInUp: {
//         '0%': { opacity: '0', transform: 'translateY(20px)' },
//         '100%': { opacity: '1', transform: 'translateY(0)' }
//       },
//       float: {
//         '0%, 100%': { transform: 'translateY(0)' },
//         '50%': { transform: 'translateY(-10px)' }
//       },
//       blob: {
//         '0%': { transform: 'translate(0px, 0px) scale(1)' },
//         '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
//         '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
//         '100%': { transform: 'translate(0px, 0px) scale(1)' }
//       }
//     },
//     animation: {
//       'fade-in': 'fadeIn 0.5s ease-out forwards',
//       'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
//       'float': 'float 3s ease-in-out infinite',
//       'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//       'blob': 'blob 7s infinite'
//     }
//   },
// },
// variants: {
//   extend: {},
// },
// plugins: [
//   ...shadcnConfig.plugins,
//   plugin(function({ addUtilities }) {
//     addUtilities({
//       '.bg-green-striped': {
//         'background-image': `linear-gradient(45deg, #0a2000 10%, transparent 10%,
//           transparent 20%, #0a2000 20%, #0a2000 30%, transparent 30%, transparent 40%,
//           #0a2000 40%, #0a2000 50%, transparent 50%, transparent 60%, #0a2000 60%,
//           #0a2000 70%, transparent 70%, transparent 80%, #0a2000 80%, #0a2000 90%,
//           transparent 90%, transparent)`,
//       },
//     })
//   })
// ],
// };

// export default config;


const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          25:  "#fafafa",
          50:  "#f2f2f2",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a",
          925: "#0d0d0d",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.bg-green-striped': {
          'background-image': `linear-gradient(45deg, #0a2000 10%, transparent 10%,
            transparent 20%, #0a2000 20%, #0a2000 30%, transparent 30%, transparent 40%,
            #0a2000 40%, #0a2000 50%, transparent 50%, transparent 60%, #0a2000 60%,
            #0a2000 70%, transparent 70%, transparent 80%, #0a2000 80%, #0a2000 90%,
            transparent 90%, transparent)`,
        },
      })
    })
  ],
}