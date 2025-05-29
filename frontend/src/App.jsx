import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components';
import {
  Blogs,
  Dashboard,
  Landing,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
} from './pages';
import { refreshUser, logoutUser } from './redux/userSlice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: '/blogs', element: <Blogs /> },
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password/:id/:token', element: <ResetPassword /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const loggedInFlag = localStorage.getItem('loggedIn');
    if (!currentUser && loggedInFlag) {
      dispatch(refreshUser())
        .unwrap()
        .catch(() => {
          localStorage.removeItem('loggedIn');
          dispatch(logoutUser());
        });
    }
  }, [currentUser, dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
