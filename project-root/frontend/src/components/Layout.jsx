import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-background text-text transition-colors duration-300'>
      <Navbar />
      <main className='flex-grow pt-16'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
