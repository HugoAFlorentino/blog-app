import React, { useState } from 'react';

const faqs = [
  {
    question: 'How often do you publish new posts?',
    answer:
      'We aim to publish new blog posts at least once a week. Stay tuned for the latest updates!',
  },
  {
    question: 'Can I contribute to the blog?',
    answer:
      'Absolutely! We welcome contributions from our community members. If you’re interested, please create an account and start submitting your posts.',
  },
  {
    question: 'Do you have a newsletter?',
    answer:
      'Yes! Subscribe to our newsletter to get the latest posts and exclusive content delivered to your inbox.',
  },
  {
    question: 'How can I contact you?',
    answer:
      'You can reach out via our social media channels or through the contact form on our website.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-16'>
      <h1 className='text-4xl font-heading font-bold mb-8 text-primary'>
        Frequently Asked Questions
      </h1>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='border border-secondary rounded-lg'>
            <button
              onClick={() => toggle(index)}
              className='w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-text hover:bg-primary hover:text-white rounded-lg transition'
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className='px-6 py-4 text-text bg-neutral dark:bg-neutral-dark rounded-b-lg'>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
