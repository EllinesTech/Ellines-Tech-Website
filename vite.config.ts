import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'et-html-env-inject',
      transformIndexHtml(html) {
        const verify = String(process.env.VITE_GOOGLE_SITE_VERIFICATION || '').trim()
        if (!verify) return html
        const tag = `    <meta name="google-site-verification" content="${verify.replace(/"/g, '')}" />\n`
        return html.replace('</head>', `${tag}  </head>`)
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5174,
    strictPort: true,
    // Pages Functions (CMS, chat, AI) run on wrangler — see `npm run dev:api`
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
      },
      '/pay': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
    // Same as server: vite preview alone has no Workers; proxy to `dev:api`
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
      },
      '/pay': {
        target: 'http://127.0.0.1:8788',
        changeOrigin: true,
      },
    },
  },
})
