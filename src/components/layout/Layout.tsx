import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { ChatWidget } from '@/components/engagement/ChatWidget'
import { AnnouncementBar } from '@/components/engagement/AnnouncementBar'
import { InstallAppBanner } from '@/components/engagement/InstallApp'
import { VisitTracker } from '@/components/VisitTracker'
import { HashScroll } from '@/components/HashScroll'
import { ConsentBanner } from '@/components/ConsentBanner'
import { CmsRouteContent } from '@/components/CmsRouteContent'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="no-print sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-400 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <div className="noise-overlay no-print" aria-hidden />
      <VisitTracker />
      <HashScroll />
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="relative flex-1 pt-16 print:pt-0 lg:pt-[4.25rem]" tabIndex={-1}>
        <CmsRouteContent>
          <PageTransition />
        </CmsRouteContent>
      </main>
      <Footer />
      <InstallAppBanner />
      <ChatWidget />
      <ConsentBanner />
    </div>
  )
}
