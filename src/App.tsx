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
import { AdminChatPage } from '@/pages/admin/AdminChatPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
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
