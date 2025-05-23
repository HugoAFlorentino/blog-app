import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className='min-h-screen bg-background text-text transition-colors duration-300'>
      <Navbar />
      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
