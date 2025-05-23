import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components';
import { Blogs, Landing, SignIn, SignUp } from './pages';

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
    ],
  },
  { path: '/signin', element: <SignIn /> },
  { path: '/SignUp', element: <SignUp /> },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
