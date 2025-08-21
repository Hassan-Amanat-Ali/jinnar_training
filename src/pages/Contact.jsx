import React from 'react';
import { Button, Input, Card } from '../components/ui';

export default function Contact() {
  return (
    <div className='min-h-screen bg-gray-50 py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Contact Us
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Get in touch with our team. We'd love to hear from you and discuss
            how we can help bring your vision to life.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <Card>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Send us a Message
            </h2>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input label='First Name' placeholder='John' required />
                <Input label='Last Name' placeholder='Doe' required />
              </div>

              <Input
                label='Email'
                type='email'
                placeholder='john@example.com'
                required
              />

              <Input
                label='Subject'
                placeholder='How can we help you?'
                required
              />

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Message <span className='text-red-500'>*</span>
                </label>
                <textarea
                  rows={5}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Tell us about your project or inquiry...'
                  required
                ></textarea>
              </div>

              <Button size='lg' className='w-full'>
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className='space-y-8'>
            <Card>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                Get in Touch
              </h2>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <svg
                    className='w-6 h-6 text-blue-600 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Address</h3>
                    <p className='text-gray-600'>
                      123 Business Street
                      <br />
                      Suite 100
                      <br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <svg
                    className='w-6 h-6 text-blue-600 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Phone</h3>
                    <p className='text-gray-600'>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <svg
                    className='w-6 h-6 text-blue-600 mt-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Email</h3>
                    <p className='text-gray-600'>hello@jinnar.com</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>
                Business Hours
              </h3>
              <div className='space-y-2 text-gray-600'>
                <div className='flex justify-between'>
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
