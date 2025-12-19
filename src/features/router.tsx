import { createBrowserRouter } from 'react-router-dom';
import { DiscoverPage, MovieDetailPage } from './discover';

export const router = createBrowserRouter([
    {
        index: true,
        path: '/',
        element: <DiscoverPage />
    },
    {
        path: '/movies/:movieId',
        element: <MovieDetailPage />
    }
    // {
    //     path: '/tv/:tvId',
    //     element: <TvDetail />,
    // },
    // {
    //     path: '*',
    //     element: <Navigate to="/" replace />,
    // },
]);