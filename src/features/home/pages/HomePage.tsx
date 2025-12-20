import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import MediaCarousel from '@common/components/MediaCarousel';
import HomeCard from '../components/HomeCard';

import { useGetMoviesQuery } from '../../../store/api/moviesApiSlice';
import { useGetTvQuery } from '../../../store/api/tvApiSlice';

import type { TmdbMovie } from '../../../store/interfaces/Movie';
import type { TmdbTvResult } from '../../../store/interfaces/Tv.ts';

const HomePage = () => {
    const navigate = useNavigate();

    const [moviePage, setMoviePage] = useState(1);
    const [movieItems, setMovieItems] = useState<TmdbMovie[]>([]);

    const {
        data: movieData,
        isFetching: isMoviesFetching
    } = useGetMoviesQuery({
        page: moviePage,
        genreIds: '-1'
    });

    useEffect(() => {
        if (!movieData?.results) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMovieItems(prev => {
            const ids = new Set(prev.map(m => m.id));
            const next = movieData.results.filter(m => !ids.has(m.id));
            return [...prev, ...next];
        });
    }, [movieData]);

    const hasMoreMovies = Boolean(movieData?.results?.length);

    /* -------------------------------------------------------------------------
       TV STATE
    ------------------------------------------------------------------------- */
    const [tvPage, setTvPage] = useState(1);
    const [tvItems, setTvItems] = useState<TmdbTvResult[]>([]);

    const {
        data: tvData,
        isFetching: isTvFetching
    } = useGetTvQuery({
        page: tvPage,
        genreIds: -1
    });

    useEffect(() => {
        if (!tvData?.results) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTvItems(prev => {
            const ids = new Set(prev.map(s => s.id));
            const next = tvData.results.filter(s => !ids.has(s.id));
            return [...prev, ...next];
        });
    }, [tvData]);

    const hasMoreTv = Boolean(tvData?.results?.length);
    return (
        <>
            <Box sx={{ px: { xs: 2, md: 6 }, pt: 12 }}>
                {/* 🎬 POPULAR MOVIES */}
                <MediaCarousel
                    title="Popular Movies"
                    onViewAll={() => navigate('/movies')}
                    isFetching={isMoviesFetching}
                    hasMore={hasMoreMovies}
                    onLoadMore={() => setMoviePage(p => p + 1)}
                >
                    {movieItems.map(movie => (
                        <HomeCard
                            key={movie.id}
                            item={movie}
                            type="movies"
                            variant="carousel"
                        />
                    ))}
                </MediaCarousel>

                {/* 📺 POPULAR SERIES */}
                <MediaCarousel
                    title="Popular Series"
                    onViewAll={() => navigate('/series')}
                    isFetching={isTvFetching}
                    hasMore={hasMoreTv}
                    onLoadMore={() => setTvPage(p => p + 1)}
                >
                    {tvItems.map(show => (
                        <HomeCard
                            key={show.id}
                            type="series"
                            variant="carousel"
                            item={{
                                id: show.id,
                                title:
                                    show.name ??
                                    show.originalName ??
                                    'Unknown',
                                posterPath: show.posterPath,
                                releaseDate:
                                    show.firstAirDate as string | undefined,
                                voteAverage: show.voteAverage
                            }}
                        />
                    ))}
                </MediaCarousel>
            </Box>
        </>
    );
};

export default HomePage;
