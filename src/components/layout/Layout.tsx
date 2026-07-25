import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatWidget } from '@/components/engagement/ChatWidget'
import { AnnouncementBar } from '@/components/engagement/AnnouncementBar'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pt-14 lg:pt-16">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
