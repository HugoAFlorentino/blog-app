import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className='min-h-screen bg-background text-text transition-colors duration-300 '>
      <Navbar />
      <main className='pt-16'>
        {' '}
        {/* Adjust if needed */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
