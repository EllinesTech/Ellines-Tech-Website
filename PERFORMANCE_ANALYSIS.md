# Website Performance Analysis - Lagging Issues

## Executive Summary

After analyzing the codebase, I've identified **several performance bottlenecks** that could cause intermittent lagging on the website. The issues range from bundle size problems to inefficient data fetching patterns and animation performance concerns.

---

## Critical Issues Found

### 1. 🔴 **LARGE BUNDLE SIZE - Main JavaScript Bundle (633KB)**

**Location:** `dist/assets/index-__GyGarL.js` (633.66 KB)

**Problem:**
- The main JavaScript bundle is **633KB** - this is extremely large for initial page load
- Downloads and parses slowly on slower connections
- Causes significant lag during initial page load and navigation

**Impact:** HIGH - Affects all users, especially on mobile/slow connections

**Solution:**
```typescript
// Current vite.config.ts has basic code splitting:
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  motion: ['framer-motion'],
}

// RECOMMENDED: Aggressive route-based code splitting needed
manualChunks(id) {
  // Split all page components
  if (id.includes('src/pages/')) {
    return 'pages'
  }
  // Split admin separately (heavy)
  if (id.includes('src/pages/admin/')) {
    return 'admin'
  }
  // Split staff separately
  if (id.includes('src/pages/staff/')) {
    return 'staff'
  }
  // Split components by domain
  if (id.includes('src/components/engagement/')) {
    return 'engagement'
  }
  if (id.includes('src/components/admin/')) {
    return 'admin-components'
  }
  // Core vendor libs
  if (id.includes('node_modules')) {
    if (id.includes('framer-motion')) return 'motion'
    if (id.includes('lucide-react')) return 'icons'
    if (id.includes('react')) return 'react-vendor'
    return 'vendor'
  }
}
```

---

### 2. 🔴 **MULTIPLE API CALLS ON EVERY PAGE LOAD (HomePage)**

**Location:** `src/pages/HomePage.tsx` lines 110-127

**Problem:**
```typescript
useEffect(() => {
  void loadPublishedServices().then(setServices)
  void loadPublishedProducts().then((list) =>
    setFeaturedProducts(list.filter((p) => p.highlights && p.image).slice(0, 4)),
  )
  void loadPublishedPortfolio().then((list) => setFeaturedPortfolio(list.slice(0, 6)))
  void loadClientBrands().then(setBrands)
  void fetchReviews()
    .then((list) => {
      if (Array.isArray(list) && list.length) {
        setTestimonials(...)
      }
    })
    .catch(() => undefined)
}, [])
```

**Impact:** HIGH - 5 separate API calls on HomePage mount causing:
- Network waterfall delays
- Blocking render of content below the fold
- Lag when navigating to home

**Solution:**
1. **Combine API calls** into a single endpoint `/api/cms?resource=homepage-data`
2. **Use React.memo** to prevent unnecessary re-renders
3. **Implement caching** with `useSWR` or React Query
4. **Lazy load** below-the-fold content

---

### 3. 🟡 **FRAMER MOTION ANIMATIONS EVERYWHERE**

**Location:** Throughout `HomePage.tsx` and components

**Problem:**
```typescript
// Every section has motion animations:
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-40px' }}
  transition={{ delay: i * 0.07, duration: 0.45 }}
>
```

**Impact:** MEDIUM - Causes jank on:
- Lower-end devices
- When many elements animate simultaneously
- During scroll with `whileInView` triggers

**Solutions:**
1. **Respect prefers-reduced-motion:**
```css
/* Already in index.css but needs enforcement */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-pulse-slow,
  .animate-marquee {
    animation: none !important;
  }
}
```

2. **Use CSS animations for simple fades:**
```css
/* Replace framer-motion for basic fades */
.fade-in {
  animation: fadeIn 0.4s ease-out;
}
```

3. **Reduce motion complexity:**
```typescript
// Simplify to opacity only on scroll
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
```

---

### 4. 🟡 **HEAVY CSS BACKGROUND GRADIENTS**

**Location:** `src/index.css` lines 59-67

**Problem:**
```css
body {
  background-image:
    radial-gradient(ellipse 100% 60% at 50% -30%, rgba(6, 182, 212, 0.2), transparent 55%),
    radial-gradient(ellipse 45% 35% at 100% 0%, rgba(14, 165, 233, 0.12), transparent 50%),
    radial-gradient(ellipse 40% 30% at 0% 20%, rgba(8, 145, 178, 0.1), transparent 45%),
    linear-gradient(180deg, #030712 0%, #070f1c 55%, #030712 100%);
  background-attachment: fixed;
}
```

**Impact:** MEDIUM - Multiple radial gradients with `background-attachment: fixed` cause:
- Repaints on scroll
- GPU strain on mobile
- Frame drops during scrolling

**Solution:**
```css
/* Simplify to 2 gradients max */
body {
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), transparent),
    linear-gradient(180deg, #030712 0%, #070f1c 50%, #030712 100%);
  /* Remove fixed attachment for better scroll performance */
  background-attachment: scroll;
}
```

---

### 5. 🟡 **INFINITE MARQUEE ANIMATION**

**Location:** `src/components/home/TechMarquee.tsx`

**Problem:**
```typescript
<div className="flex w-max animate-marquee gap-10 whitespace-nowrap pr-10">
  {items.map((tech, i) => (...))}
</div>
```
```css
.animate-marquee {
  animation: marquee 32s linear infinite;
}
```

