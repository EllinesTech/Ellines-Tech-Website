import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  fetchPaymentMethods,
  savePaymentMethods,
  type PaymentMethodsConfig,
} from '@/lib/cmsApi'

const PAYSTACK_PUBLIC_DEFAULT =
  'pk_live_081be2d1bdd05a16be4cc91b1267553a6444b463'

const empty: PaymentMethodsConfig = {
  currency: 'KES',
  merchantEmail: 'ellines.group@gmail.com',
  mode: 'live',
  mpesa: {
    enabled: false,
    paybill: '',
    accountName: '',
    tillNumber: '',
    consumerKey: '',
    consumerSecret: '',
    passkey: '',
    shortcode: '',
  },
  paypal: {
    enabled: false,
    clientId: '',
    clientSecret: '',
    merchantEmail: 'ellines.group@gmail.com',
  },
  paystack: {
    enabled: true,
    publicKey: PAYSTACK_PUBLIC_DEFAULT,
    secretKey: '',
    webhookSecret: '',
    merchantEmail: 'ellines.group@gmail.com',
  },
  notes: '',
  updatedAt: '',
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  hint,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  hint?: string
  placeholder?: string
}) {
  return (
    <label className="block text-xs text-slate-400">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
      />
      {hint && <span className="mt-1 block text-[11px] text-slate-600">{hint}</span>}
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-white/20"
      />
      {label}
    </label>
  )
}

