import {
    Paper,
    Grid,
    Tooltip,
    Typography,
    Box,
    CardActionArea,
    Skeleton,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { TmdbMovie } from '../../../store/interfaces/Movie.ts';

interface ContentCardProps {
    item?: TmdbMovie;
    loading?: boolean;
}

const getVoteColor = (vote?: number) => {
    if (!vote) return '#6b7280';       // gray
    if (vote >= 7.5) return '#22c55e'; // green
    if (vote >= 6.0) return '#f59e0b'; // amber
    return '#ef4444';                 // red
};

const ContentCard = ({ item, loading = false }: ContentCardProps) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                    }}
                >
                    <Skeleton variant="rectangular" height={220} animation="wave" />
                    <Box sx={{ p: 1 }}>
                        <Skeleton width="80%" height={22} />
                        <Skeleton width="40%" height={16} />
                    </Box>
                </Paper>
            </Grid>
        );
    }

    if (!item) return null;

    const voteAvg = item.voteAverage ?? null;
    const votePct = voteAvg !== null ? Math.round(voteAvg * 10) : null;

    return (
        <Grid size={{ xs: 6, sm: 4, md: 1 }}>
            <CardActionArea
                onClick={() => navigate(`/movies/${item.id}`)}
                sx={{
                    transform: 'translateY(0px) scale(1)',
                    transition: 'transform 180ms cubic-bezier(.4,0,.2,1), filter 180ms cubic-bezier(.4,0,.2,1)',
                    '&:hover': {
                        transform: 'translateY(-6px) scale(1.03)',
                        zIndex: 2
                    }
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        overflow: 'hidden',
                        borderRadius: 2,
                        position: 'relative',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
                    }}
                >
                    {/* Poster */}
                    {item.posterPath && (
                        <Box sx={{ position: 'relative' }}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                alt={item.title}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: 220,
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />

                            {/* Subtle top-to-bottom overlay for a more “cinematic” poster */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.0) 55%, rgba(0,0,0,0.65) 100%)',
                                    pointerEvents: 'none'
                                }}
                            />

                            {/* Vote donut */}
                            {votePct !== null && (
                                <Tooltip title={`Rating: ${voteAvg?.toFixed(1)} / 10`}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 10,
                                            bottom: 10,
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            bgcolor: 'rgba(8, 28, 34, 0.92)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.45)'
                                        }}
                                    >
                                        <CircularProgress
                                            variant="determinate"
                                            value={Math.max(0, Math.min(100, votePct))}
                                            size={38}
                                            thickness={4}
                                            sx={{
                                                color: getVoteColor(voteAvg ?? undefined),
                                                position: 'absolute'
                                            }}
                                        />
                                        <Typography
                                            sx={{
                                                color: 'white',
                                                fontSize: 11,
                                                fontWeight: 800,
                                                letterSpacing: 0.2
                                            }}
                                        >
                                            {votePct}%
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            )}
                        </Box>
                    )}

                    {/* Text */}
                    <Box sx={{ p: 1 }}>
                        <Tooltip title={item.title}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>
                                {item.title}
                            </Typography>
                        </Tooltip>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.releaseDate && (
                                <Typography variant="caption" color="text.secondary">
                                    {item.releaseDate.slice(0, 4)}
                                </Typography>
                            )}

                            {/* Optional small vote text (kept subtle) */}
                            {voteAvg !== null && (
                                <Typography variant="caption" color="text.secondary">
                                    • {voteAvg.toFixed(1)}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </CardActionArea>
        </Grid>
    );
};

export default ContentCard;
