import {
    Box,
    Grid,
    Chip,
    Stack,
    Autocomplete,
    TextField, Typography, CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

import ContentCard from '../components/ContentCard';
import TopBar from '../../../common/components/Topbar';
import { useGetMoviesQuery, useSearchMoviesQuery } from '../../../store/api/moviesApiSlice';
import type { TmdbMovie } from '../../../store/interfaces/Movie';
import { useInfiniteScroll, useDebouncedValue } from '../../../../hooks';
import { GENRES } from '../../../common';

const DiscoverMoviesPage = () => {
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const {
        data: searchResults,
        isFetching: isSearching
    } = useSearchMoviesQuery(
        { query: debouncedSearch, page: 1 },
        { skip: debouncedSearch.trim().length < 2 }
    );
    /* ------------------------------ DISCOVER STATE ------------------------------ */
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<TmdbMovie[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

    const {
        data,
        isFetching,
        isLoading
    } = useGetMoviesQuery({
        page,
        genreIds: selectedGenre ? String(selectedGenre) : undefined
    });

    const hasMore = Boolean(data?.results?.length);

    /* ------------------------------ APPEND RESULTS ------------------------------ */
    useEffect(() => {
        if (!data?.results) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const next = data.results.filter(m => !existingIds.has(m.id));
            return [...prev, ...next];
        });
    }, [data]);

    /* ------------------------------ INFINITE SCROLL ------------------------------ */
    const loadMoreRef = useInfiniteScroll(
        () => setPage(p => p + 1),
        isFetching,
        hasMore
    );

    /* ------------------------------ GENRE HANDLER ------------------------------ */
    const handleGenreChange = (genreId: number | null) => {
        setSelectedGenre(genreId);
        setItems([]);
        setPage(1);
    };

    return (
        <>
            <TopBar />

            <Box sx={{ px: { xs: 2, md: 4 }, pt: 12 }}>
                <Box sx={{ mb: 3, maxWidth: 520 }}>
                    <Autocomplete
                        options={searchResults ?? []}
                        loading={isFetching}
                        filterOptions={(x) => x}
                        getOptionLabel={(option) => option.title}
                        getOptionKey={option => option.id}
                        onChange={(_, value) => {
                            if (!value) return;

                            if (value.type === 'movie') {
                                navigate(`/movies/${value.id}`);
                            }

                            if (value.type === 'tv') {
                                navigate(`/tv/${value.id}`);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Find a movie"
                                onChange={(e) => setSearchInput(e.target.value)}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <SearchIcon sx={{ mr: 1 }} />
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {isFetching || isSearching && (
                                                <CircularProgress
                                                    size={18}
                                                    sx={{ mr: 1 }}
                                                />
                                            )}
                                            {params.InputProps.endAdornment}
                                        </>
                                    )
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                {...props}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                {option.imagePath && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${option.imagePath}`}
                                        alt={option.title}
                                        width={40}
                                        height={60}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: 6
                                        }}
                                    />
                                )}

                                <Box>
                                    <Typography fontWeight={600}>
                                        {option.title}
                                    </Typography>
                                    {option.subtitle && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {option.subtitle}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                    />
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mb: 3, overflowX: 'auto', pb: 1 }}
                >
                    {GENRES.movie.map(genre => (
                        <Chip
                            key={genre.id}
                            label={genre.name}
                            clickable
                            onClick={() => handleGenreChange(genre.id)}
                            sx={{
                                borderRadius: 999,
                                px: 1.5,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                backgroundColor:
                                    selectedGenre === genre.id
                                        ? 'rgba(255,255,255,0.18)'
                                        : 'rgba(255,255,255,0.08)',
                                color: 'white'
                            }}
                        />
                    ))}
                </Stack>

                {/* 🎬 GRID */}
                <Grid container spacing={2}>
                    {items.map(movie => (
                        <ContentCard key={movie.id} item={movie} type="movies" />
                    ))}

                    {(isLoading || isFetching) &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ContentCard key={`s-${i}`} type="movies" />
                        ))}
                </Grid>

                {/* Infinite scroll sentinel */}
                <Box ref={loadMoreRef} sx={{ height: 1 }} />
            </Box>
        </>
    );
};

export default DiscoverMoviesPage;
