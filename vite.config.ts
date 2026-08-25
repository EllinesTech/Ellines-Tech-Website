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
        manualChunks(id) {
          // Admin pages are heavy (100KB+) - split separately
          if (id.includes('src/pages/admin/')) {
            return 'admin'
          }
          // Staff pages split
          if (id.includes('src/pages/staff/')) {
            return 'staff'
          }
          // Large admin components
          if (id.includes('src/components/admin/')) {
            return 'admin-components'
          }
          // Engagement features (chat, etc)
          if (id.includes('src/components/engagement/')) {
            return 'engagement'
          }
          
          // Vendor dependencies - split by library
          if (id.includes('node_modules')) {
            // Framer motion is 124KB - keep separate
            if (id.includes('framer-motion')) {
              return 'motion'
            }
            // Icons library
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            // React core
            if (id.includes('react-dom')) {
              return 'react-dom'
            }
            if (id.includes('react-router')) {
              return 'router'
            }
            if (id.includes('react')) {
              return 'react'
            }
            // Other node_modules
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 300, // Warn if any chunk exceeds 300KB
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
