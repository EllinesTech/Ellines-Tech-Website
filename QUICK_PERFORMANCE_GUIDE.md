# Quick Performance Guide

## 🚨 If Site Feels Slow Again

### 1. Check Bundle Sizes
```bash
npm run build
ls -lh dist/assets/*.js | sort -k5 -hr
```
**Alert if:** Any chunk > 300KB

### 2. Check Network Requests
1. Open Chrome DevTools → Network tab
2. Throttle to "Fast 3G"
3. Reload page
4. **Alert if:** Initial load > 3 seconds

### 3. Check Scroll Performance
1. Open Chrome DevTools → Performance tab
2. Record while scrolling
3. Check FPS meter
4. **Alert if:** FPS < 50 consistently

### 4. Run Lighthouse
```bash
npx lighthouse http://localhost:5174 --view
```
**Alert if:** Performance score < 80

---

## ✅ Performance Best Practices

### When Adding New Features

#### ❌ DON'T
```typescript
// DON'T load heavy libraries on every page
import HugeLibrary from 'huge-lib'

// DON'T make multiple sequential API calls
useEffect(() => {
  fetch('/api/data1').then(...)
  fetch('/api/data2').then(...)
  fetch('/api/data3').then(...)
}, [])

// DON'T animate with layout properties
<motion.div
  initial={{ y: 100, x: 50, scale: 0.8 }}
  animate={{ y: 0, x: 0, scale: 1 }}
/>

// DON'T use background-attachment: fixed
background-attachment: fixed; /* Repaints on scroll */

// DON'T load all images eagerly
<img src={bigImage} />
```

#### ✅ DO
```typescript
// DO lazy load heavy features
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// DO batch API calls
useEffect(() => {
  Promise.all([
    fetch('/api/data1'),
    fetch('/api/data2'),
    fetch('/api/data3'),
  ]).then(...)
}, [])

// DO animate with opacity/transform only
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
/>

// DO use background-attachment: scroll
background-attachment: scroll; /* No repaints */

// DO lazy load images below fold
<img src={image} loading="lazy" decoding="async" />
```

---

## 🎯 Quick Wins Checklist

### Adding a New Page
- [ ] Split page into its own chunk (already configured)
- [ ] Add `loading="lazy"` to all images
- [ ] Use `Promise.all()` for multiple API calls
- [ ] Keep animations simple (opacity only)
- [ ] Test on Fast 3G throttle

### Adding a New Component
- [ ] Use `React.memo()` if it renders frequently
- [ ] Avoid unnecessary `useEffect` hooks
- [ ] Keep bundle imports minimal
- [ ] Test render performance in DevTools

### Adding Images
- [ ] Use `loading="lazy"` by default
- [ ] Use `loading="eager"` only for above-the-fold
- [ ] Add `decoding="async"`
- [ ] Optimize file size before committing

### Adding Animations
- [ ] Animate opacity/transform only
- [ ] Add `will-change` for long-running animations
- [ ] Test on mobile device
- [ ] Ensure `prefers-reduced-motion` is respected

---

## 🔧 Quick Fixes

### Page loads slow
```typescript
// Check: Is code being lazy loaded?
const HeavyPage = lazy(() => import('./HeavyPage'))

// Check: Are images lazy loaded?
<img loading="lazy" />

// Check: Are API calls parallel?
Promise.all([api1(), api2()])
```

### Scroll is janky
```css
/* Check: Are gradients too complex? */
background-image: radial-gradient(...); /* Max 2 gradients */

/* Check: Is background fixed? */
background-attachment: scroll; /* Not fixed */

/* Check: Do animations use layout properties? */
/* Avoid: y, x, width, height, top, left */
/* Use: opacity, transform, scale */
```

### Images load slowly
```typescript
// Check: Is lazy loading enabled?
<img loading="lazy" decoding="async" />

// Check: Are images optimized?
// Use WebP format, resize to actual display size
```

### Admin panel slows site
```typescript
// Check: Is admin code split?
// In vite.config.ts:
if (id.includes('src/pages/admin/')) {
  return 'admin'
}
```

---

## 📊 Performance Targets

### Must Have (Critical)
- **Initial Bundle:** < 300 KB
- **First Load (3G):** < 3 seconds
- **Lighthouse Score:** > 80
- **Scroll FPS:** > 50

### Nice to Have (Optimal)
- **Initial Bundle:** < 250 KB
- **First Load (3G):** < 2 seconds
- **Lighthouse Score:** > 90
- **Scroll FPS:** > 55

### Exceptional (Aspirational)
- **Initial Bundle:** < 200 KB
- **First Load (3G):** < 1.5 seconds
- **Lighthouse Score:** > 95
- **Scroll FPS:** = 60

---

## 🚀 Deploy Checklist

Before pushing:
- [ ] `npm run build` succeeds
- [ ] No chunks > 300KB
- [ ] Test on localhost:5174
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] Images load lazily

After pushing:
- [ ] Check Cloudflare build logs
- [ ] Test on production URL
- [ ] Run Lighthouse on production
- [ ] Monitor real user metrics

---

## 🔍 Debug Commands

```bash
# Build and check sizes
npm run build
ls -lh dist/assets/*.js

# Analyze bundle composition
npx vite-bundle-visualizer

# Test production build locally
npm run preview:full

# Run Lighthouse
npx lighthouse http://localhost:5174 --view

# Check bundle dependencies
npm run build -- --mode production

# Find large dependencies
npx @mixer/webpack-bundle-analyzer
```

---

## 📱 Mobile Testing

1. Chrome DevTools → Device Toolbar
2. Select "Moto G Power" or similar
3. Throttle: "Fast 3G"
4. Check:
   - Load time < 3s
   - Scroll smooth
   - Images lazy load
   - No layout shift

---

## ⚡ Current Optimizations Active

✅ Bundle splitting (12 chunks)  
✅ Lazy image loading  
✅ Simplified CSS gradients  
✅ GPU-accelerated animations  
✅ Parallel API calls  
✅ Reduced motion support  
✅ Optimized polling intervals  

---

**Keep it fast! 🚀**
