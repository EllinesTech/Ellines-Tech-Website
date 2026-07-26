import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { SectionHeader } from '@/components/ui/SectionHeader'
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
}: {
  group: PricingServiceGroup
  initialVariantId?: string
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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.1] to-surface-elevated/90 shadow-[0_22px_55px_-28px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/45 hover:shadow-[0_28px_60px_-22px_rgba(34,211,238,0.3)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/10" />
        <img
          src="/logos/logo-mark-nav.png"
          alt=""
          width={36}
          height={36}
          className="absolute right-3 top-3 h-9 w-9 rounded-lg border border-white/15 bg-slate-950/75 object-contain p-1 shadow-lg backdrop-blur-md sm:right-4 sm:top-4"
        />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 sm:left-4">
          {multi ? (
            <span className="rounded-md border border-brand-400/35 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200 backdrop-blur-md">
              {group.variants.length} options
            </span>
          ) : (
            selected?.level && (
              <span className="rounded-md border border-brand-400/35 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200 backdrop-blur-md">
                {selected.level}
              </span>
            )
          )}
          <span className="rounded-md border border-white/15 bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300 backdrop-blur-md">
            {group.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
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
              className="max-h-[13.5rem] space-y-1.5 overflow-y-auto pr-1"
              role="radiogroup"
              aria-label={`${group.groupName} tiers`}
            >
              {group.variants.map((v) => {
                const active = v.id === selected?.id
                return (
                  <label
                    key={v.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition ${
                      active
                        ? 'border-brand-400/55 bg-brand-500/10 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.15)]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
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
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-white">{v.tierLabel}</span>
                        <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-brand-200">
                          {v.currency} {Number(v.price).toLocaleString()}
                        </span>
                      </span>
                      {(v.experienceBand || v.level) && (
                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
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

        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
          {selected?.description || group.description}
        </p>

        <div className="mt-5 border-t border-white/12 pt-4">
          <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
            {multi && (
              <span className="mr-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Selected
              </span>
            )}
            <span className="text-brand-200">{selected?.currency || group.currency}</span>{' '}
            {Number(selected?.price ?? group.fromPrice).toLocaleString()}
          </p>
          {multi && (
            <p className="mt-1 text-xs text-slate-500">
              From {group.currency} {group.fromPrice.toLocaleString()} · pick the tier that fits
              your pocket and needs
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              href={`/request?intent=buy&package=${encodeURIComponent(selected?.id || '')}`}
              size="sm"
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
  const [products, setProducts] = useState<PricingPackage[]>([])
  const [error, setError] = useState('')
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

  return (
    <>
      <SEO
        title="Product Pricing"
        description="Transparent Kenya-market packages with in-card options — choose by experience, needs, and budget across career docs, web, consulting, design, and more."
        path="/pricing"
      />
      <section className="section-padding">
        <div className="section-container">
          <SectionHeader
            eyebrow="Product pricing"
            title="Services with options that fit"
            description="Each card holds multiple tiers — pick by experience band, scope, or pocket. We confirm the selected option, then share payment details."
            align="center"
            className="mb-8"
          />
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <Button href="/request?intent=buy" icon>
              Buy a package
            </Button>
            <Button href="/request?intent=quote" variant="secondary">
              Custom quote
            </Button>
            <Button href="/account" variant="ghost">
              Client login
            </Button>
          </div>
          {error && <p className="mb-6 text-center text-sm text-amber-200">{error}</p>}
          {!user && (
            <p className="mb-8 text-center text-sm text-slate-400">
              <Link to="/account" className="font-semibold text-brand-300">
                Create a client account
              </Link>{' '}
              to track packages, requests, and invoices.
            </p>
          )}

          {categories.map((category) => (
            <div key={category} className="mb-14">
              <h2 className="mb-6 font-display text-lg font-semibold tracking-wide text-brand-300">
                {category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {groups
                  .filter((g) => g.category === category)
                  .map((g) => (
                    <ServicePricingCard
                      key={g.groupId}
                      group={g}
                      initialVariantId={
                        preselect && g.variants.some((v) => v.id === preselect)
                          ? preselect
                          : undefined
                      }
                    />
                  ))}
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <p className="text-center text-slate-400">
              Pricing is being updated. Contact us for a custom quote.
            </p>
          )}
        </div>
      </section>
    </>
  )
}

/** @deprecated use PricingPage — kept for route alias */
export const ShopPage = PricingPage
