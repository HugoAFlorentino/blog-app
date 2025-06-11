import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshUser } from './redux/userSlice.js';

import { Landing } from './pages/index.js';
import { Layout } from './components/index.js';
const Blogs = React.lazy(() => import('./pages/Blogs'));
const News = React.lazy(() => import('./pages/News'));
const CreatePost = React.lazy(() => import('./pages/CreatePost'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));
const About = React.lazy(() => import('./pages/About'));
const Faq = React.lazy(() => import('./pages/Faq'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/blogs/:id', element: <Blogs /> },
      { path: '/news', element: <News /> },
      { path: '/create', element: <CreatePost /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/settings', element: <Settings /> },
      { path: '/about', element: <About /> },
      { path: '/faq', element: <Faq /> },
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/terms', element: <Terms /> },
    ],
  },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:id/:token', element: <ResetPassword /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const authChecked = useSelector((state) => state.user.authChecked);

  useEffect(() => {
    dispatch(refreshUser()).catch(() => {});
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <div className='flex justify-center items-center min-h-screen'>
            <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'>
              Waking up the servers...free tier render yey
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default App;
