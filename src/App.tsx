import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { IndustriesPage } from '@/pages/IndustriesPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { ContactPage } from '@/pages/ContactPage'
import { CareersPage } from '@/pages/CareersPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { SuccessStoriesPage } from '@/pages/SuccessStoriesPage'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { FaqPage, PrivacyPage, TermsPage } from '@/pages/LegalPages'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminLoginPage, AdminLayout } from '@/pages/admin/AdminShell'
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage'
import { AdminLiveChatPage } from '@/pages/admin/AdminLiveChatPage'
import { AdminModulePage } from '@/pages/admin/AdminModulePage'

function Module({ name }: { name: string }) {
  return <AdminModulePage module={name} />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="live-chat" element={<AdminLiveChatPage />} />
          <Route path="activity" element={<Module name="activity" />} />
          <Route path="products" element={<Module name="products" />} />
          <Route path="services" element={<Module name="services" />} />
          <Route path="portfolio" element={<Module name="portfolio" />} />
          <Route path="media" element={<Module name="media" />} />
          <Route path="clients" element={<Module name="clients" />} />
          <Route path="leads" element={<Module name="leads" />} />
          <Route path="users" element={<Module name="users" />} />
          <Route path="permissions" element={<Module name="permissions" />} />
          <Route path="reviews" element={<Module name="reviews" />} />
          <Route path="newsletter" element={<Module name="newsletter" />} />
          <Route path="analytics" element={<Module name="analytics" />} />
          <Route path="reports" element={<Module name="reports" />} />
          <Route path="visitors" element={<Module name="visitors" />} />
          <Route path="online" element={<Module name="online" />} />
          <Route path="settings" element={<Module name="settings" />} />
          <Route path="notifications" element={<Module name="notifications" />} />
          <Route path="messages" element={<Module name="messages" />} />
          <Route path="chat-settings" element={<Module name="chat-settings" />} />
          <Route path="social" element={<Module name="social" />} />
          <Route path="email" element={<Module name="email" />} />
          <Route path="site-controls" element={<Module name="site-controls" />} />
          <Route path="pages" element={<Module name="pages" />} />
          <Route path="faq" element={<Module name="faq" />} />
          <Route path="resources" element={<Module name="resources" />} />
          <Route path="testimonials" element={<Module name="testimonials" />} />
          <Route path="design" element={<Module name="design" />} />
          <Route path="security" element={<Module name="security" />} />
          <Route path="integrations" element={<Module name="integrations" />} />
          <Route path="logs" element={<Module name="logs" />} />
          <Route path="backup" element={<Module name="backup" />} />
          <Route path="god-mode" element={<Module name="god-mode" />} />
          <Route path="profile" element={<Module name="profile" />} />
        </Route>

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="industries" element={<IndustriesPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="success-stories" element={<SuccessStoriesPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
