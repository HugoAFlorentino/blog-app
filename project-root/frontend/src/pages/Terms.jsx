import React from 'react';

const Terms = () => {
  return (
    <div className='max-w-4xl mx-auto px-6 py-12 bg-white dark:bg-neutral rounded-lg shadow-md'>
      <h1 className='text-primary text-3xl font-heading font-bold mb-6'>
        Terms of Service
      </h1>
      <p className='mb-4 text-text'>
        Please read these terms of service ("terms", "terms of service")
        carefully before using our blog platform.
      </p>
      <section className='mb-6'>
        <h2 className='text-primary text-2xl font-semibold mb-2'>
          Use of Service
        </h2>
        <p className='text-text'>
          By using this service, you agree to comply with all rules and
          regulations.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='text-primary text-2xl font-semibold mb-2'>
          User Responsibilities
        </h2>
        <p className='text-text'>
          You are responsible for the content you post and for respecting other
          users.
        </p>
      </section>
      <section className='mb-6'>
        <h2 className='text-primary text-2xl font-semibold mb-2'>
          Limitation of Liability
        </h2>
        <p className='text-text'>
          We are not liable for damages resulting from the use of this platform.
        </p>
      </section>
      <p className='text-sm text-secondary mt-8'>Last updated: May 2025</p>
    </div>
  );
};

export default Terms;
