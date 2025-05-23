import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className='bg-background text-text shadow-md'>
      <nav className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='text-xl font-bold text-primary'>
          BlogApp
        </Link>

        {/* Search (hidden on small screens) */}
        <div className='hidden md:block'>
          <input
            type='text'
            placeholder='Search posts...'
            className='px-3 py-1 rounded bg-neutral text-text outline-none focus:ring-2 ring-primary'
          />
        </div>

        {/* Nav Links & Theme/User Controls */}
        <div className='flex items-center gap-4'>
          <Link to='/' className='hover:text-primary transition'>
            Home
          </Link>
          <Link to='/blogs' className='hover:text-primary transition'>
            Blogs
          </Link>
          <Link to='/create' className='hover:text-primary transition'>
            Create
          </Link>

          {/* Mock Avatar */}
          <Link to='/signin' className='hover:text-primary transition'>
            Sign In
          </Link>
          {/* <div className='w-8 h-8 rounded-full bg-secondary text-text flex items-center justify-center font-semibold'>
            U
          </div> */}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className='px-2 py-1 rounded bg-primary text-white hover:opacity-90 transition'
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
