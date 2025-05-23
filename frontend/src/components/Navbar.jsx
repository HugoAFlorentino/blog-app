import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className='bg-background text-text shadow-md'>
      <nav className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='text-xl font-bold text-primary'>
          BlogApp
        </Link>

        {/* Desktop Search */}
        <div className='hidden md:block'>
          <input
            type='text'
            placeholder='Search posts...'
            className='px-3 py-1 rounded bg-neutral text-text outline-none focus:ring-2 ring-primary'
          />
        </div>

        {/* Desktop Nav */}
        <div className='hidden md:flex items-center gap-4'>
          <Link to='/' className='hover:text-primary transition'>
            Home
          </Link>
          <Link to='/blogs' className='hover:text-primary transition'>
            Blogs
          </Link>
          <Link to='/create' className='hover:text-primary transition'>
            Create
          </Link>
          <Link to='/signin' className='hover:text-primary transition'>
            Sign In
          </Link>
          <button
            onClick={toggleTheme}
            className='px-2 py-1 rounded bg-primary text-white hover:opacity-90 transition'
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-text focus:outline-none'
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='md:hidden px-4 pb-4 space-y-3'>
          <Link to='/' onClick={closeMenu} className='block hover:text-primary'>
            Home
          </Link>
          <Link
            to='/blogs'
            onClick={closeMenu}
            className='block hover:text-primary'
          >
            Blogs
          </Link>
          <Link
            to='/create'
            onClick={closeMenu}
            className='block hover:text-primary'
          >
            Create
          </Link>
          <Link
            to='/signin'
            onClick={closeMenu}
            className='block hover:text-primary'
          >
            Sign In
          </Link>
          <button
            onClick={() => {
              toggleTheme();
              closeMenu();
            }}
            className='w-full text-left px-2 py-1 rounded bg-primary text-white hover:opacity-90 transition'
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
