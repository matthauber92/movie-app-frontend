import { Box, Grid, Typography } from '@mui/material';
import ContentCard from '../components/ContentCard';
import { useState } from 'react';
import { useDebouncedValue } from '../../../../hooks';
import { useGetMoviesQuery, useSearchMoviesQuery } from '../../../store/api/moviesApiSlice.ts';
import TopBar from '../components/Topbar.tsx';
import type { TmdbMovie } from '../../../store/interfaces/Movie.ts';

const DiscoverPage = () => {
    const [search] = useState('');
    const debouncedSearch = useDebouncedValue(search);

    const isSearching = debouncedSearch.trim().length > 0;

    const {
        data: discoverData,
        isLoading: discoverLoading
    } = useGetMoviesQuery({ page: 1 }, { skip: isSearching });

    const {
        data: searchData,
        isLoading: searchLoading
    } = useSearchMoviesQuery(
        { query: debouncedSearch, page: 1 },
        { skip: !isSearching }
    );

    const movies = isSearching ? searchData : discoverData?.results;
    const loading = isSearching ? searchLoading : discoverLoading;

    return (
        <>
            <TopBar />

            <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                    {isSearching ? 'Search Results' : 'Discover Movies'}
                </Typography>

                <Grid container spacing={2}>
                    {loading &&
                        Array.from({ length: 12 }).map((_, i) => (
                            <ContentCard key={i} loading />
                        ))}

                    {!loading &&
                        movies?.map((movie: TmdbMovie) => (
                            <ContentCard
                                key={movie.id}
                                item={movie}
                            />
                        ))}
                </Grid>
            </Box>
        </>
    );
};

export default DiscoverPage;
