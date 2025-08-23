import React from 'react';

const RefundsContent = () => {
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
      title: 'Refund Eligibility',
      content: [
        {
          type: 'bullet',
          text: 'Refund requests must be made within 30 days of purchase.',
        },
        {
          type: 'bullet',
          text: 'You are eligible for a refund if:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'You have not completed more than 20% of the course content.',
            },
            {
              type: 'sub-bullet',
              text: 'The course does not meet the description provided.',
            },
            {
              type: 'sub-bullet',
              text: 'Technical issues prevent you from accessing the course.',
            },
          ],
        },
        {
          type: 'bullet',
          text: 'Refunds are not available for courses completed beyond 20% of the content.',
        },
      ],
    },
    {
      id: 2,
      title: 'Refund Process',
      content: [
        {
          type: 'bullet',
          text: 'To request a refund, contact our support team with your order details.',
        },
        {
          type: 'bullet',
          text: 'All refund requests will be reviewed within 5-7 business days.',
        },
        {
          type: 'bullet',
          text: 'Once approved, refunds will be processed to your original payment method within 7-14 business days.',
        },
        {
          type: 'bullet',
          text: 'You will receive an email confirmation once the refund is processed.',
        },
      ],
    },
    {
      id: 3,
      title: 'Non-Refundable Items',
      content: [
        {
          type: 'paragraph',
          text: 'The following items are not eligible for refunds:',
          subItems: [
            {
              type: 'sub-bullet',
              text: 'Digital downloads that have been accessed.',
            },
            {
              type: 'sub-bullet',
              text: 'Courses purchased with promotional discounts over 50%.',
            },
            {
              type: 'sub-bullet',
              text: 'Subscription services after the trial period.',
            },
            {
              type: 'sub-bullet',
              text: 'Third-party services or products.',
            },
          ],
        },
      ],
    },
    {
      id: 4,
      title: 'Partial Refunds',
      content: [
        {
          type: 'bullet',
          text: 'In some cases, partial refunds may be offered based on course completion percentage.',
        },
        {
          type: 'bullet',
          text: 'Partial refunds are calculated based on unused content and time remaining.',
        },
        {
          type: 'bullet',
          text: 'All partial refund decisions are at our discretion and final.',
        },
      ],
    },
    {
      id: 5,
      title: 'Refund Exceptions',
      content: [
        {
          type: 'bullet',
          text: 'Emergency circumstances may be considered for refunds outside normal policy.',
        },
        {
          type: 'bullet',
          text: 'Medical or family emergencies with proper documentation may qualify for special consideration.',
        },
        {
          type: 'bullet',
          text: 'All exception requests must be submitted with supporting documentation.',
        },
      ],
    },
    {
      id: 6,
      title: 'Contact for Refunds',
      content: [
        {
          type: 'paragraph',
          text: 'To request a refund or ask questions about our refund policy, please contact us at:',
        },
        { type: 'paragraph', text: 'Email: support@trainingjinnar.com' },
        { type: 'paragraph', text: 'Website: https://trainingjinnar.com' },
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
              If you have any questions about our refund policy or need to
              request a refund, please don't hesitate to contact us:
            </p>
            <div className='space-y-2 text-black/80'>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href='mailto:support@trainingjinnar.com'
                  className='text-primary hover:text-primary/80 transition-colors underline'
                >
                  support@trainingjinnar.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href='https://trainingjinnar.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:text-primary/80 transition-colors underline'
                >
                  https://trainingjinnar.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefundsContent;
