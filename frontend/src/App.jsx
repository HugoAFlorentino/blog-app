import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components';
import {
  Blogs,
  CreatePost,
  Dashboard,
  Landing,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  About,
  Faq,
  PrivacyPolicy,
  Terms,
  Settings,
} from './pages';
import { refreshUser } from './redux/userSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/blogs/:id', element: <Blogs /> },
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
    // You can render a loading spinner here or nothing until we know auth status
    return <div>Loading...</div>;
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
