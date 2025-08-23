import React from 'react';

const LegalContent = () => {
  const renderContentItem = (item, index) => {
    if (typeof item === 'string') {
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
      title: 'Company Information',
      content: [
        {
          type: 'bullet',
          text: 'Training Jinnar is operated by [Company Legal Name].',
        },
        {
          type: 'bullet',
          text: 'Registered address: [Complete Business Address]',
        },
        {
          type: 'bullet',
          text: 'Business registration number: [Registration Number]',
        },
        {
          type: 'bullet',
          text: 'Tax identification number: [Tax ID]',
        },
      ],
    },
    {
      id: 2,
      title: 'Governing Law',
      content: [
        {
          type: 'bullet',
          text: 'These terms and all related agreements are governed by the laws of [Your Country/State].',
        },
        {
          type: 'bullet',
          text: 'Any legal disputes will be resolved in the courts of [Your Jurisdiction].',
        },
        {
          type: 'bullet',
          text: 'Users agree to submit to the jurisdiction of these courts.',
        },
      ],
    },
    {
      id: 3,
      title: 'Limitation of Liability',
      content: [
        {
          type: 'bullet',
          text: 'Our total liability for any claims shall not exceed the amount paid by the user for our services.',
        },
        {
          type: 'bullet',
          text: 'We are not liable for indirect, incidental, or consequential damages.',
        },
        {
          type: 'bullet',
          text: 'Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.',
        },
      ],
    },
    {
      id: 4,
      title: 'Indemnification',
      content: [
        {
          type: 'bullet',
          text: 'Users agree to indemnify and hold us harmless from any claims arising from their use of our services.',
        },
        {
          type: 'bullet',
          text: 'This includes legal fees and costs associated with defending against such claims.',
        },
        {
          type: 'bullet',
          text: 'Users are responsible for their own actions and content on our platform.',
        },
      ],
    },
    {
      id: 5,
      title: 'Dispute Resolution',
      content: [
        {
          type: 'bullet',
          text: 'We encourage users to contact us first to resolve any disputes informally.',
        },
        {
          type: 'bullet',
          text: 'If informal resolution is not possible, disputes may be resolved through binding arbitration.',
        },
        {
          type: 'bullet',
          text: 'Arbitration will be conducted according to the rules of [Arbitration Organization].',
        },
        {
          type: 'bullet',
          text: 'Class action lawsuits are waived in favor of individual arbitration.',
        },
      ],
    },
    {
      id: 6,
      title: 'Compliance',
      content: [
        {
          type: 'bullet',
          text: 'We comply with applicable data protection regulations including GDPR and CCPA.',
        },
        {
          type: 'bullet',
          text: 'We maintain appropriate security measures to protect user data.',
        },
        {
          type: 'bullet',
          text: 'Users have rights regarding their personal data as outlined in our Privacy Policy.',
        },
      ],
    },
    {
      id: 7,
      title: 'Severability',
      content: [
        {
          type: 'bullet',
          text: 'If any provision of these terms is found to be unenforceable, the remaining provisions will continue in effect.',
        },
        {
          type: 'bullet',
          text: 'Unenforceable provisions will be modified to the minimum extent necessary to make them enforceable.',
        },
      ],
    },
    {
      id: 8,
      title: 'Contact Information',
      content: [
        {
          type: 'paragraph',
          text: 'For legal inquiries or notices, please contact us at:',
        },
        { type: 'paragraph', text: 'Email: legal@trainingjinnar.com' },
        { type: 'paragraph', text: 'Website: https://trainingjinnar.com' },
        { type: 'paragraph', text: 'Address: [Complete Legal Address]' },
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
            <h3 className='text-xl font-bold text-black mb-4'>Legal Contact</h3>
            <p className='text-black/70 mb-4'>
              For legal matters, compliance questions, or official notices,
              please contact our legal department:
            </p>
            <div className='space-y-2 text-black/80'>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href='mailto:legal@trainingjinnar.com'
                  className='text-primary hover:text-primary/80 transition-colors underline'
                >
                  legal@trainingjinnar.com
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

export default LegalContent;
