export default defineNuxtConfig({
  // Keep SSR true for Cloudflare Pages
  ssr: true,

  nitro: {
    preset: 'cloudflare-pages',
    output: {
      dir: '.output',
      publicDir: '.output/public'
    },
    prerender: {
      crawlLinks: true,     // Add this to prerender linked pages
      routes: ['/']         // Add this to ensure root is prerendered
    },
    publicAssets: [
      {
        dir: 'public',
        maxAge: 60 * 60 * 24 * 365 // Cache for 1 year
      }
    ]
  },

  // Use ISR (Incremental Static Regeneration) for all routes
  routeRules: {
    '/api/**': { prerender: false }, // CloudFlare Functions - don't prerender API routes
    '/compliance/**': { prerender: false }, // Disable prerendering for compliance pages due to API dependencies
    '/all-games': { prerender: false }, // Disable prerendering for all-games page (contains external game links)
    '/**': { isr: true }
  },

  // Add this experimental feature for better Cloudflare Pages compatibility
  experimental: {
    payloadExtraction: false
  },

  css: ['~/assets/main.css'],

  plugins: [
    '~/plugins/language.js',
    '~/plugins/hreflang.js',
    '~/plugins/vue-gtm.client.js',
  ],

  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: 'Dukes Casino - Your Casino!',
      meta: [
        { name: 'description', content: "Enjoy seamless mobile gaming with Dukes Casino's mobile slots." }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ],
    },
    baseURL: '/' // Ensure base URL is set correctly
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ''
        }
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]'
        }
      }
    }
  },

  compatibilityDate: '2025-04-03'
});