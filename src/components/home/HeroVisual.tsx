import { motion } from 'framer-motion'

const stack = ['React', 'Python', 'AI / ML', 'Cloud', 'Flutter', 'APIs']
const products = [
  { name: 'AfyaVox', role: 'Clinical AI' },
  { name: 'RV22', role: 'AI Assistant' },
  { name: 'Juno4', role: 'AI Platform' },
]

/**
 * Dominant hero visual — product/workspace canvas (Stripe/Linear pattern),
 * not a giant logo dump. Optional faint mark accent only.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="pointer-events-none absolute -inset-8 rounded-[40%] bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.22),_transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-6 top-8 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none absolute -left-4 bottom-10 h-32 w-32 rounded-full bg-brand-400/15 blur-3xl animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 28, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="animate-float relative"
      >
        <div className="shine-edge relative overflow-hidden rounded-[1.35rem] border border-white/12 bg-gradient-to-br from-slate-900/95 via-surface-elevated/90 to-slate-950/95 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl">
          <div className="hero-grid absolute inset-0 opacity-[0.35]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/50 to-transparent" />

          <div className="relative flex items-center gap-2 border-b border-white/8 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-rose-400/80" />
            <span className="h-2 w-2 rounded-full bg-amber-300/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            <span className="ml-3 font-mono text-[11px] tracking-wide text-slate-500">
              ellines · workspace
            </span>
          </div>

          <div className="relative grid gap-4 p-4 sm:p-5">
            <div className="rounded-xl border border-white/8 bg-black/25 p-4">
              <p className="font-mono text-[11px] text-brand-300/90">deploy · production</p>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-slate-300">
                <span className="text-sky-300">const</span> africa ={' '}
                <span className="text-brand-200">await</span> build(
                <br />
                &nbsp;&nbsp;
                <span className="text-amber-200/90">&quot;your idea&quot;</span>
                <br />)
              </p>
              <p className="mt-3 font-mono text-[11px] text-emerald-400/90">
                ✓ shipped · secure · scalable
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {products.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
                  className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-3"
                >
                  <p className="font-display text-sm font-semibold text-white">{p.name}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
                    {p.role}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-brand-500/15 bg-brand-500/5 px-2 py-1 text-[10px] font-medium text-brand-200/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="absolute -right-2 top-16 hidden rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 shadow-xl backdrop-blur-md sm:block"
        >
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Uptime</p>
          <p className="font-display text-lg font-bold text-brand-300">99.9%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="absolute -left-3 bottom-20 hidden rounded-xl border border-white/10 bg-slate-950/90 px-3 py-2 shadow-xl backdrop-blur-md sm:block"
        >
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Focus</p>
          <p className="font-display text-sm font-semibold text-white">Africa-first</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
