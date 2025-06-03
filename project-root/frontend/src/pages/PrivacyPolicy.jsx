import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-neutral rounded-lg shadow-md'>
      <h1 className='text-primary text-3xl font-heading font-bold mb-6'>
        Privacy Policy
      </h1>
      <p className='mb-4 text-text'>
        Your privacy is important to us. This privacy policy explains how we
        collect, use, and protect your information when you use our blog
        platform.
      </p>
      <section className='mb-6'>
        <h2 className='text-primary text-2xl font-semibold mb-2'>
          Information We Collect
        </h2>
        <p className='text-text'>
          We may collect personal information such as your name, email address,
          and usage data to improve your experience.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='text-primary text-2xl font-semibold mb-2'>
          How We Use Your Information
        </h2>
        <p className='text-text'>
          Your data helps us personalize content, send updates, and improve the
          site’s performance and security.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='text-primary text-2xl font-semibold mb-2'>
          Your Rights
        </h2>
        <p className='text-text'>
          You have the right to access, correct, or delete your personal
          information at any time.
        </p>
      </section>
      <p className='text-sm text-secondary mt-8'>Last updated: May 2025</p>
    </div>
  );
};

export default PrivacyPolicy;
