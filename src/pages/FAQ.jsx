import React from "react";
import { Header, Footer } from "../components/layout";
import { FAQHero, FAQContent } from "../components/faq";
import { ScrollToTop } from "../components/ui";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Floating Header */}
      <Header floating />

      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Hero section starts from the very top, header floats over it */}
        <FAQHero />
        <FAQContent />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}
