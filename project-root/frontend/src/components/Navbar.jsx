import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const lastScrollY = useRef(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.blogs); // <- correct state here

  const userMenuRef = useRef();
  const menuRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu if clicked outside
  useEffect(() => {
    const handleClickOutsideUserMenu = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideUserMenu);
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideUserMenu);
  }, []);

  // Close mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutsideMenu);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [menuOpen]);

  // Close search dropdown if clicked outside
  useEffect(() => {
    const handleClickOutsideSearch = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFilteredPosts([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
    };
  }, []);

  // Filter posts locally as user types in search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts([]);
      return;
    }

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered.slice(0, 5)); // limit to top 5 results
  }, [searchTerm, posts]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleResultClick = (id) => {
    setSearchTerm('');
    setFilteredPosts([]);
    navigate(`/blogs/${id}`);
  };

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
      className={`bg-background text-text shadow-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300 px-4 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className='max-w-7xl mx-auto px-12 py-3 flex items-center justify-between'>
        <Link to='/' className='text-xl font-bold text-primary'>
          Blogify-press
        </Link>

        <div className='relative hidden md:block' ref={searchRef}>
          <input
            type='text'
            placeholder='Search posts...'
            className='px-3 py-1 rounded bg-neutral text-text outline-none focus:ring-2 ring-primary w-64'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredPosts.length > 0 && (
            <ul className='absolute z-30 bg-neutral rounded shadow-md mt-1 w-full max-h-60 overflow-auto'>
              {filteredPosts.map((post) => (
                <li
                  key={post._id}
                  onClick={() => handleResultClick(post._id)}
                  className='cursor-pointer px-3 py-2 hover:bg-primary hover:text-white border-primary border-b-2 transition'
                >
                  {post.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='hidden md:flex items-center gap-4'>
          <Link to='/' className='hover:text-primary transition'>
            Home
          </Link>
          <Link to='/blogs' className='hover:text-primary transition'>
            Blogs
          </Link>
          <Link to='/news' className='hover:text-primary transition'>
            News
          </Link>
          {currentUser && (
            <Link to='/create' className='hover:text-primary transition'>
              Create
            </Link>
          )}

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
                  <a
                    href='/dashboard'
                    onClick={() => setUserMenuOpen(false)}
                    className='block px-4 py-2 hover:bg-primary transition'
                  >
                    Dashboard
                  </a>
                  <Link
                    to='/settings'
                    onClick={() => setUserMenuOpen(false)}
                    className='block px-4 py-2 hover:bg-primary transition'
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logoutUser());
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className='block w-full text-left px-4 py-2 hover:bg-red-500 transition'
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
        <div ref={menuRef} className='md:hidden px-4 pb-4 space-y-3'>
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
            to='/news'
            onClick={closeMenu}
            className='block hover:text-primary'
          >
            News
          </Link>
          {currentUser && (
            <Link
              to='/create'
              onClick={closeMenu}
              className='block hover:text-primary'
            >
              Create
            </Link>
          )}
          {currentUser ? (
            <div className='relative' ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className='hover:text-primary transition font-semibold'
              >
                {currentUser?.username || 'Guest'} ▼
              </button>
              {userMenuOpen && (
                <div className='absolute left-0 mt-2 w-40 bg-neutral text-text rounded shadow-md z-20'>
                  <Link
                    to='/dashboard'
                    onClick={() => setUserMenuOpen(false)}
                    className='block px-4 py-2 hover:bg-primary transition'
                  >
                    Dashboard
                  </Link>
                  <Link
                    to='/settings'
                    onClick={() => setUserMenuOpen(false)}
                    className='block px-4 py-2 hover:bg-primary transition'
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logoutUser());
                      setUserMenuOpen(false);
                    }}
                    className='block w-full text-left px-4 py-2 hover:bg-red-500 transition'
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
