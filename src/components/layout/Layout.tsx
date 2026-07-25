import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatWidget } from '@/components/engagement/ChatWidget'
import { AnnouncementBar } from '@/components/engagement/AnnouncementBar'
import { VisitTracker } from '@/components/VisitTracker'
import { HashScroll } from '@/components/HashScroll'
import { ConsentBanner } from '@/components/ConsentBanner'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="noise-overlay" aria-hidden />
      <VisitTracker />
      <HashScroll />
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pt-16 lg:pt-[4.25rem]">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <ConsentBanner />
    </div>
  )
}
