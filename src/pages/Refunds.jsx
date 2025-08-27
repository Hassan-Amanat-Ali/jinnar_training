import React from 'react';
import { Header, Footer } from '../components/layout';
import { RefundsHero, RefundsContent } from '../components/refunds';
import { ScrollToTop } from '../components/ui';
const Refunds = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Floating Header */}
      <Header floating />

      {/* Main Content */}
      <main>
        <RefundsHero />
        <RefundsContent />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
};

export default Refunds;
