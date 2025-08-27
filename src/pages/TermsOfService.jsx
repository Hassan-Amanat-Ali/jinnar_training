import React from 'react';
import { Header, Footer } from '../components/layout';
import { TermsHero, TermsContent } from '../components/terms-of-service';
import { ScrollToTop } from '../components/ui';
const TermsOfService = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Floating Header */}
      <Header floating />

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
