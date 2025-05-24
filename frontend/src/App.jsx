import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components';
import { Blogs, Dashboard, Landing, SignIn, SignUp } from './pages';
import { refreshUser } from './redux/userSlice';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: '/blogs',
        element: <Blogs />,
      },
      { path: '/dashboard', element: <Dashboard /> },
    ],
  },
  { path: '/signin', element: <SignIn /> },
  { path: '/signup', element: <SignUp /> }, // fixed case here (optional)
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
