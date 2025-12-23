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
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useGetTvByIdQuery } from '../../../store/api/tvApiSlice';

const SERVERS = [
    {
        id: 'videasy',
        label: 'Server 1',
        url: (id: number, s: number, e: number) =>
            `https://player.videasy.net/tv/${id}/${s}/${e}`
    },
    {
        id: 'vidlink',
        label: 'Server 2',
        url: (id: number, s: number, e: number) =>
            `https://vidlink.pro/tv/${id}/${s}/${e}?player=jw&primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&title=true&poster=true&autoplay=false&nextbutton=true`
    }
];

const SeriesDetailPage = () => {
    const { seriesId } = useParams<{ seriesId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: series, isLoading, isError } =
        useGetTvByIdQuery(Number(seriesId));

    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);

    const [serverIndex, setServerIndex] = useState(0);
    const [iframeKey, setIframeKey] = useState(0);
    const [playerError, setPlayerError] = useState(false);

    // Block popup windows
    useEffect(() => {
        const originalOpen = window.open;
        window.open = function() {
            return null;
        };
        return () => {
            window.open = originalOpen;
        };
    }, []);

    // Block forced navigation
    useEffect(() => {
        const originalHref = window.location.href;
        const interval = setInterval(() => {
            if (window.location.href !== originalHref) {
                window.location.replace(originalHref);
            }
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const switchServer = (index: number) => {
        setServerIndex(index);
        setIframeKey((k) => k + 1);
        setPlayerError(false);
    };

    const seasons = useMemo(() => {
        const list = series?.seasons ?? [];
        return list.filter(s => s.seasonNumber !== 0);
    }, [series]);

    const selectedSeason = useMemo(() => {
        return seasons.find(s => s.seasonNumber === season) ?? seasons[0];
    }, [seasons, season]);

    const episodeCount = selectedSeason?.episodeCount ?? 0;

    // Default to last aired episode
    useEffect(() => {
        if (!series) return;

        if (series.lastEpisodeToAir) {
            const s = series.lastEpisodeToAir.seasonNumber;
            const e = series.lastEpisodeToAir.episodeNumber;
            const exists = seasons.some(x => x.seasonNumber === s);
            if (exists) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSeason(s);
                setEpisode(e);
                return;
            }
        }

        if (seasons[0]) {
            setSeason(seasons[0].seasonNumber);
            setEpisode(1);
        }
    }, [series, seasons]);

    // Clamp episode when switching seasons
    useEffect(() => {
        if (episodeCount <= 0) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (episode > episodeCount) setEpisode(episodeCount);
        if (episode < 1) setEpisode(1);
    }, [episodeCount, episode]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
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

    const activeServer = SERVERS[serverIndex];
    const iframeSrc = activeServer.url(Number(seriesId), season, episode);

    return (
        <Box sx={{ mt: 5 }}>
            {/* HERO */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 320, md: 480 },
                    backgroundImage: backdropUrl
                        ? `linear-gradient(to bottom, rgba(0,0,0,0.45), ${theme.palette.background.default}), url(${backdropUrl})`
                        : `linear-gradient(to bottom, rgba(30,30,35,0.95), ${theme.palette.background.default})`,
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
                            backgroundColor: 'rgba(20,20,30,0.55)',
                            backdropFilter: 'blur(10px)',
                            '&:hover': { backgroundColor: 'rgba(20,20,30,0.75)' }
                        }}
                    >
                        <ArrowBackRoundedIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
                    <Box
                        sx={{
                            width: 240,
                            height: 360,
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 30px 70px rgba(0,0,0,0.6)'
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
                                <Chip
                                    label={`★ ${series.voteAverage.toFixed(1)}`}
                                    size="small"
                                    color="secondary"
                                />
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

                {/* SEASON SELECT */}
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
                                color={active ? 'primary' : 'default'}
                            />
                        );
                    })}
                </Stack>

                {/* EPISODE SELECT */}
                {episodeCount > 0 ? (
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 4 }}>
                        {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => {
                            const active = ep === episode;
                            return (
                                <Box
                                    key={ep}
                                    onClick={() => setEpisode(ep)}
                                    sx={{
                                        minWidth: 220,
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
                                    <Typography fontWeight={700}>
                                        Episode {ep}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        Click to play
                                    </Typography>
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
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
                    }}
                >
                    {/* SERVER SELECTOR — IDENTICAL TO MOVIE DETAIL PAGE */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 2,
                            display: 'flex',
                            gap: 1,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: 'rgba(15,15,20,0.55)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.12)'
                        }}
                    >
                        {SERVERS.map((s, index) => (
                            <Chip
                                key={s.id}
                                label={s.label}
                                size="small"
                                clickable
                                color={index === serverIndex ? 'primary' : 'default'}
                                onClick={() => switchServer(index)}
                            />
                        ))}
                    </Box>

                    <Box
                        key={iframeKey}
                        component="iframe"
                        src={iframeSrc}
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

                {playerError && (
                    <Typography sx={{ mt: 2 }} color="warning.main">
                        This server may be unavailable. Try switching servers.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default SeriesDetailPage;