export function AdminPaymentsModule() {
  const [cfg, setCfg] = useState<PaymentMethodsConfig>(empty)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaymentMethods()
      .then((data) => {
        setCfg({
          ...empty,
          ...data,
          paystack: {
            ...empty.paystack,
            ...data.paystack,
            publicKey: data.paystack?.publicKey || PAYSTACK_PUBLIC_DEFAULT,
            merchantEmail: data.paystack?.merchantEmail || 'ellines.group@gmail.com',
          },
          mode: data.mode === 'sandbox' ? 'sandbox' : 'live',
          currency: data.currency || 'KES',
          merchantEmail: data.merchantEmail || 'ellines.group@gmail.com',
        })
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setError('')
    setMessage('')
    try {
      const res = await savePaymentMethods(cfg)
      if (res.payments) setCfg(res.payments as PaymentMethodsConfig)
      setMessage(
        'Payment settings saved. Paystack checkout uses the secret from Cloudflare Pages (PAYSTACK_SECRET_KEY) when set; otherwise the secret stored here.',
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading payment settings…</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Payment methods</h2>
        <p className="mt-1 text-sm text-slate-400">
          Super Admin control for M-Pesa (Paybill / Buy Goods), PayPal, and Paystack. Paystack is
          the live checkout path for Tech invoices and fixed packages.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
        <h3 className="font-display text-lg font-semibold text-white">Global</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field
            label="Default currency"
            value={cfg.currency}
            onChange={(v) => setCfg({ ...cfg, currency: v })}
            hint="KES default; USD also supported on Paystack charges"
          />
          <Field
            label="Merchant email"
            value={cfg.merchantEmail}
            onChange={(v) => setCfg({ ...cfg, merchantEmail: v })}
            hint="Paystack / PayPal account owner"
          />
          <label className="block text-xs text-slate-400">
            Mode
            <select
              value={cfg.mode}
              onChange={(e) =>
                setCfg({ ...cfg, mode: e.target.value === 'live' ? 'live' : 'sandbox' })
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="sandbox">Sandbox / test</option>
              <option value="live">Live</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-white">M-Pesa</h3>
          <Toggle
            label="Enable M-Pesa"
            checked={cfg.mpesa.enabled}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, enabled: v } })}
          />
        </div>
        <p className="text-xs text-slate-500">
          Paybill and Buy Goods (Till) numbers for manual or future STK Push flows.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Paybill number"
            value={cfg.mpesa.paybill}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, paybill: v } })}
          />
          <Field
            label="Account name / reference"
            value={cfg.mpesa.accountName}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, accountName: v } })}
          />
          <Field
            label="Till / Buy Goods number"
            value={cfg.mpesa.tillNumber}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, tillNumber: v } })}
          />
          <Field
            label="Shortcode"
            value={cfg.mpesa.shortcode}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, shortcode: v } })}
          />
          <Field
            label="Consumer key"
            value={cfg.mpesa.consumerKey}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, consumerKey: v } })}
            type="password"
            hint={
              cfg.mpesa.consumerKeySet
                ? 'Saved — leave blank to keep.'
                : 'Leave blank to keep existing.'
            }
          />
          <Field
            label="Consumer secret"
            value={cfg.mpesa.consumerSecret}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, consumerSecret: v } })}
            type="password"
            hint={
              cfg.mpesa.consumerSecretSet
                ? 'Saved — leave blank to keep.'
                : 'Leave blank to keep existing.'
            }
          />
          <Field
            label="Passkey"
            value={cfg.mpesa.passkey}
            onChange={(v) => setCfg({ ...cfg, mpesa: { ...cfg.mpesa, passkey: v } })}
            type="password"
            hint={
              cfg.mpesa.passkeySet
                ? 'Saved — leave blank to keep.'
                : 'Leave blank to keep existing.'
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-white">PayPal</h3>
          <Toggle
            label="Enable PayPal"
            checked={cfg.paypal.enabled}
            onChange={(v) => setCfg({ ...cfg, paypal: { ...cfg.paypal, enabled: v } })}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Client ID"
            value={cfg.paypal.clientId}
            onChange={(v) => setCfg({ ...cfg, paypal: { ...cfg.paypal, clientId: v } })}
          />
          <Field
            label="Client secret"
            value={cfg.paypal.clientSecret}
            onChange={(v) => setCfg({ ...cfg, paypal: { ...cfg.paypal, clientSecret: v } })}
            type="password"
          />
          <Field
            label="Merchant email"
            value={cfg.paypal.merchantEmail}
            onChange={(v) => setCfg({ ...cfg, paypal: { ...cfg.paypal, merchantEmail: v } })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.04] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-white">Paystack (primary)</h3>
          <Toggle
            label="Enable Paystack"
            checked={cfg.paystack.enabled}
            onChange={(v) => setCfg({ ...cfg, paystack: { ...cfg.paystack, enabled: v } })}
          />
        </div>
        <p className="text-xs text-slate-400">
          Hub URLs (configure in Paystack dashboard): callback{' '}
          <code className="text-slate-300">https://ellines.co.ke/pay/return</code>, webhook{' '}
          <code className="text-slate-300">https://ellines.co.ke/api/paystack/webhook</code>. Checkout
          prefers Paystack Inline (on-site popup); hosted redirect remains the fallback. Prefer
          storing the secret as Cloudflare Pages secret <code className="text-slate-300">PAYSTACK_SECRET_KEY</code>.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Public key"
            value={cfg.paystack.publicKey}
            onChange={(v) => setCfg({ ...cfg, paystack: { ...cfg.paystack, publicKey: v } })}
            hint="Safe to store here"
          />
          <Field
            label="Secret key"
            value={cfg.paystack.secretKey}
            onChange={(v) => setCfg({ ...cfg, paystack: { ...cfg.paystack, secretKey: v } })}
            type="password"
            hint="Leave blank to keep existing. Production: use Cloudflare secret instead."
            placeholder="sk_live_… (never commit)"
          />
          <Field
            label="Webhook secret (optional)"
            value={cfg.paystack.webhookSecret || ''}
            onChange={(v) => setCfg({ ...cfg, paystack: { ...cfg.paystack, webhookSecret: v } })}
            type="password"
            hint="Or env PAYSTACK_WEBHOOK_SECRET. Falls back to secret key for signature verify."
          />
          <Field
            label="Merchant email"
            value={cfg.paystack.merchantEmail}
            onChange={(v) => setCfg({ ...cfg, paystack: { ...cfg.paystack, merchantEmail: v } })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
        <label className="block text-xs text-slate-400">
          Internal notes
          <textarea
            value={cfg.notes}
            onChange={(e) => setCfg({ ...cfg, notes: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-brand-400/40"
            placeholder="Bank details, settlement notes, which products use which method…"
          />
        </label>
        {cfg.updatedAt && (
          <p className="text-[11px] text-slate-600">
            Last saved {new Date(cfg.updatedAt).toLocaleString()}
          </p>
        )}
      </section>

      <Button type="button" onClick={() => void save()}>
        Save payment settings
      </Button>
    </div>
  )
}
