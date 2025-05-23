import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components';
import { Landing } from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ path: '/landing', element: <Landing /> }],
  },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
