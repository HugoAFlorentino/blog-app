import React, { useEffect, useState } from 'react';

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
    <div className='flex justify-between items-center px-4 py-3 bg-background text-foreground shadow-md'>
      <h1 className='text-xl font-bold'>Blog App</h1>
      <button
        onClick={toggleTheme}
        className='px-3 py-1 rounded bg-primary text-foreground hover:opacity-90 transition'
      >
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
};

export default Navbar;
