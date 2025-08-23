import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Button } from '../ui';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData) => {
    const errors = [];

    // Check required fields
    if (!formData.get('firstName') || formData.get('firstName').trim() === '') {
      errors.push('First Name is required');
    }

    if (!formData.get('lastName') || formData.get('lastName').trim() === '') {
      errors.push('Last Name is required');
    }

    if (!formData.get('email') || formData.get('email').trim() === '') {
      errors.push('Email is required');
    } else {
      // Basic email validation
      const email = formData.get('email').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }

    if (!formData.get('message') || formData.get('message').trim() === '') {
      errors.push('Message is required');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Validate form fields
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
      const errorMessage =
        validationErrors.length === 1
          ? validationErrors[0]
          : `Please fix the following:\n• ${validationErrors.join('\n• ')}`;

      toast.warning(errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      // Add hidden fields for FormSubmit
      formData.append(
        '_subject',
        'New Contact Form Submission from Training Jinnar'
      );
      formData.append('_next', window.location.href);
      formData.append('_captcha', 'true');

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

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "🎉 Message sent successfully! We'll get back to you within 1-2 business days."
        );

        // Reset the form
        e.target.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        '❌ Unable to send message. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex-1'>
      <form className='space-y-5' onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <input
              type='text'
              name='firstName'
              placeholder='First Name'
              className='w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder-[#4b5563] bg-white'
            />
          </div>
          <div>
            <input
              type='text'
              name='lastName'
              placeholder='Last Name'
              className='w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder-gray-500 bg-white'
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            type='email'
            name='email'
            placeholder='Email'
            className='w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder-gray-500 bg-white'
          />
        </div>

        {/* Phone Number */}
        <div>
          <input
            type='tel'
            name='phone'
            placeholder='Phone Number'
            className='w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder-gray-500 bg-white'
          />
        </div>

        {/* Message */}
        <div>
          <textarea
            rows={6}
            name='message'
            placeholder='Details / Subject'
            className='w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-black placeholder-gray-500 resize-none bg-white'
          ></textarea>
        </div>

        {/* Submit Button */}
        <Button
          text={isSubmitting ? 'Sending...' : 'Send Message'}
          icon={<FiSend className='text-white w-5 h-5' />}
          className='btn-base-large btn-primary w-full py-4 text-lg font-semibold tracking-wider'
          disabled={isSubmitting}
        />
      </form>

      <p className='text-sm text-black/60 mt-6 text-center tracking-wider'>
        We'll get back to you in 1-2 business days.
      </p>
    </div>
  );
};

export default ContactForm;
