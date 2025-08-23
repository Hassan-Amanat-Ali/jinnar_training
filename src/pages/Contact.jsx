import React from 'react';
import { ContactForm, ContactInfo } from '../components/contact';

export default function Contact() {
  return (
    <div className='bg-white'>
      <section className='py-16 lg:py-20'>
        <div className='section-container'>
          <div className='text-center mb-16'>
            <h1 className='text-4xl md:text-5xl font-bold text-black mb-6'>
              Contact us
            </h1>
            <p className='text-lg text-black/70 max-w-2xl mx-auto tracking-wider'>
              Have questions or want to discuss a project? Reach out, and let's
              craft the perfect solution with our tools and services.
            </p>
          </div>

          {/* Section Heading */}
          <div className='mb-12'>
            <h2 className='text-xl font-semibold text-black text-left tracking-wider'>
              Fill in the form below
            </h2>
          </div>

          {/* Main Content */}
          <div className='flex flex-col lg:flex-row gap-12 lg:gap-20'>
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </div>
  );
}
