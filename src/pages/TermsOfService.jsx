import React from 'react';
import { Header, Footer } from '../components/layout';
import { TermsHero, TermsContent } from '../components/terms-of-service';
import { ScrollToTop } from '../components/ui';

const TermsOfService = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Floating Header */}
      <div className='absolute top-0 left-0 right-0 z-50'>
        <Header />
      </div>

      {/* Main Content */}
      <main>
        <TermsHero />
        <TermsContent />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
};

export default TermsOfService;
