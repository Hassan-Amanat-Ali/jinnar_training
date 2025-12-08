import React from 'react';

const TermsContent = () => {
  // Helper function to render content items with proper bullet styling
  const renderContentItem = (item, index) => {
    if (typeof item === 'string') {
      // Legacy support for string-based content
      return (
        <p
          key={index}
          className={`text-black/80 leading-relaxed ${
            item.startsWith('•')
              ? 'ml-0'
              : item.startsWith('  -')
              ? 'ml-6'
              : 'ml-0'
          }`}
        >
          {item}
        </p>
      );
    }

    // New object-based content structure
    return (
      <div key={index} className='space-y-1'>
        {item.type === 'paragraph' ? (
          <p className='text-black/80 leading-relaxed'>{item.text}</p>
        ) : (
          <p className='text-black/80 leading-relaxed flex items-start'>
            <span className='mr-2 mt-1 text-black/60 font-medium'>•</span>
            <span className='flex-1'>{item.text}</span>
          </p>
        )}
        {item.subItems && (
          <div
            className={
              item.type === 'paragraph' ? 'ml-4 space-y-1' : 'ml-6 space-y-1'
            }
          >
            {item.subItems.map((subItem, subIndex) => (
              <p
                key={subIndex}
                className='text-black/80 leading-relaxed flex items-start'
              >
                <span className='mr-2 mt-1 text-black/60 font-medium'>-</span>
                <span className='flex-1'>{subItem.text}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sections = [
    {
      id: 1,
      title: 'Acceptance of Terms',
      content: [
        {
          type: 'bullet',
          text: 'By creating an account, purchasing a course, or using our services, you confirm that:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'You are at least 13 years of age (or the legal age of digital consent in your country).',
            },
            {
              type: 'sub-bullet',
              text: 'You have the legal capacity to enter into this agreement.',
            },
            {
              type: 'sub-bullet',
              text: 'You agree to comply with these Terms, our Privacy Policy, and any additional guidelines.',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'User Accounts',
      content: [
        {
          type: 'bullet',
          text: 'To access certain features, you must register for an account.',
        },
        {
          type: 'bullet',
          text: 'You agree to:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'Provide accurate, complete, and updated information.',
            },
            {
              type: 'sub-bullet',
              text: 'Keep your login credentials confidential.',
            },
            {
              type: 'sub-bullet',
              text: 'Accept full responsibility for all activity under your account.',
            },
          ],
        },
        {
          type: 'bullet',
          text: 'We reserve the right to suspend or terminate accounts for any violations of these Terms.',
        },
      ],
    },
    {
      id: 3,
      title: 'Courses & Content',
      content: [
        {
          type: 'bullet',
          text: 'The Platform offers a wide collection of courses in various categories.',
        },
        {
          type: 'bullet',
          text: 'All courses are owned by [Your Platform Name] or our licensed instructors.',
        },
        {
          type: 'bullet',
          text: 'You are granted a limited, non-exclusive, non-transferable license to access purchased courses for personal, non-commercial use only.',
        },
        {
          type: 'bullet',
          text: 'You may not:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'Share, resell, or redistribute course content.',
            },
            {
              type: 'sub-bullet',
              text: 'Record, copy, or distribute course materials without written consent.',
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Payments & Pricing',
      content: [
        {
          type: 'bullet',
          text: 'All prices are listed on the Platform and may vary based on promotions, location, or currency.',
        },
        {
          type: 'bullet',
          text: 'Payments are processed securely through third-party payment providers.',
        },
        {
          type: 'bullet',
          text: 'By making a purchase, you agree to pay all applicable fees and taxes.',
        },
        {
          type: 'bullet',
          text: 'We reserve the right to change course prices at any time.',
        },
      ],
    },
    {
      id: 5,
      title: 'Refund Policy',
      content: [
        {
          type: 'bullet',
          text: 'Refund requests must be made within 30 days (e.g., 7 to 14 days) of purchase.',
        },
        {
          type: 'bullet',
          text: 'Refunds are granted only if:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'You have not completed more than 20% of the course content.',
            },
            {
              type: 'sub-bullet',
              text: 'The request meets our Refund Policy Guidelines.',
            },
          ],
        },
        {
          type: 'bullet',
          text: 'Once a refund is processed, your access to the course will be revoked.',
        },
      ],
    },
    {
      id: 6,
      title: 'Prohibited Activities',
      content: [
        {
          type: 'paragraph',
          text: 'When using the Platform, you agree NOT to:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'Use the Platform for unlawful purposes.',
            },
            {
              type: 'sub-bullet',
              text: 'Create, hack, or attempt to gain unauthorized access.',
            },
            {
              type: 'sub-bullet',
              text: 'Share account credentials with others.',
            },
            {
              type: 'sub-bullet',
              text: 'Upload harmful, offensive, or copyrighted materials without permission.',
            },
            { type: 'sub-bullet', text: 'Misuse our intellectual property.' },
          ],
        },
      ],
    },
    {
      id: 7,
      title: 'Intellectual Property',
      content: [
        {
          type: 'bullet',
          text: 'All text, graphics, videos, logos, and course materials are protected by copyright and trademark laws.',
        },
        {
          type: 'bullet',
          text: 'Unauthorized use of intellectual property may result in legal action.',
        },
        {
          type: 'bullet',
          text: 'Users retain rights to any content they create (e.g., reviews, comments), but grant us a license to display and use such content.',
        },
      ],
    },
    {
      id: 8,
      title: 'Disclaimers',
      content: [
        {
          type: 'bullet',
          text: 'We provide courses "as-is" without guarantees of accuracy, completeness, or fitness for a particular purpose.',
        },
        {
          type: 'bullet',
          text: "We cannot be deemed liable for the user's satisfaction and efforts; we do not guarantee employment, certification, or results.",
        },
        {
          type: 'bullet',
          text: 'We are not liable for any losses, damages, or interruptions arising from the use of our Platform.',
        },
      ],
    },
    {
      id: 9,
      title: 'Privacy & Data Protection',
      content: [
        {
          type: 'bullet',
          text: 'Your personal information is collected and processed in accordance with our Privacy Policy.',
        },
        {
          type: 'bullet',
          text: 'We use industry-standard security practices but cannot guarantee complete data security.',
        },
        {
          type: 'bullet',
          text: 'By using the Platform, you consent to our collection and processing of your data.',
        },
      ],
    },
    {
      id: 10,
      title: 'Governing Law',
      content: [
        {
          type: 'bullet',
          text: 'These Terms are governed by and construed in accordance with the laws of [Your Country].',
        },
        {
          type: 'bullet',
          text: 'Any disputes will be resolved in the courts of [Your Jurisdiction].',
        },
      ],
    },
    {
      id: 11,
      title: 'Changes to Terms',
      content: [
        {
          type: 'bullet',
          text: 'We reserve the right to modify or update these Terms at any time.',
        },
        {
          type: 'bullet',
          text: 'Changes will be effective immediately upon posting.',
        },
        {
          type: 'bullet',
          text: 'Continued use of the Platform constitutes acceptance of the updated Terms.',
        },
      ],
    },
    {
      id: 12,
      title: 'Contact Us',
      content: [
        {
          type: 'paragraph',
          text: 'For questions about these Terms & Conditions, please contact us at:',
        },
        { type: 'paragraph', text: 'Email: support@training.jinnar.com' },
        { type: 'paragraph', text: 'Website: https://training.jinnar.com' },
      ],
    },
  ];

  return (
    <section className='py-16 lg:py-20 bg-white'>
      <div className='section-container'>
        <div className='max-w-4xl mx-auto'>
          {/* Sections */}
          <div className='space-y-12'>
            {sections.map((section) => (
              <div
                key={section.id}
                className='border-b border-gray-100 pb-8 last:border-b-0'
              >
                <h2 className='text-2xl font-bold text-black mb-6'>
                  {section.id}. {section.title}
                </h2>
                <div className='space-y-2'>
                  {section.content.map((item, index) =>
                    renderContentItem(item, index)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className='mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200'>
            <h3 className='text-xl font-bold text-black mb-4'>Need Help?</h3>
            <p className='text-black/70 mb-4'>
              If you have any questions about these Terms of Service or our
              practices, please don't hesitate to contact us:
            </p>
            <div className='space-y-2 text-black/80'>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href='mailto:support@training.jinnar.com'
                  className='text-primary hover:text-primary/80 transition-colors underline'
                >
                  support@training.jinnar.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href='https://training.jinnar.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-primary/80 transition-colors underline'
                >
                  https://training.jinnar.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsContent;
