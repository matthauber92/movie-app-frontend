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
import { useGetMovieByIdQuery } from '../../../store/api/moviesApiSlice';
import { useEffect, useState } from 'react';

const SERVERS = [
    {
        id: 'videasy',
        label: 'Server 1',
        url: (id: number) => `https://player.videasy.net/movie/${id}`
    },
    {
        id: 'vidlink',
        label: 'Server 2',
        url: (id: number) =>
            `https://vidlink.pro/movie/${id}?player=jw&primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=falseprimaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=false`
    }
];

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: movie, isLoading, isError } =
        useGetMovieByIdQuery(Number(movieId));

    const [serverIndex, setServerIndex] = useState(0);
    const [iframeKey, setIframeKey] = useState(0);
    const [playerError, setPlayerError] = useState(false);

    // Block popup windows
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

    // Detect failed load via timeout
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlayerError(false);
        const timeout = setTimeout(() => {
            setPlayerError(true);
        }, 6000);
        return () => clearTimeout(timeout);
    }, [serverIndex, iframeKey]);

    const switchServer = (index: number) => {
        setServerIndex(index);
        setIframeKey((k) => k + 1);
        setPlayerError(false);
    };

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

    if (isError || !movie) {
        return <Typography color="error">Failed to load movie.</Typography>;
    }

    const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : null;

    const backdropUrl = movie.backdropPath
        ? `https://image.tmdb.org/t/p/w780${movie.backdropPath}`
        : null;

    const activeServer = SERVERS[serverIndex];
    const iframeSrc = activeServer.url(movie.id);

    return (
        <Box sx={{ mt: 5 }}>
            {/* HERO */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 300, md: 460 },
                    backgroundImage: backdropUrl
                        ? `linear-gradient(to bottom, rgba(0,0,0,0.35), ${theme.palette.background.default}), url(${backdropUrl})`
                        : `linear-gradient(to bottom, ${theme.palette.grey[800]}, ${theme.palette.background.default})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mb: { xs: 6, md: 8 }
                }}
            >
                <Tooltip title="Back" arrow>
                    <IconButton
                        onClick={() => navigate('/movies')}
                        sx={{
                            position: 'absolute',
                            top: 20,
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

            <Box sx={{ px: { xs: 2, md: 6 }, mt: { xs: -4, md: -6 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
                    <Box
                        sx={{
                            width: 240,
                            height: 360,
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.65)'
                        }}
                    >
                        {posterUrl && (
                            <Box
                                component="img"
                                src={posterUrl}
                                alt={movie.title}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </Box>

                    <Box sx={{ maxWidth: 720 }}>
                        <Typography variant="h3" fontWeight={800}>
                            {movie.title}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                            {movie.releaseDate && (
                                <Chip label={movie.releaseDate.slice(0, 4)} size="small" />
                            )}
                            {movie.runtime && (
                                <Chip label={`${movie.runtime} min`} size="small" />
                            )}
                            {movie.voteAverage && (
                                <Chip
                                    label={`★ ${movie.voteAverage.toFixed(1)}`}
                                    size="small"
                                    color="secondary"
                                />
                            )}
                        </Stack>

                        {movie.genres && (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {movie.genres.map((g) => (
                                    <Chip key={g.id} label={g.name} size="small" />
                                ))}
                            </Stack>
                        )}

                        {movie.overview && (
                            <Typography sx={{ mt: 3, color: 'text.secondary' }}>
                                {movie.overview}
                            </Typography>
                        )}
                    </Box>
                </Stack>

                <Divider sx={{ my: 6 }} />

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
                    {/* Server selector overlay */}
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

export default MovieDetailPage;
