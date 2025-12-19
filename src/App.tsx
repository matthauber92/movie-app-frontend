import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {DiscoverPage} from "@features";
import './App.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DiscoverPage />,
    },
    // {
    //     path: '/movies/:movieId',
    //     element: <MovieDetail />,
    // },
    // {
    //     path: '/tv/:tvId',
    //     element: <TvDetail />,
    // },
    // {
    //     path: '*',
    //     element: <Navigate to="/" replace />,
    // },
]);

function App() {
  return (
      <RouterProvider router={router} />
  )
}

export default App
