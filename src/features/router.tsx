import { createBrowserRouter } from 'react-router-dom';
import { DiscoverMoviesPage, MovieDetailPage, DiscoverSeriesPage, SeriesDetailPage } from './discover';
import TopBar from '../common/components/Topbar.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <TopBar />,
        children: [
            {
                index: true,
                path: 'movies',
                element: <DiscoverMoviesPage />
            },
            {
                path: 'series',
                element: <DiscoverSeriesPage />
            },
            {
                path: 'movies/:movieId',
                element: <MovieDetailPage />
            },
            {
                path: 'series/:seriesId',
                element: <SeriesDetailPage />
            }
        ]
    }
    // {
    //   path: '*',
    //   element: <Navigate to="/" replace />,
    // },
]);
