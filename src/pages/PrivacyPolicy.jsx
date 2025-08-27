import React from 'react';
import { Header, Footer } from '../components/layout';
import { PrivacyHero, PrivacyContent } from '../components/privacy-policy';
import { ScrollToTop } from '../components/ui';
export default function PrivacyPolicy() {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
      {/* Floating Header */}
      <Header floating />
      {/* Main Content */}
      <main className='flex-grow relative'>
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
