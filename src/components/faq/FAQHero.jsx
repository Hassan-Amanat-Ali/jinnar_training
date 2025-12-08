import React from "react";

const FAQHero = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-primary rounded-b-[60px] sm:rounded-b-[80px] md:rounded-b-[100px] lg:rounded-b-[250px]"></div>

      <div className="section-container relative z-10 h-full flex items-center justify-center px-4 sm:px-6">
        <div className="mx-auto text-center pt-20 sm:pt-24 lg:pt-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8">
            Everything you need to know about Training.Jinnar
          </p>

          {/* Introduction text */}
          <div className="max-w-3xl mx-auto">
            <p className="text-white/95 leading-relaxed text-sm sm:text-base mb-2">
              Get answers to common questions about our{" "}
              <span className="text-success font-semibold">
                free training platform
              </span>
            </p>
            <p className="text-white/95 leading-relaxed text-sm sm:text-base">
              for Africa's informal sector workers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQHero;
