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

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: movie, isLoading, isError } =
        useGetMovieByIdQuery(Number(movieId));

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
        return (
            <Typography color="error">
                Failed to load movie.
            </Typography>
        );
    }

    const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
        : null;

    const backdropUrl = movie.backdropPath
        ? `https://image.tmdb.org/t/p/w780${movie.backdropPath}`
        : null;

    const videoUrl = `https://vidlink.pro/movie/${movie.id}?player=jw&primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=falseprimaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=false&nextbutton=false`;

    return (
        <Box sx={{ mt: 5 }}>
            {/* 🎬 HERO BACKDROP (image or placeholder) */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 300, md: 460 },
                    backgroundImage: backdropUrl
                        ? `linear-gradient(
                            to bottom,
                            rgba(0,0,0,0.35),
                            ${theme.palette.background.default}
                        ), url(${backdropUrl})`
                        : `linear-gradient(
                            to bottom,
                            ${theme.palette.grey[800]},
                            ${theme.palette.background.default}
                        )`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    mb: { xs: 6, md: 8 }
                }}
            >
                {/* 🔙 BACK BUTTON */}
                <Tooltip title="Back" arrow>
                    <IconButton
                        onClick={() => {
                            navigate('/movies');
                        }}
                        sx={{
                            position: 'absolute',
                            top: { xs: 16, md: 24 },
                            left: { xs: 16, md: 32 },
                            zIndex: 2,
                            color: 'white',
                            backgroundColor: 'rgba(20,20,30,0.55)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                            transition:
                                'all 200ms cubic-bezier(.4,0,.2,1)',
                            '&:hover': {
                                backgroundColor:
                                    'rgba(20,20,30,0.75)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        <ArrowBackRoundedIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{ px: { xs: 2, md: 6 }, mt: { xs: -4, md: -6 } }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={5}
                >
                    {/* POSTER OR PLACEHOLDER */}
                    <Box
                        sx={{
                            width: 240,
                            height: 360,
                            borderRadius: 3,
                            overflow: 'hidden',
                            alignSelf: 'flex-start',
                            mt: { xs: -4, md: -6 },
                            backgroundColor: posterUrl
                                ? 'transparent'
                                : 'background.paper',
                            border: posterUrl
                                ? 'none'
                                : '1px solid',
                            borderColor: 'divider',
                            boxShadow:
                                '0 30px 80px rgba(0,0,0,0.65)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {posterUrl && (
                            <Box
                                component="img"
                                src={posterUrl}
                                alt={movie.title}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                    </Box>

                    {/* TEXT BLOCK */}
                    <Box sx={{ maxWidth: 720 }}>
                        <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{ mb: 1, mt: 0.5 }}
                        >
                            {movie.title}
                        </Typography>

                        {/* META */}
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            {movie.releaseDate && (
                                <Chip
                                    label={movie.releaseDate.slice(0, 4)}
                                    size="small"
                                />
                            )}
                            {movie.runtime && (
                                <Chip
                                    label={`${movie.runtime} min`}
                                    size="small"
                                />
                            )}
                            {movie.voteAverage && (
                                <Chip
                                    label={`★ ${movie.voteAverage.toFixed(1)}`}
                                    size="small"
                                    color="secondary"
                                />
                            )}
                        </Stack>

                        {/* GENRES */}
                        {movie.genres && (
                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                sx={{ mb: 3 }}
                            >
                                {movie.genres.map((g) => (
                                    <Chip
                                        key={g.id}
                                        label={g.name}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Stack>
                        )}

                        {/* OVERVIEW */}
                        {movie.overview && (
                            <Typography
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    fontSize: '1rem'
                                }}
                            >
                                {movie.overview}
                            </Typography>
                        )}
                    </Box>
                </Stack>

                <Divider sx={{ my: 6 }} />

                {/* PLAYER */}
                {/*<video*/}
                {/*    controls*/}
                {/*    autoPlay*/}
                {/*    style={{ width: '100%', background: 'black' }}*/}
                {/*    src="https://vidlink.pro/api/b/movie/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmC8s6xo-dtZm1T4JtIFA58eKAMh5dVYZ2cQjzkuy?multiLang=0"*/}
                {/*/>*/}
                <Box
                    sx={{
                        position: 'relative',
                        paddingTop: '56.25%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
                    }}
                >
                    <Box
                        component="iframe"
                        src={videoUrl}
                        // sandbox={'allow-scripts'}
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

export default MovieDetailPage;
