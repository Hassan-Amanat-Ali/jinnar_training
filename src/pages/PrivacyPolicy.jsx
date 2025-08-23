import React from 'react';
import { Header, Footer } from '../components/layout';
import { PrivacyHero, PrivacyContent } from '../components/privacy-policy';
import { ScrollToTop } from '../components/ui';

export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Floating Header */}
      <div className='absolute top-0 left-0 right-0 z-50'>
        <Header />
      </div>

      {/* Main Content */}
      <main className='flex-grow'>
        {/* Hero section starts from the very top, header floats over it */}
        <PrivacyHero />
        <PrivacyContent />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}
