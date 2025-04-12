// import { defineNuxtConfig } from "nuxt/config"

// export default defineNuxtConfig({
//   // Replace 'target: static' with the Nuxt 3 equivalent
//   ssr: false,

//   // Nitro configuration for Vercel deployment
//   nitro: {
//     preset: "vercel",
//   },

//   postcss: {
//     plugins: {
//       "postcss-import": {},
//       "tailwindcss/nesting": {},
//       tailwindcss: {},
//       autoprefixer: {},
//     },
//   },

//   app: {
//     head: {
//       title: "Satisfy - Order your favorite meals from any food vendor on campus with just a few taps.",
//       htmlAttrs: { lang: "en" },
//       meta: [
//         { charset: "utf-8" },
//         { name: "viewport", content: "width=device-width, initial-scale=1" },
//         { name: "format-detection", content: "telephone=no" },
//       ],
//       link: [
//         { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
//         // Remove this if you're using the @nuxtjs/google-fonts module
//         // {
//         //   rel: 'stylesheet',
//         //   href: 'https://fonts.googleapis.com/css2?family=Lexend+Tera:wght@100..900&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap',
//         // }
//       ],
//       script: [
//         {
//           src: "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
//           type: "text/javascript",
//         },
//       ],
//     },
//   },

//   googleFonts: {
//     families: {
//       Lexend: [400, 500, 700], // Changed from 'Lexend+Tera' to 'Lexend'
//       "Rethink Sans": [400, 500, 700, 800], // Added this to match your manual import
//     },
//     display: "swap",
//     prefetch: true,
//     preconnect: true,
//     preload: true,
//   },

//   plugins: ["~/plugins/aos.client.ts"],
//   css: ["/assets/css/main.css"],
//   modules: ["@kevinmarrec/nuxt-pwa", "@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],

//   pwa: {
//     workbox: {
//       enabled: true,
//     },
//     meta: {
//       title: "Satisfy - Order your favorite meals from any food vendor on campus with just a few taps.",
//       author: "Marquis",
//       mobileAppIOS: false,
//       mobileApp: true,
//       description:
//         "Order your favorite meals from any food vendor on campus with just a few taps.",
//       theme_color: "#27396B",
//       background_color: "#27396B",
//       display: "standalone",
//       start_url: "/",
//       nativeUI: true,
//     },
//     icon: {
//       sizes: [64, 120, 144, 152, 192, 384, 512],
//     },
//     manifest: {
//       name: "Buildr", // Changed from "Achilles Drill" to match your app title
//       lang: "en", // Changed from "fa" to match your htmlAttrs
//       useWebmanifestExtension: false,
//     },
//     runtimeCaching: [
//       {
//         urlPattern: "https://fonts.googleapis.com/.*",
//         handler: "cacheFirst",
//         method: "GET",
//         strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
//       },
//       {
//         urlPattern: "https://fonts.gstatic.com/.*",
//         handler: "cacheFirst",
//         method: "GET",
//         strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
//       },
//       {
//         urlPattern: "https://cdn.snipcart.com/.*",
//         method: "GET",
//         strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
//       },
//       {
//         urlPattern: "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
//         handler: "cacheFirst",
//         method: "GET",
//         strategyOptions: { cacheableResponse: { statuses: [0, 200] } },
//       },
//     ],
//   },
//   compatibilityDate: "2025-03-27",
// })
export default {
  ssr: false,
  target: "static",
  app: {
    head: {
      title: "Black Country",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.svg" },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/driver.js/dist/driver.min.css' }
      ],
      script: [
        {
          src: "https://newwebpay.qa.interswitchng.com/inline-checkout.js",
          defer: true,
        },

      ]
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["/assets/css/main.css"],

  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
  build: {
    transpile: [],
  },
  axios: {
    timeout: 10000, // Example: set timeout to 10 seconds
    // Axios options here
  },

  plugins: [],

  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal']
    },
    build: {
      rollupOptions: {},
      // transpile: ['@vueup/vue-quill'],
    },
    server: {
      port: 3001
      // fs: {
      //   allow: ["public/lib"],
      // },
    },
  },


  compatibilityDate: "2024-09-30"
};
