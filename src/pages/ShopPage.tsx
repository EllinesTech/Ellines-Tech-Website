import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/Button'
import { fetchShop } from '@/lib/cmsApi'
import { loadAuthUser } from '@/lib/auth'
import {
  starterPricingPackages,
  retiredPricingIds,
  groupPricingPackages,
  orderedCategoriesFromGroups,
  type PricingPackage,
  type PricingServiceGroup,
} from '@/data/pricingPackages'
import { packagePosterMap, posterForPackage } from '@/data/posterMap'
import { siteConfig } from '@/data/site'
import { isInstantCheckoutPackage } from '@/lib/checkoutPackages'
import { cn } from '@/lib/utils'

function normalizePackages(list: PricingPackage[]): PricingPackage[] {
  const retired = new Set<string>(retiredPricingIds)
  return list
    .filter(
      (p) =>
        p.status === 'published' &&
        !retired.has(p.id) &&
        !String(p.name || '').toLowerCase().includes('hosting'),
    )
    .map((p) => ({
      ...p,
      groupId: p.groupId || p.id,
      groupName: p.groupName || p.name,
      tierLabel: p.tierLabel || p.level || p.name,
    }))
}

function ServicePricingCard({
  group,
  initialVariantId,
  showCategory,
}: {
  group: PricingServiceGroup
  initialVariantId?: string
  showCategory: boolean
}) {
  const defaultId =
    (initialVariantId && group.variants.some((v) => v.id === initialVariantId)
      ? initialVariantId
      : group.variants[0]?.id) || ''
  const [selectedId, setSelectedId] = useState(defaultId)
  const selected =
    group.variants.find((v) => v.id === selectedId) || group.variants[0]

  const poster =
    (selected && (packagePosterMap[selected.id] || selected.image)) ||
    group.image ||
    (selected ? posterForPackage(selected) : '/media/posters/packages/shop_starter_web.jpg')

  const multi = group.variants.length > 1

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.08] to-surface-elevated/95 shadow-[0_22px_55px_-28px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.04] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/40 hover:shadow-[0_28px_60px_-22px_rgba(34,211,238,0.28)]">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-slate-950">
        <img
          key={poster}
          src={poster}
          alt={`${group.groupName} — package preview`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget
            if (el.dataset.fallback === '1') return
            el.dataset.fallback = '1'
            if (selected) {
              el.src = posterForPackage({
                ...selected,
                id: undefined,
                image: undefined,
              })
            }
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/10" />
        <img
          src="/logos/logo-mark-nav.png"
          alt=""
          width={36}
          height={36}
          className="absolute right-3 top-3 h-9 w-9 rounded-lg border border-white/15 bg-slate-950/75 object-contain p-1 shadow-lg backdrop-blur-md sm:right-4 sm:top-4"
        />
        {multi && (
          <span className="absolute bottom-3 left-3 rounded-md border border-brand-400/35 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200 backdrop-blur-md sm:left-4">
            {group.variants.length} options
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
        {showCategory && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {group.category}
          </p>
        )}
        <h3 className="font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-200 sm:text-xl">
          {group.groupName}
        </h3>

        {multi ? (
          <fieldset className="mt-4">
            <legend className="sr-only">Choose a package option</legend>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Choose your option
            </p>
            <div
              className="h-[11.5rem] space-y-1 overflow-y-auto overscroll-contain pr-0.5 [scrollbar-width:thin]"
              role="radiogroup"
              aria-label={`${group.groupName} tiers`}
            >
              {group.variants.map((v) => {
                const active = v.id === selected?.id
                return (
                  <label
                    key={v.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-2.5 rounded-lg border px-2.5 py-2 transition',
                      active
                        ? 'border-brand-400/50 bg-brand-500/[0.12] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.12)]'
                        : 'border-white/[0.08] bg-white/[0.015] hover:border-white/18',
                    )}
                  >
                    <input
                      type="radio"
                      name={`tier-${group.groupId}`}
                      value={v.id}
                      checked={active}
                      onChange={() => setSelectedId(v.id)}
                      className="mt-1 h-3.5 w-3.5 shrink-0 accent-cyan-400"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-sm font-semibold leading-tight text-white">
                          {v.tierLabel}
                        </span>
                        <span className="shrink-0 font-display text-sm font-semibold tabular-nums leading-tight text-brand-200">
                          {v.currency} {Number(v.price).toLocaleString()}
                        </span>
                      </span>
                      {(v.experienceBand || v.level) && (
                        <span className="mt-0.5 block truncate text-[11px] leading-snug text-slate-500">
                          {v.experienceBand || v.level}
                        </span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-slate-300">
          {selected?.description || group.description}
        </p>

        <div className="mt-auto border-t border-white/10 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
              <span className="text-brand-200">{selected?.currency || group.currency}</span>{' '}
              {Number(selected?.price ?? group.fromPrice).toLocaleString()}
            </p>
            {multi && (
              <p className="shrink-0 text-right text-[11px] leading-snug text-slate-500">
                From {group.currency} {group.fromPrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {selected && isInstantCheckoutPackage(selected) ? (
              <Button
                href={`/request?intent=buy&package=${encodeURIComponent(selected.id)}&pay=1`}
                size="sm"
              >
                Pay now
              </Button>
            ) : null}
            <Button
              href={`/request?intent=buy&package=${encodeURIComponent(selected?.id || '')}`}
              size="sm"
              variant={selected && isInstantCheckoutPackage(selected) ? 'secondary' : 'primary'}
            >
              Buy / request
            </Button>
            <Button href="/contact#quote" size="sm" variant="ghost">
              Ask a question
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function PricingPage() {
  const location = useLocation()
  const seoPath = location.pathname.startsWith('/shop') ? '/shop' : '/pricing'
  const [products, setProducts] = useState<PricingPackage[]>([])
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const user = loadAuthUser()
  const preselect = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return new URLSearchParams(window.location.search).get('package') || ''
  }, [])

  useEffect(() => {
    fetchShop()
      .then((list) => {
        const published = normalizePackages(list as PricingPackage[])
        setProducts(
          published.length
            ? published
            : normalizePackages(starterPricingPackages),
        )
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Could not load pricing')
        setProducts(normalizePackages(starterPricingPackages))
      })
  }, [])

  const groups = useMemo(() => groupPricingPackages(products), [products])
  const categories = useMemo(() => orderedCategoriesFromGroups(groups), [groups])

  const visibleGroups = useMemo(() => {
    if (activeCategory === 'All') return groups
    return groups.filter((g) => g.category === activeCategory)
  }, [groups, activeCategory])

  // Prefer category that contains a deep-linked package
  useEffect(() => {
    if (!preselect || groups.length === 0) return
    const match = groups.find((g) => g.variants.some((v) => v.id === preselect))
    if (match) setActiveCategory(match.category)
  }, [preselect, groups])

  return (
    <>
      <SEO
        title="Pricing & Packages in Kenya"
        description="Transparent Ellines Tech pricing in Kenya — web design, software, IT consulting, design, tax returns, and career document packages with clear options and budgets."
        path={seoPath}
      />
      <section className="relative overflow-hidden border-b border-white/5">
        <img
          src={siteConfig.media.scenes.pricingHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
        <div className="pointer-events-none absolute inset-0 mesh-bg opacity-55" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-brand-500/12 blur-[100px] " />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-600/10 blur-[110px]" />
        <div className="section-container relative py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">
              Product pricing
            </p>
            <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem]">
              Services with
              <span className="mt-1 block text-gradient">options that fit</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300/95">
              Every card holds multiple tiers — pick by experience band, scope, or pocket. We
              confirm your selection, then share payment details.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/request?intent=buy" size="lg" icon>
                Buy a package
              </Button>
              <Button href="/request?intent=quote" variant="secondary" size="lg">
                Custom quote
              </Button>
            </div>
            {!user && (
              <p className="mt-8 text-sm text-slate-400">
                <Link to="/account" className="font-semibold text-brand-300">
                  Create a client account
                </Link>{' '}
                to track packages, requests, and invoices.
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          {error && (
            <p className="mb-8 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {error}
            </p>
          )}

          {categories.length > 0 && (
            <nav
              className="mb-10 flex flex-wrap gap-x-1 gap-y-1 border-b border-white/10"
              aria-label="Filter by category"
            >
              {['All', ...categories].map((cat) => {
                const active = activeCategory === cat
                const count =
                  cat === 'All'
                    ? groups.length
                    : groups.filter((g) => g.category === cat).length
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'relative -mb-px px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'text-brand-200'
                        : 'text-slate-400 hover:text-slate-200',
                    )}
                    aria-pressed={active}
                  >
                    {cat}
                    <span
                      className={cn(
                        'ml-1.5 text-[11px] tabular-nums',
                        active ? 'text-brand-400/80' : 'text-slate-600',
                      )}
                    >
                      {count}
                    </span>
                    {active && (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-400" />
                    )}
                  </button>
                )
              })}
            </nav>
          )}

          {activeCategory !== 'All' && (
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {activeCategory}
              </h2>
              <p className="text-sm text-slate-500">
                {visibleGroups.length}{' '}
                {visibleGroups.length === 1 ? 'service' : 'services'}
              </p>
            </div>
          )}

          <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {visibleGroups.map((g) => (
              <ServicePricingCard
                key={g.groupId}
                group={g}
                showCategory={activeCategory === 'All'}
                initialVariantId={
                  preselect && g.variants.some((v) => v.id === preselect)
                    ? preselect
                    : undefined
                }
              />
            ))}
          </div>

          {groups.length === 0 && (
            <p className="text-center text-slate-400">
              Pricing is being updated. Contact us for a custom quote.
            </p>
          )}

          {groups.length > 0 && visibleGroups.length === 0 && (
            <p className="text-center text-slate-400">
              No packages in this category yet.
            </p>
          )}
        </div>
      </section>

      <section className="section-padding border-t border-white/5">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-500/20 bg-gradient-to-br from-brand-900/50 via-slate-950 to-sky-950/60 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                  Nothing quite fits?
                </p>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  We&apos;ll price the work around your scope
                </h2>
                <p className="mt-4 text-slate-300">
                  Packages cover the common cases. For everything else, send a brief and
                  you&apos;ll get a written quote with timeline and deliverables.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href="/contact#quote" size="lg" icon>
                  Get a custom quote
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  Browse services
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/** @deprecated use PricingPage — kept for route alias */
export const ShopPage = PricingPage
