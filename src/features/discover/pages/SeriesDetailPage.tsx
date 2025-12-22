import {
    Box,
    Typography,
    Chip,
    CircularProgress,
    Stack,
    Divider,
    useTheme,
    IconButton,
    Tooltip
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { useGetTvByIdQuery } from '../../../store/api/tvApiSlice';

const SeriesDetailPage = () => {
    const { seriesId } = useParams<{ seriesId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: series, isLoading, isError } =
        useGetTvByIdQuery(Number(seriesId));
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);


    useEffect(() => {
        const originalOpen = window.open;

        window.open = function(...args) {
            console.warn('Blocked popup:', args[0]);
            return null;
        };

        return () => {
            window.open = originalOpen;
        };
    }, []);

    useEffect(() => {
        const originalHref = window.location.href;

        const interval = setInterval(() => {
            if (window.location.href !== originalHref) {
                console.warn('Blocked navigation to:', window.location.href);
                window.location.replace(originalHref);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const onFocus = () => {
            // If focus changes suddenly, an ad likely opened
            if (document.visibilityState === 'hidden') {
                setTimeout(() => {
                    window.focus();
                }, 0);
            }
        };

        window.addEventListener('blur', onFocus);
        return () => window.removeEventListener('blur', onFocus);
    }, []);

    const seasons = useMemo(() => {
        const list = series?.seasons ?? [];
        // HBO-ish: hide Specials by default. If you want Specials, remove this filter.
        return list.filter(s => s.seasonNumber !== 0);
    }, [series]);

    const selectedSeason = useMemo(() => {
        return seasons.find(s => s.seasonNumber === season) ?? seasons[0];
    }, [seasons, season]);

    const episodeCount = selectedSeason?.episodeCount ?? 0;

    // Default selection: last aired episode if available (and season exists)
    useEffect(() => {
        if (!series) return;

        if (series.lastEpisodeToAir) {
            const s = series.lastEpisodeToAir.seasonNumber;
            const e = series.lastEpisodeToAir.episodeNumber;

            // only set if that season exists (after filtering specials)
            const exists = (series.seasons ?? []).some(x => x.seasonNumber === s);
            if (exists) {
                setSeason(s);
                setEpisode(e);
                return;
            }
        }

        // fallback: first non-special season, episode 1
        const first = (series.seasons ?? []).find(x => x.seasonNumber !== 0);
        if (first) {
            setSeason(first.seasonNumber);
            setEpisode(1);
        }
    }, [series]);

    // Clamp episode if you switch seasons and previous ep is out of range
    useEffect(() => {
        if (episodeCount <= 0) return;
        if (episode > episodeCount) setEpisode(episodeCount);
        if (episode < 1) setEpisode(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodeCount, season]);

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !series) {
        return <Typography color="error">Failed to load series.</Typography>;
    }

    const posterUrl = series.posterPath
        ? `https://image.tmdb.org/t/p/w500${series.posterPath}`
        : null;

    const backdropUrl = series.backdropPath
        ? `https://image.tmdb.org/t/p/original${series.backdropPath}`
        : null;

    // const seriesUrl = `https://vidlink.pro/tv/${seriesId}/${season}/${episode}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=true`;
    const seriesUrl = `https://player.videasy.net/tv/${seriesId}/${season}/${episode}`;

    return (
        <Box sx={{ mt: 5 }}>
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 320, md: 480 },
                    backgroundImage: backdropUrl
                        ? `linear-gradient(
                            to bottom,
                            rgba(0,0,0,0.45),
                            ${theme.palette.background.default}
                          ), url(${backdropUrl})`
                        : `linear-gradient(
                            to bottom,
                            rgba(30,30,35,0.95),
                            ${theme.palette.background.default}
                          )`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Tooltip title="Back">
                    <IconButton
                        onClick={() => navigate('/series')}
                        sx={{
                            position: 'absolute',
                            top: 24,
                            left: 24,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.75)' }
                        }}
                    >
                        <ArrowBackRoundedIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
                    {/* POSTER */}
                    <Box
                        sx={{
                            width: 240,
                            height: 360,
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                            backgroundColor: posterUrl ? 'transparent' : 'rgba(255,255,255,0.06)'
                        }}
                    >
                        {posterUrl && (
                            <Box
                                component="img"
                                src={posterUrl}
                                alt={series.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </Box>

                    {/* TEXT */}
                    <Box sx={{ maxWidth: 720 }}>
                        <Typography variant="h3" fontWeight={800}>
                            {series.name}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: 'wrap' }}>
                            {series.firstAirDate && (
                                <Chip label={series.firstAirDate.slice(0, 4)} size="small" />
                            )}
                            <Chip label={`${series.numberOfSeasons} Seasons`} size="small" />
                            <Chip label={`${series.numberOfEpisodes} Episodes`} size="small" />
                            {series.voteAverage > 0 && (
                                <Chip label={`★ ${series.voteAverage.toFixed(1)}`} size="small" color="secondary" />
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                            {series.genres?.map((g) => (
                                <Chip key={g.id} label={g.name} size="small" variant="outlined" />
                            ))}
                        </Stack>

                        <Typography color="text.secondary" lineHeight={1.8}>
                            {series.overview}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ my: 6 }} />

                <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                    {seasons.map((s) => {
                        const active = s.seasonNumber === season;
                        return (
                            <Chip
                                key={s.id ?? s.seasonNumber}
                                label={`Season ${s.seasonNumber}`}
                                clickable
                                onClick={() => {
                                    setSeason(s.seasonNumber);
                                    setEpisode(1);
                                }}
                                sx={{
                                    fontWeight: 650,
                                    borderRadius: 999,
                                    whiteSpace: 'nowrap',
                                    backgroundColor: active
                                        ? 'rgba(255,255,255,0.18)'
                                        : 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.22)' }
                                }}
                            />
                        );
                    })}
                </Stack>

                {/* EPISODE RAIL (uses selectedSeason.episodeCount) */}
                {episodeCount > 0 ? (
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 4 }}>
                        {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => {
                            const active = ep === episode;

                            return (
                                <Box
                                    key={ep}
                                    onClick={() => setEpisode(ep)}
                                    sx={{
                                        minWidth: 240,
                                        p: 2,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        backgroundColor: active
                                            ? 'rgba(255,255,255,0.14)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: active
                                            ? '1px solid rgba(255,255,255,0.35)'
                                            : '1px solid transparent',
                                        transition: 'all 180ms ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.14)',
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Typography fontWeight={750}>
                                        Episode {ep}
                                    </Typography>

                                    <Stack direction="row" spacing={1} alignItems="center"
                                           sx={{ mt: 1, opacity: 0.75 }}>
                                        <PlayArrowRoundedIcon fontSize="small" />
                                        <Typography variant="caption">Play episode</Typography>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        No episode count available for this season.
                    </Typography>
                )}

                {/* PLAYER */}
                <Box
                    sx={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
                    }}
                >
                    <Box
                        component="iframe"
                        src={seriesUrl}
                        allow="fullscreen; autoplay; picture-in-picture"
                        referrerPolicy="no-referrer"
                        allowFullScreen
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 0
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default SeriesDetailPage;