**Impact:** LOW-MEDIUM - Continuous animation uses CPU/GPU resources

**Solution:**
1. **Use CSS transform (already good)**
2. **Add will-change hint:**
```css
.animate-marquee {
  animation: marquee 32s linear infinite;
  will-change: transform; /* GPU acceleration hint */
}
```
3. **Pause on reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation-play-state: paused;
  }
}
```

---

### 6. 🟡 **NO IMAGE OPTIMIZATION**

**Problem:** Images are not optimized:
- No lazy loading attributes
- No srcset for responsive images
- Large images loaded upfront
- No WebP format with fallbacks

**Impact:** MEDIUM - Slows initial page load and causes lag when scrolling

**Solution:**
```typescript
// Add to all images:
<img
  src={image}
  srcSet={`${image}?w=400 400w, ${image}?w=800 800w, ${image}?w=1200 1200w`}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  loading="lazy"
  decoding="async"
  alt={alt}
/>
```

---

### 7. 🟡 **POLLING IN ADMIN CHAT (Every 4 seconds)**

**Location:** `src/pages/admin/AdminLiveChatPage.tsx` lines 35-40

**Problem:**
```typescript
useEffect(() => {
  refreshList()
  const t = setInterval(refreshList, 4000) // Polls every 4 seconds
  return () => clearInterval(t)
}, [])
```

**Impact:** LOW - Only affects admin users, but constant network requests can cause lag

**Solution:**
1. Use WebSockets instead of polling
2. Increase interval to 10-15 seconds
3. Use browser visibility API to pause when tab is inactive

---

## Performance Recommendations Priority

### 🔥 IMMEDIATE (High Impact)

1. **Split the 633KB bundle** - Implement aggressive code splitting
2. **Combine HomePage API calls** - Single endpoint or parallel Promise.all with caching
3. **Add lazy loading to images** - `loading="lazy"` on all below-fold images

### ⚠️ MEDIUM PRIORITY

4. **Simplify body background gradients** - Reduce from 4 to 2 gradients, remove `fixed`
5. **Optimize framer-motion usage** - Use CSS for simple fades, reduce `whileInView`
6. **Add will-change to animations** - Help browser optimize animations

### ✅ LOW PRIORITY

7. **Implement image CDN with optimization** - WebP, responsive images
8. **Replace polling with WebSockets** - For admin chat
9. **Add service worker caching** - For repeated visits

---

## Specific Code Changes Needed

### File: `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Admin pages (heavy - 106KB currently)
          if (id.includes('src/pages/admin/')) return 'admin'
          if (id.includes('src/pages/staff/')) return 'staff'
          
          // Public pages
          if (id.includes('src/pages/')) {
            const match = id.match(/pages\/(\w+)/)
            if (match) return `page-${match[1].toLowerCase()}`
          }
          
          // Vendor splitting
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('react-dom')) return 'react-dom'
            if (id.includes('react-router')) return 'router'
            if (id.includes('react')) return 'react'
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 300, // Warn if chunk > 300KB
  },
})
```

### File: `src/pages/HomePage.tsx`

```typescript
// Replace multiple useEffect calls with single data fetch
useEffect(() => {
  // Combine into single promise
  Promise.all([
    loadPublishedServices(),
    loadPublishedProducts(),
    loadPublishedPortfolio(),
    loadClientBrands(),
    fetchReviews().catch(() => []),
  ]).then(([services, products, portfolio, brands, reviews]) => {
    setServices(services)
    setFeaturedProducts(products.filter(p => p.highlights && p.image).slice(0, 4))
    setFeaturedPortfolio(portfolio.slice(0, 6))
    setBrands(brands)
    if (Array.isArray(reviews) && reviews.length) {
      setTestimonials(reviews.map(r => ({...})))
    }
  })
}, [])
```

### File: `src/index.css`

```css
/* Optimize body background */
body {
  @apply bg-slate-950 text-slate-100 font-sans antialiased;
  background-color: #030712;
  /* Simplified gradients */
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), transparent),
    linear-gradient(180deg, #030712 0%, #070f1c 50%, #030712 100%);
  /* Change to scroll for better performance */
  background-attachment: scroll;
}

/* Add will-change for animated elements */
.animate-marquee {
  animation: marquee 32s linear infinite;
  will-change: transform;
}

.animate-float {
  animation: float 8s ease-in-out infinite;
  will-change: transform;
}
```

---

## Testing & Validation

After implementing fixes, test with:

1. **Chrome DevTools Performance tab** - Record during page load
2. **Lighthouse** - Target scores: Performance > 85, FCP < 1.8s
3. **Network throttling** - Test on "Fast 3G" and "Slow 3G"
4. **Bundle analyzer** - `npm run build && npx vite-bundle-visualizer`

---

## Expected Improvements

After implementing these fixes:

- **Initial load time:** 40-50% faster (from bundle splitting)
- **Time to Interactive:** 30-40% improvement
- **Frame rate during scroll:** Stable 60fps (from gradient/animation optimizations)
- **Perceived performance:** Significantly smoother on mobile devices

---

## Next Steps

1. Implement bundle splitting in `vite.config.ts`
2. Optimize HomePage data fetching
3. Add lazy loading to all images
4. Test on slow connections
5. Monitor with real user metrics

---

Generated: 2026-08-15
