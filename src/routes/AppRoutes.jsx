import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout.jsx';
import HomePage from '../pages/Home/HomePage.jsx';

const AboutPage = lazy(() => import('../pages/About/AboutPage.jsx'));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage.jsx'));
const ServiceDetailPage = lazy(() => import('../pages/Services/ServiceDetailPage.jsx'));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage.jsx'));
const ProductDetailPage = lazy(() => import('../pages/Products/ProductDetailPage.jsx'));
const PricingPage = lazy(() => import('../pages/Pricing/PricingPage.jsx'));
const PortfolioPage = lazy(() => import('../pages/Portfolio/PortfolioPage.jsx'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage.jsx'));
const RequestQuotePage = lazy(() => import('../pages/Contact/RequestQuotePage.jsx'));
const FAQPage = lazy(() => import('../pages/FAQ/FAQPage.jsx'));
const BlogPage = lazy(() => import('../pages/Blog/BlogPage.jsx'));
const BlogPostDetailPage = lazy(() => import('../pages/Blog/BlogPostDetailPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('../pages/Legal/PrivacyPolicyPage.jsx'));
const TermsPage = lazy(() => import('../pages/Legal/TermsPage.jsx'));
const AdminPage = lazy(() => import('../pages/Admin/AdminPage.jsx'));
const UserPortalPage = lazy(() => import('../pages/UserPortal/UserPortalPage.jsx'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F8FAFD] px-6 py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#0284C7]/25 border-t-[#0284C7] animate-spin" />
        <p className="text-xs font-medium tracking-wide text-slate-500">Loading view...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Dedicated Admin Panel Route */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          
          {/* Services */}
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />
          
          {/* Products */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          
          {/* Pricing, Portfolio, Inquiries */}
          <Route path="pricing" element={<PricingPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="request-quote" element={<RequestQuotePage />} />
          <Route path="portal" element={<UserPortalPage />} />
          <Route path="faq" element={<FAQPage />} />
          
          {/* Blog */}
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostDetailPage />} />

          {/* Legal */}
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
