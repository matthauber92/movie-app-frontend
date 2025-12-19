import {
    Box,
    Grid,
    Chip,
    Stack,
    Autocomplete,
    TextField, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

import ContentCard from '../components/ContentCard';
import TopBar from '../../../common/components/Topbar';
import { useGetTvQuery, useSearchTvQuery } from '../../../store/api/tvApiSlice';
import type { TmdbTvResult } from '../../../store/interfaces/Tv';
import type { SearchResultDto } from '../../../store/interfaces/Movie';
import { useInfiniteScroll, useDebouncedValue } from '../../../../hooks';
import { TV_GENRES } from '../../../common';

const DiscoverSeriesPage = () => {
    const navigate = useNavigate();

    /* ------------------------------ AUTOCOMPLETE SEARCH ------------------------------ */
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebouncedValue(searchInput, 350);

    const {
        data: searchResults,
        isFetching: isSearching
    } = useSearchTvQuery(
        { query: debouncedSearch, page: 1 },
        { skip: debouncedSearch.trim().length < 2 }
    );

    /* ------------------------------ DISCOVER STATE ------------------------------ */
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

    /* ------------------------------ APPEND RESULTS ------------------------------ */
    useEffect(() => {
        if (!data?.results) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const next = data.results.filter(s => !existingIds.has(s.id));
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
                {/* 🔍 SEARCH */}
                <Box sx={{ mb: 3, maxWidth: 520 }}>
                    <Autocomplete<SearchResultDto, false, false, false>
                        options={searchResults ?? []}
                        loading={isSearching}
                        filterOptions={(x) => x}
                        getOptionLabel={(option) => option.title}
                        getOptionKey={(option) => `${option.type}-${option.id}`}
                        onChange={(_, value) => {
                            if (!value) return;
                            navigate(`/series/${value.id}`);
                            setSearchInput('');
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Find a series"
                                onChange={(e) => setSearchInput(e.target.value)}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <SearchIcon sx={{ mr: 1 }} />
                                            {params.InputProps.startAdornment}
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
                    {TV_GENRES.map(genre => (
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

                {/* 📺 GRID */}
                <Grid container spacing={2}>
                    {items.map(show => (
                        <ContentCard
                            key={show.id}
                            type="series"
                            item={{
                                id: show.id,
                                title: show.name ?? show.originalName ?? 'Unknown',
                                posterPath: show.posterPath,
                                releaseDate: show.firstAirDate as string | undefined,
                                voteAverage: show.voteAverage
                            }}
                        />
                    ))}

                    {(isLoading || isFetching) &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <ContentCard key={`s-${i}`} type="series" />
                        ))}
                </Grid>

                <Box ref={loadMoreRef} sx={{ height: 1 }} />
            </Box>
        </>
    );
};

export default DiscoverSeriesPage;
