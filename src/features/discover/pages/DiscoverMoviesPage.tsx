import {
    Box,
    Grid,
    Chip,
    Stack
} from '@mui/material';
import { useEffect, useState } from 'react';

import ContentCard from '../components/ContentCard';
import {
    useGetMoviesQuery
} from '../../../store/api/moviesApiSlice';

import type { TmdbMovie } from '../../../store/interfaces/Movie';
import { useInfiniteScroll } from '../../../../hooks';
import { GENRES } from '../../../common';

const DiscoverMoviesPage = () => {
    const isTvMode = window.matchMedia('(hover: none)').matches;
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

    useEffect(() => {
        if (!data?.results) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const next = data.results.filter(m => !existingIds.has(m.id));
            return [...prev, ...next];
        });
    }, [data]);

    const loadMoreRef = useInfiniteScroll(
        () => setPage(p => p + 1),
        isFetching || isTvMode,
        hasMore
    );

    /* -------------------------------------------------------------------------
       GENRE HANDLER
    ------------------------------------------------------------------------- */
    const handleGenreChange = (genreId: number | null) => {
        setSelectedGenre(genreId);
        setItems([]);
        setPage(1);
    };

    /* -------------------------------------------------------------------------
       TV PAGINATION (FOCUS-DRIVEN, SAFE)
    ------------------------------------------------------------------------- */
    const handleGridKeyDown = (e: React.KeyboardEvent) => {
        if (!isTvMode) return;

        if (
            e.key === 'ArrowDown' &&
            hasMore &&
            !isFetching
        ) {
            setPage(p => p + 1);
        }
    };

    /* -------------------------------------------------------------------------
       RENDER
    ------------------------------------------------------------------------- */
    return (
        <Box sx={{ px: { xs: 2, md: 4 }, pt: 12 }}>
            {/* GENRES (CLICK + FOCUS SAFE) */}
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    mb: 4,
                    overflowX: 'auto',
                    pb: 1
                }}
            >
                {GENRES.movie.map(genre => (
                    <Chip
                        key={genre.id}
                        tabIndex={0}
                        label={genre.name}
                        onClick={() => handleGenreChange(genre.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleGenreChange(genre.id);
                            }
                        }}
                        sx={{
                            borderRadius: 999,
                            px: 2,
                            fontWeight: 700,
                            outline: 'none',
                            whiteSpace: 'nowrap',
                            backgroundColor:
                                selectedGenre === genre.id
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(255,255,255,0.08)',
                            color: 'white',
                            '&:focus-visible': {
                                outline:
                                    '2px solid rgba(0,200,255,0.9)',
                                outlineOffset: 4
                            }
                        }}
                    />
                ))}
            </Stack>

            {/* GRID */}
            <Box
                tabIndex={isTvMode ? 0 : -1}
                onKeyDown={handleGridKeyDown}
            >
                <Grid
                    container
                    spacing={isTvMode ? 4 : 2}
                >
                    {items.map(movie => (
                        <ContentCard
                            key={movie.id}
                            item={movie}
                            type="movies"
                        />
                    ))}

                    {(isLoading || isFetching) &&
                        Array.from({
                            length: isTvMode ? 6 : 8
                        }).map((_, i) => (
                            <ContentCard
                                key={`s-${i}`}
                                type="movies"
                            />
                        ))}
                </Grid>
            </Box>

            {/* DESKTOP INFINITE SCROLL SENTINEL */}
            {!isTvMode && (
                <Box ref={loadMoreRef} sx={{ height: 1 }} />
            )}
        </Box>
    );
};

export default DiscoverMoviesPage;
