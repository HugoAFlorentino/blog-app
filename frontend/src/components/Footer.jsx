import { Link } from 'react-router-dom';

const Footer = () => {
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
        <form className='flex flex-col sm:flex-row items-center gap-2'>
          <label htmlFor='email' className='sr-only'>
            Email address
          </label>
          <input
            type='email'
            id='email'
            placeholder='Your email'
            className='px-3 py-2 rounded-md border border-secondary bg-neutral text-text placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary'
            required
          />
          <button
            type='submit'
            className='bg-primary  text-text px-4 py-2 rounded-md font-semibold shadow-sm hover:scale-95 duration-300 transition'
          >
            Subscribe
          </button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
