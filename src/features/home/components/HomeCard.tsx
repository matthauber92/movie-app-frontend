import {
    Paper,
    Typography,
    Box,
    CardActionArea,
    CircularProgress,
    Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { TmdbMovie } from '../../../store/interfaces/Movie';

type ContentCardProps = {
    item?: TmdbMovie;
    type: 'movies' | 'series';
    variant?: 'grid' | 'carousel';
};

const getVoteColor = (vote?: number) => {
    if (!vote) return '#6b7280';
    if (vote >= 7.5) return '#22c55e';
    if (vote >= 6.0) return '#f59e0b';
    return '#ef4444';
};

const HomeCard = ({
                      item,
                      type,
                      variant = 'grid'
                  }: ContentCardProps) => {
    const navigate = useNavigate();
    const [imgLoaded, setImgLoaded] = useState(false);

    if (!item) return null;

    const isCarousel = variant === 'carousel';
    const voteAvg = item.voteAverage ?? null;
    const votePct = voteAvg !== null ? Math.round(voteAvg * 10) : null;

    return (
        <Fade in timeout={400}>
            <Box
                sx={{
                    width: isCarousel ? 220 : '100%',
                    minWidth: isCarousel ? 220 : undefined,
                    scrollSnapAlign: isCarousel ? 'start' : undefined
                }}
            >
                <CardActionArea
                    onClick={() => navigate(`/${type}/${item.id}`)}
                    sx={{
                        borderRadius: 2,
                        transform: 'scale(1)',
                        transition: 'transform 420ms cubic-bezier(.22,1,.36,1)',
                        '&:hover': {
                            transform: 'scale(1.04)',
                            zIndex: 2
                        }
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#000',
                            boxShadow: '0 18px 60px rgba(0,0,0,0.55)',
                            transition: 'box-shadow 420ms ease',
                            '&:hover': {
                                boxShadow: '0 30px 80px rgba(0,0,0,0.75)'
                            }
                        }}
                    >
                        {/* POSTER */}
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                            <Box
                                component="img"
                                src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                alt={item.title}
                                loading="lazy"
                                onLoad={() => setImgLoaded(true)}
                                sx={{
                                    width: '100%',
                                    height: isCarousel ? 320 : 240,
                                    objectFit: 'cover',
                                    display: 'block',
                                    opacity: imgLoaded ? 1 : 0,
                                    transform: imgLoaded
                                        ? 'scale(1)'
                                        : 'scale(1.06)',
                                    transition:
                                        'opacity 400ms ease, transform 900ms cubic-bezier(.22,1,.36,1)',
                                    '.MuiCardActionArea-root:hover &': {
                                        transform: 'scale(1.06)'
                                    }
                                }}
                            />

                            {/* CINEMATIC GRADIENT */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)',
                                    pointerEvents: 'none'
                                }}
                            />

                            {/* VOTE BADGE */}
                            {votePct !== null && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 10,
                                        bottom: 10,
                                        width: 44,
                                        height: 44,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(12,12,12,0.92)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow:
                                            '0 12px 28px rgba(0,0,0,0.7)',
                                        opacity: 0,
                                        transform: 'scale(0.9)',
                                        transition:
                                            'opacity 300ms ease, transform 300ms ease',
                                        '.MuiCardActionArea-root:hover &': {
                                            opacity: 1,
                                            transform: 'scale(1)'
                                        }
                                    }}
                                >
                                    <CircularProgress
                                        variant="determinate"
                                        value={votePct}
                                        size={36}
                                        thickness={4}
                                        sx={{
                                            color: getVoteColor(
                                                voteAvg ?? undefined
                                            ),
                                            position: 'absolute'
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            color: 'white',
                                            fontSize: 11,
                                            fontWeight: 800
                                        }}
                                    >
                                        {votePct}%
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* TITLE */}
                        <Box sx={{ p: 1.5 }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                noWrap
                                sx={{ color: 'white' }}
                            >
                                {item.title}
                            </Typography>

                            {item.releaseDate && (
                                <Typography
                                    variant="caption"
                                    color="rgba(255,255,255,0.7)"
                                >
                                    {item.releaseDate.slice(0, 4)}
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </CardActionArea>
            </Box>
        </Fade>
    );
};

export default HomeCard;
