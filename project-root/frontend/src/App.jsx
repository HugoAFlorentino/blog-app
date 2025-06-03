import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, lazy } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { refreshUser } from './redux/userSlice';

// Lazy-loaded components using react-router-dom's lazy()
const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { default: Layout } = await import('./components/Layout');
      return { Component: Layout };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Landing } = await import('./pages/Landing');
          return { Component: Landing };
        },
      },
      {
        path: 'blogs',
        lazy: async () => {
          const { default: Blogs } = await import('./pages/Blogs');
          return { Component: Blogs };
        },
      },
      {
        path: 'blogs/:id',
        lazy: async () => {
          const { default: Blogs } = await import('./pages/Blogs');
          return { Component: Blogs };
        },
      },
      {
        path: 'news',
        lazy: async () => {
          const { default: News } = await import('./pages/News');
          return { Component: News };
        },
      },
      {
        path: 'create',
        lazy: async () => {
          const { default: CreatePost } = await import('./pages/CreatePost');
          return { Component: CreatePost };
        },
      },
      {
        path: 'dashboard',
        lazy: async () => {
          const { default: Dashboard } = await import('./pages/Dashboard');
          return { Component: Dashboard };
        },
      },
      {
        path: 'settings',
        lazy: async () => {
          const { default: Settings } = await import('./pages/Settings');
          return { Component: Settings };
        },
      },
      {
        path: 'about',
        lazy: async () => {
          const { default: About } = await import('./pages/About');
          return { Component: About };
        },
      },
      {
        path: 'faq',
        lazy: async () => {
          const { default: Faq } = await import('./pages/Faq');
          return { Component: Faq };
        },
      },
      {
        path: 'privacy',
        lazy: async () => {
          const { default: PrivacyPolicy } = await import(
            './pages/PrivacyPolicy'
          );
          return { Component: PrivacyPolicy };
        },
      },
      {
        path: 'terms',
        lazy: async () => {
          const { default: Terms } = await import('./pages/Terms');
          return { Component: Terms };
        },
      },
    ],
  },
  {
    path: '/signin',
    lazy: async () => {
      const { default: SignIn } = await import('./pages/SignIn');
      return { Component: SignIn };
    },
  },
  {
    path: '/signup',
    lazy: async () => {
      const { default: SignUp } = await import('./pages/SignUp');
      return { Component: SignUp };
    },
  },
  {
    path: '/forgot-password',
    lazy: async () => {
      const { default: ForgotPassword } = await import(
        './pages/ForgotPassword'
      );
      return { Component: ForgotPassword };
    },
  },
  {
    path: '/reset-password/:id/:token',
    lazy: async () => {
      const { default: ResetPassword } = await import('./pages/ResetPassword');
      return { Component: ResetPassword };
    },
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const authChecked = useSelector((state) => state.user.authChecked);

  useEffect(() => {
    dispatch(refreshUser()).catch(() => {
      // silently fail
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
      <RouterProvider router={router} />

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
