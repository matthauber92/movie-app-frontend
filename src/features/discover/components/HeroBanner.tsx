import { Box, Typography, Button } from '@mui/material';
import { getBackdropUrl } from '../../../common';
import type { TmdbMovie } from '../../../store/interfaces/Movie.ts';

interface HeroBannerProps {
    movie: TmdbMovie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
    const backdropUrl = getBackdropUrl(movie.backdropPath);

    return (
        <Box
            sx={{
                height: '80vh',
                backgroundImage: backdropUrl
                    ? `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url(${backdropUrl})`
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, md: 6 }
            }}
        >
            <Box maxWidth={600}>
                <Typography variant="h2" fontWeight={800}>
                    {movie.title}
                </Typography>

                <Typography sx={{ opacity: 0.85, mt: 2 }}>
                    {movie.overview}
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" size="large">
                        Watch
                    </Button>
                    <Button sx={{ ml: 2 }} variant="outlined">
                        Details
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default HeroBanner;
