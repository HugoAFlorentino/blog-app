import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendThankYouEmail } from '../redux/subscriptionSlice';
import { Link } from 'react-router-dom';

const Footer = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.subscription);

  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(sendThankYouEmail(email));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      setEmail('');
      // reset status after 3 seconds (optional)
      const timer = setTimeout(() => {
        // you can dispatch an action here if you add one to reset status in the slice
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <footer className='bg-background border-t border-secondary mt-12 py-8'>
      <div className='max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center text-secondary text-sm gap-6'>
        {/* Left: site info */}
        <div>
          <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        </div>

        {/* Middle: quick links */}
        <nav className='flex space-x-6'>
          <Link to='/about' className='hover:text-primary transition'>
            About
          </Link>
          <Link to='/faq' className='hover:text-primary transition'>
            FAQ
          </Link>
          <Link to='/privacy' className='hover:text-primary transition'>
            Privacy Policy
          </Link>
          <Link to='/terms' className='hover:text-primary transition'>
            Terms
          </Link>
        </nav>

        {/* Right: newsletter signup */}
        <form
          className='flex flex-col sm:flex-row items-center gap-2'
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor='email' className='sr-only'>
            Email address
          </label>
          <input
            type='email'
            id='email'
            placeholder='Your email'
            className='px-3 py-2 rounded-md border border-secondary bg-neutral text-text placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
          />
          <button
            type='submit'
            className='bg-primary text-text px-4 py-2 rounded-md font-semibold shadow-sm hover:scale-95 duration-300 transition'
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Subscribe'}
          </button>
        </form>

        {/* Messages */}
        <div className='mt-2 text-center w-full sm:w-auto'>
          {status === 'succeeded' && (
            <p className='text-green-500'>Thank you for subscribing!</p>
          )}
          {status === 'failed' && <p className='text-red-500'>{error}</p>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
