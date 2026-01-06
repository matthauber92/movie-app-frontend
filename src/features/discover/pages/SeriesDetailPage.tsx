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
            if (seasons.some(x => x.seasonNumber === s)) {
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

    // Clamp episode
    useEffect(() => {
        if (!episodeCount) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (episode > episodeCount) setEpisode(episodeCount);
        if (episode < 1) setEpisode(1);
    }, [episode, episodeCount]);

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

    const iframeSrc = SERVERS[serverIndex].url(Number(seriesId), season, episode);

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
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <ArrowBackRoundedIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ px: { xs: 2, md: 6 }, mt: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
                    {/* POSTER */}
                    <Box sx={{
                        width: 240,
                        height: 360,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 30px 70px rgba(0,0,0,0.6)'
                    }}>
                        {posterUrl && (
                            <Box
                                component="img"
                                src={posterUrl}
                                alt={series.name}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </Box>

                    {/* DETAILS */}
                    <Box sx={{ maxWidth: 720 }}>
                        <Typography variant="h3" fontWeight={800}>
                            {series.name}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: 'wrap' }}>
                            {series.firstAirDate && <Chip label={series.firstAirDate.slice(0, 4)} size="small" />}
                            <Chip label={`${series.numberOfSeasons} Seasons`} size="small" />
                            <Chip label={`${series.numberOfEpisodes} Episodes`} size="small" />
                            {series.voteAverage > 0 && (
                                <Chip label={`★ ${series.voteAverage.toFixed(1)}`} size="small" color="secondary" />
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                            {series.genres.map(g => (
                                <Chip key={g.id} label={g.name} size="small" variant="outlined" />
                            ))}
                        </Stack>

                        <Typography color="text.secondary" lineHeight={1.8}>
                            {series.overview}
                        </Typography>

                        {/* CAST */}
                        {series.credits?.cast?.length ? (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                                    Cast
                                </Typography>

                                <Box
                                    sx={{
                                        width: '150%',
                                        display: 'flex',
                                        gap: 2,
                                        overflowX: 'auto',
                                        pb: 1,
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        '&::-webkit-scrollbar': { display: 'none' }
                                    }}
                                >
                                    {series.credits.cast.slice(0, 20).map(actor => (
                                        <Box key={actor.id} sx={{ minWidth: 110, textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 110,
                                                    height: 165,
                                                    borderRadius: 1.5,
                                                    overflow: 'hidden',
                                                    backgroundColor: 'grey.900',
                                                    boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
                                                    transition: 'transform 160ms ease',
                                                    '&:hover': { transform: 'translateY(-3px)' }
                                                }}
                                            >
                                                {actor.profileImageUrl ? (
                                                    <Box
                                                        component="img"
                                                        src={actor.profileImageUrl}
                                                        alt={actor.name}
                                                        loading="lazy"
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 11,
                                                        color: 'text.secondary'
                                                    }}>
                                                        No Image
                                                    </Box>
                                                )}
                                            </Box>

                                            <Typography variant="body2" fontWeight={600} sx={{ mt: 0.75 }} noWrap>
                                                {actor.name}
                                            </Typography>

                                            {actor.character && (
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {actor.character}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ) : null}
                    </Box>
                </Stack>

                <Divider sx={{ my: 6 }} />

                {/* SEASON SELECT */}
                <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                    {seasons.map(s => (
                        <Chip
                            key={s.seasonNumber}
                            label={`Season ${s.seasonNumber}`}
                            clickable
                            color={s.seasonNumber === season ? 'primary' : 'default'}
                            onClick={() => {
                                setSeason(s.seasonNumber);
                                setEpisode(1);
                            }}
                        />
                    ))}
                </Stack>

                {/* EPISODES */}
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, mb: 4 }}>
                    {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
                        <Box
                            key={ep}
                            onClick={() => setEpisode(ep)}
                            sx={{
                                minWidth: 220,
                                p: 2,
                                borderRadius: 2,
                                cursor: 'pointer',
                                backgroundColor: ep === episode
                                    ? 'rgba(255,255,255,0.14)'
                                    : 'rgba(255,255,255,0.05)',
                                transition: 'all 180ms ease',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.14)', transform: 'translateY(-4px)' }
                            }}
                        >
                            <Typography fontWeight={700}>Episode {ep}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Click to play
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* PLAYER */}
                <Box sx={{
                    position: 'relative',
                    paddingTop: '56.25%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
                }}>
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
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        {SERVERS.map((s, i) => (
                            <Chip
                                key={s.id}
                                label={s.label}
                                size="small"
                                clickable
                                color={i === serverIndex ? 'primary' : 'default'}
                                onClick={() => switchServer(i)}
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
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
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
