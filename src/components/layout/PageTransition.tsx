import { useOutlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Route-level page transitions for the public marketing layout.
 * Uses useOutlet + keyed AnimatePresence so exit/enter always run
 * (plain <Outlet /> does not remount reliably for exit animations).
 */
export function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="w-full min-h-[40vh]"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.28, ease }
        }
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}
