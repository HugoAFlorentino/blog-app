import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/userSlice';

const Navbar = () => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const userMenuRef = useRef();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // scrolling down -> hide navbar
        setShowNavbar(false);
      } else {
        // scrolling up -> show navbar
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header
      className={`bg-background text-text shadow-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Your existing nav code */}
        <Link to='/' className='text-xl font-bold text-primary'>
          BlogApp
        </Link>

        <div className='hidden md:block'>
          <input
            type='text'
            placeholder='Search posts...'
            className='px-3 py-1 rounded bg-neutral text-text outline-none focus:ring-2 ring-primary'
          />
        </div>

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

          {currentUser ? (
            <div className='relative' ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className='hover:text-primary transition font-semibold'
              >
                {currentUser?.username || 'Guest'} ▼
              </button>
              {userMenuOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-neutral text-text rounded shadow-md z-20'>
                  <Link
                    to='/dashboard'
                    onClick={() => setUserMenuOpen(false)}
                    className='block px-4 py-2 hover:bg-primary/10 transition'
                  >
                    Dashboard
                  </Link>
                  <Link
                    to='/settings'
                    onClick={() => setUserMenuOpen(false)}
                    className='block px-4 py-2 hover:bg-primary/10 transition'
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logoutUser());
                      setUserMenuOpen(false);
                    }}
                    className='block w-full text-left px-4 py-2 hover:bg-red-200/20 transition'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to='/signin'
              onClick={closeMenu}
              className='block hover:text-primary'
            >
              Sign In
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className='px-2 py-1 rounded bg-primary text-white hover:opacity-90 transition'
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <button
          className='md:hidden text-text focus:outline-none'
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

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
          {currentUser ? (
            <p className='hover:text-primary transition'>
              {currentUser?.username || 'Guest'}
            </p>
          ) : (
            <Link
              to='/signin'
              onClick={closeMenu}
              className='block hover:text-primary'
            >
              Sign In
            </Link>
          )}
          <button
            onClick={() => {
              toggleTheme();
              closeMenu();
            }}
            className='w-full text-left px-2 py-1 rounded bg-primary text-white hover:opacity-90 transition ease-in duration-100'
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
