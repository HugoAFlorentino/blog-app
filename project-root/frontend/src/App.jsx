import React, { useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages
const Layout = lazy(() => import('./components/Layout'));
const Blogs = lazy(() => import('./pages/Blogs'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Landing = lazy(() => import('./pages/Landing'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const About = lazy(() => import('./pages/About'));
const Faq = lazy(() => import('./pages/Faq'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const Settings = lazy(() => import('./pages/Settings'));
const News = lazy(() => import('./pages/News'));

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
    dispatch(refreshUser()).catch(() => {
      // swallow error quietly
    });
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
            <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
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
