import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-[4.25rem]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
