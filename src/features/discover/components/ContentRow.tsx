import { Box, Typography, Grid } from '@mui/material';
import ContentCard from './ContentCard';
import type { TmdbMovie } from '../../../store/interfaces/Movie.ts';

interface ContentRowProps {
    title: string;
    items: TmdbMovie[];
    loading?: boolean;
}

const ContentRow = ({ title, items, loading }: ContentRowProps) => {
    return (
        <Box sx={{ px: 3, mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>

            <Grid container spacing={2}>
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ContentCard key={i} loading />
                    ))
                    : items.map((item) => (
                        <ContentCard key={item.id} item={item} />
                    ))}
            </Grid>
        </Box>
    );
};

export default ContentRow;
