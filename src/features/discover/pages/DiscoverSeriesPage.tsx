import {
    Box,
    Grid,
    Chip,
    Stack
} from '@mui/material';
import { useEffect, useState } from 'react';

import ContentCard from '../components/ContentCard';
import TopBar from '../../../common/components/Topbar';
import {
    useGetTvQuery
} from '../../../store/api/tvApiSlice';

import type { TmdbTvResult } from '../../../store/interfaces/Tv';
import { useInfiniteScroll } from '../../../../hooks';
import { TV_GENRES } from '../../../common';

const DiscoverSeriesPage = () => {
    const isTvMode = window.matchMedia('(hover: none)').matches;

    const [page, setPage] = useState(1);
    const [items, setItems] = useState<TmdbTvResult[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(-1);

    const {
        data,
        isFetching,
        isLoading
    } = useGetTvQuery({
        page,
        genreIds: selectedGenre ?? -1
    });

    const hasMore = Boolean(data?.results?.length);
    useEffect(() => {
        if (!data?.results) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(prev => {
            const ids = new Set(prev.map(s => s.id));
            const next = data.results.filter(s => !ids.has(s.id));
            return [...prev, ...next];
        });
    }, [data]);

    const loadMoreRef = useInfiniteScroll(
        () => setPage(p => p + 1),
        isFetching || isTvMode,
        hasMore
    );
    const handleGenreChange = (genreId: number | null) => {
        setSelectedGenre(genreId);
        setItems([]);
        setPage(1);
    };

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

    return (
        <>
            <TopBar />

            <Box sx={{ px: { xs: 2, md: 4 }, pt: 12 }}>
                {/* GENRES (CLICK + FOCUS SAFE) */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mb: 4, overflowX: 'auto', pb: 1 }}
                >
                    {TV_GENRES.map(genre => (
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
                    <Grid container spacing={isTvMode ? 4 : 2}>
                        {items.map(show => (
                            <ContentCard
                                key={show.id}
                                type="series"
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

                        {(isLoading || isFetching) &&
                            Array.from({
                                length: isTvMode ? 6 : 8
                            }).map((_, i) => (
                                <ContentCard
                                    key={`s-${i}`}
                                    type="series"
                                />
                            ))}
                    </Grid>
                </Box>

                {/* DESKTOP INFINITE SCROLL SENTINEL */}
                {!isTvMode && (
                    <Box ref={loadMoreRef} sx={{ height: 1 }} />
                )}
            </Box>
        </>
    );
};

export default DiscoverSeriesPage;
