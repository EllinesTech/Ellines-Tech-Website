import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { SiteFeaturesProvider } from '@/context/SiteFeaturesContext'
import { SiteProfileProvider } from '@/context/SiteProfileContext'
import { FeatureGate } from '@/components/FeatureGate'
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
import { ResourceDetailPage } from '@/pages/ResourceDetailPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { SuccessStoriesPage } from '@/pages/SuccessStoriesPage'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { CookiePolicyPage, FaqPage, PrivacyPage, TermsPage } from '@/pages/LegalPages'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CmsPageView } from '@/pages/CmsPageView'
import { ShopPage as PricingPage } from '@/pages/ShopPage'
import { AccountPage } from '@/pages/AccountPage'
import { PasswordResetPage } from '@/pages/PasswordResetPage'
import { RequestServicePage } from '@/pages/RequestServicePage'
import { InvoicePublicPage } from '@/pages/InvoicePublicPage'
import { PayResultPage } from '@/pages/PayResultPage'
import { AdminLoginPage, AdminLayout } from '@/pages/admin/AdminShell'
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage'
import { AdminLiveChatPage } from '@/pages/admin/AdminLiveChatPage'
import { AdminModulePage } from '@/pages/admin/AdminModulePage'
import { AdminInvoicesModule } from '@/pages/admin/AdminInvoicesModule'
import { AdminCareersModule } from '@/pages/admin/AdminCareersModule'
import {
  StaffLoginPage,
  StaffLayout,
  StaffOverviewPage,
  StaffLeadsPage,
  StaffClientsPage,
  StaffPricingPage,
  StaffMaterialsPage,
  StaffProfilePage,
  StaffNotificationsPage,
  StaffLiveChatPage,
} from '@/pages/staff/StaffShell'

function Module({ name }: { name: string }) {
  return <AdminModulePage module={name} />
}

function Gated({
  feature,
  title,
  description,
  children,
}: {
  feature:
    | 'careersEnabled'
    | 'requestEnabled'
    | 'pricingEnabled'
    | 'resourcesEnabled'
    | 'contactEnabled'
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <FeatureGate feature={feature} title={title} description={description}>
      {children}
    </FeatureGate>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteFeaturesProvider>
        <SiteProfileProvider>
        <Routes>
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="live-chat" element={<AdminLiveChatPage />} />
            <Route path="activity" element={<Module name="activity" />} />
            <Route path="products" element={<Module name="products" />} />
            <Route path="shop" element={<Module name="shop" />} />
            <Route path="services" element={<Module name="services" />} />
            <Route path="portfolio" element={<Module name="portfolio" />} />
            <Route path="media" element={<Module name="media" />} />
            <Route path="clients" element={<Module name="clients" />} />
            <Route path="leads" element={<Module name="leads" />} />
            <Route path="invoices" element={<Module name="invoices" />} />
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
            <Route path="downloads" element={<Module name="downloads" />} />
            <Route path="careers" element={<Module name="careers" />} />
            <Route path="testimonials" element={<Module name="testimonials" />} />
            <Route path="design" element={<Module name="design" />} />
            <Route path="security" element={<Module name="security" />} />
            <Route path="integrations" element={<Module name="integrations" />} />
            <Route path="payments" element={<Module name="payments" />} />
            <Route path="logs" element={<Module name="logs" />} />
            <Route path="backup" element={<Module name="backup" />} />
            <Route path="god-mode" element={<Module name="god-mode" />} />
            <Route path="profile" element={<Module name="profile" />} />
          </Route>

          <Route path="staff/login" element={<StaffLoginPage />} />
          <Route path="staff" element={<StaffLayout />}>
            <Route index element={<StaffOverviewPage />} />
            <Route path="leads" element={<StaffLeadsPage />} />
            <Route path="clients" element={<StaffClientsPage />} />
            <Route path="invoices" element={<AdminInvoicesModule />} />
            <Route path="pricing" element={<StaffPricingPage />} />
            <Route path="materials" element={<StaffMaterialsPage />} />
            <Route path="careers" element={<AdminCareersModule />} />
            <Route path="live-chat" element={<StaffLiveChatPage />} />
            <Route path="notifications" element={<StaffNotificationsPage />} />
            <Route path="profile" element={<StaffProfilePage />} />
          </Route>

          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route
              path="pricing"
              element={
                <Gated
                  feature="pricingEnabled"
                  title="Pricing unavailable"
                  description="Product pricing is temporarily unavailable. Contact us for a custom quote."
                >
                  <PricingPage />
                </Gated>
              }
            />
            <Route
              path="shop"
              element={
                <Gated
                  feature="pricingEnabled"
                  title="Pricing unavailable"
                  description="Product pricing is temporarily unavailable. Contact us for a custom quote."
                >
                  <PricingPage />
                </Gated>
              }
            />
            <Route
              path="request"
              element={
                <Gated
                  feature="requestEnabled"
                  title="Requests unavailable"
                  description="The service request flow is temporarily closed. Please try again later or reach us on WhatsApp."
                >
                  <RequestServicePage />
                </Gated>
              }
            />
            <Route path="account" element={<AccountPage />} />
            <Route path="account/reset" element={<PasswordResetPage />} />
            <Route path="p/:slug" element={<CmsPageView />} />
            <Route path="invoice/:id" element={<InvoicePublicPage />} />
            <Route path="pay/result" element={<PayResultPage />} />
            <Route path="solutions" element={<SolutionsPage />} />
            <Route path="industries" element={<IndustriesPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="success-stories" element={<SuccessStoriesPage />} />
            <Route
              path="resources"
              element={
                <Gated
                  feature="resourcesEnabled"
                  title="Resources unavailable"
                  description="The knowledge hub is temporarily unavailable."
                >
                  <ResourcesPage />
                </Gated>
              }
            />
            <Route
              path="resources/:slug"
              element={
                <Gated
                  feature="resourcesEnabled"
                  title="Resources unavailable"
                  description="The knowledge hub is temporarily unavailable."
                >
                  <ResourceDetailPage />
                </Gated>
              }
            />
            <Route path="careers" element={<CareersPage />} />
            <Route
              path="contact"
              element={
                <Gated
                  feature="contactEnabled"
                  title="Contact unavailable"
                  description="The contact form is temporarily unavailable. You can still reach us by email or WhatsApp if listed elsewhere."
                >
                  <ContactPage />
                </Gated>
              }
            />
            <Route path="faq" element={<FaqPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="cookies" element={<CookiePolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </SiteProfileProvider>
      </SiteFeaturesProvider>
    </BrowserRouter>
  )
}
