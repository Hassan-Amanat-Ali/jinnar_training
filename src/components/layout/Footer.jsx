import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../ui';
import { Logo, FooterBg } from '../../assets';
import { ROUTES } from '../../constants/routes';
import {
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';

import { FiFacebook } from 'react-icons/fi';
import { PiDiscordLogo } from 'react-icons/pi';
import { VscGithubAlt } from 'react-icons/vsc';
import { FaFigma } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email || email.trim() === '') {
      toast.warning('lease enter your email address', {
        position: 'bottom-left',
      });
      return;
    }

    if (!validateEmail(email.trim())) {
      toast.warning('Please enter a valid email address', {
        position: 'bottom-left',
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const formData = new FormData();
      formData.append('email', email.trim());
      formData.append(
        '_subject',
        'New Newsletter Subscription - Training Jinnar'
      );
      formData.append('_next', window.location.href);
      formData.append('_captcha', 'true');
      formData.append('subscription_type', 'Newsletter');

      const response = await fetch(
        'https://formsubmit.co/ajax/shoaiballahbakhsh@gmail.com',
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        toast.success(
          '🎉 Successfully subscribed! Welcome to our newsletter!',
          {
            position: 'bottom-left',
          }
        );

        // Reset email input
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('❌ Subscription failed. Please try again later.', {
        position: 'bottom-left',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const useCases = [
    'Web designers',
    'Marketers',
    'Small Business',
    'Website Builder',
  ];

  const resources = [
    'Academy',
    'Blog',
    'Themes',
    'Hosting',
    'Developers',
    'Support',
  ];

  const company = ['About Us', 'Careers', 'FAQs', 'Teams', 'Contact Us'];

  const legalLinks = [
    { name: 'Privacy Policy', href: ROUTES.PRIVACY_POLICY },
    { name: 'Terms of Service', href: ROUTES.TERMS_OF_SERVICE },
    { name: 'Refunds', href: ROUTES.REFUNDS },
    { name: 'Legal', href: ROUTES.LEGAL },
    { name: 'Site Map', href: '#' },
  ];

  const socialIcons = [
    { icon: FiFacebook, href: '#' },
    { icon: PiDiscordLogo, href: '#' },
    { icon: VscGithubAlt, href: '#' },
    { icon: FaInstagram, href: '#' },
    { icon: FaFigma, href: '#' },
  ];

  return (
    <footer className='relative bg-white'>
      {/* CTA Section */}
      <section className='section-container relative py-12 overflow-hidden bg-primary/10'>
        {/* Content */}
        <div className='relative z-10 section-container'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
            {/* Left Side - Text Content */}
            <div className='flex-1 max-w-lg'>
              <h2 className='text-2xl lg:text-3xl font-semibold text-black mb-3'>
                Ready to Get Started ?
              </h2>
              <p className='text-black/80 leading-relaxed text-base'>
                Enroll today and check out our pricing plans to find the one
                that's right for you.
              </p>
            </div>

            {/* Right Side - CTA Button */}
            <div className='flex-shrink-0'>
              <Button
                text='View Pricing'
                className='btn-base-large btn-gray text-black bg-white px-8 py-4 text-lg font-medium'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className='bg-transparent pt-16 pb-4 relative'>
        {/* Background Image */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <img
            src={FooterBg}
            alt='Footer Background'
            className='absolute bottom-0 right-0 max-w-[300px] lg:max-w-[400px] h-auto object-contain opacity-80 z-0'
          />
        </div>

        <div className='section-container relative z-10'>
          {/* Main Footer Content */}
          <div className='flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12'>
            {/* Left Side - Logo & Description */}
            <div className='flex-1 lg:max-w-md'>
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-primary'>
                  <img src={Logo} className='max-w-[200px]' alt='logo' />
                </h2>
              </div>
              <p className='text-black/70 mb-8 leading-relaxed text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis id est laborum.
              </p>

              {/* Newsletter Signup */}
              <form
                onSubmit={handleNewsletterSubmit}
                className='flex-col md:flex-row flex gap-2 mb-6'
              >
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                  className='flex-1 px-4 py-3 border border-gray-300 bg-primary/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  disabled={isSubscribing}
                />
                <Button
                  text={isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  className='btn-base-medium btn-primary px-6'
                  type='submit'
                  disabled={isSubscribing}
                />
              </form>

              {/* Social Icons */}
              <div className='flex gap-3'>
                {socialIcons.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className='w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-black/80 hover:bg-primary hover:text-white transition-colors duration-200'
                    >
                      <IconComponent className='w-4 h-4' />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Links Grid */}
            <div className='flex-1'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12'>
                {/* Use Cases */}
                <div>
                  <h3 className='font-semibold text-black mb-6 text-base'>
                    Use Cases
                  </h3>
                  <ul className='space-y-4'>
                    {useCases.map((item, index) => (
                      <li key={index}>
                        <a
                          href='#'
                          className='text-black/70 hover:text-primary transition-colors duration-200 text-sm'
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div>
                  <h3 className='font-semibold text-black mb-6 text-base'>
                    Resources
                  </h3>
                  <ul className='space-y-4'>
                    {resources.map((item, index) => (
                      <li key={index}>
                        <a
                          href='#'
                          className='text-black/70 hover:text-primary transition-colors duration-200 text-sm'
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className='font-semibold text-black mb-6 text-base'>
                    Company
                  </h3>
                  <ul className='space-y-4'>
                    {company.map((item, index) => (
                      <li key={index}>
                        <a
                          href='#'
                          className='text-black/70 hover:text-primary transition-colors duration-200 text-sm'
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className='border-t border-gray-200 pt-8 relative z-10'>
            <div className='flex flex-col justify-center items-center gap-4'>
              {/* Legal Links */}
              <div className='flex flex-wrap justify-center lg:justify-start gap-6'>
                {legalLinks.map((link, index) =>
                  link.href.startsWith('/') ? (
                    <Link
                      key={index}
                      to={link.href}
                      className='text-sm text-black/60 hover:text-primary transition-colors duration-200'
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={index}
                      href={link.href}
                      className='text-sm text-black/60 hover:text-primary transition-colors duration-200'
                    >
                      {link.name}
                    </a>
                  )
                )}
              </div>

              {/* Copyright */}
              <p className='text-sm text-black/60 text-center lg:text-right'>
                © {currentYear} All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
