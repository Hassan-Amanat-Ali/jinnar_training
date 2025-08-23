import React from 'react';
import { Header, Footer } from '../components/layout';
import { LegalHero, LegalContent } from '../components/legal';
import { ScrollToTop } from '../components/ui';

const Legal = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Floating Header */}
      <div className='absolute top-0 left-0 right-0 z-50'>
        <Header />
      </div>

      {/* Main Content */}
      <main>
        <LegalHero />
        <LegalContent />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
};

export default Legal;
