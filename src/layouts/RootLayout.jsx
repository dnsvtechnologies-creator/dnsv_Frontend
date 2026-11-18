import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar.jsx';
import Footer from '../components/footer/Footer.jsx';
import AnimatedLogoBackground from '../components/common/AnimatedLogoBackground.jsx';
import AuthModal from '../components/auth/AuthModal.jsx';
import { usePageSeo } from '../utils/usePageSeo.js';

export default function RootLayout() {
  const { pathname } = useLocation();

  usePageSeo(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative transition-colors duration-300 selection:bg-[#00D2FF]/30 text-[#0F172A] selection:text-[#0F172A]">
      {/* Dynamic Animated Logo Gradient Mesh in Background */}
      <AnimatedLogoBackground />

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}

