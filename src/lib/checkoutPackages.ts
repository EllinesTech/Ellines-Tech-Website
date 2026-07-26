import { starterPricingPackages, type PricingPackage } from '@/data/pricingPackages'

/** Categories eligible for Paystack instant checkout (fixed-price packs). */
export const INSTANT_CHECKOUT_CATEGORIES = new Set([
  'Career Documents',
  'Tax & Compliance',
  'Graphics',
  'Stationery',
  'Tech Support',
])

export function isInstantCheckoutPackage(pkg: Pick<PricingPackage, 'category' | 'price'> | null | undefined) {
  if (!pkg) return false
  if (!INSTANT_CHECKOUT_CATEGORIES.has(String(pkg.category || ''))) return false
  return Number(pkg.price) > 0
}

export function findPackageById(id: string, list?: PricingPackage[]) {
  const pool = list?.length ? list : starterPricingPackages
  return pool.find((p) => p.id === id) || null
}
