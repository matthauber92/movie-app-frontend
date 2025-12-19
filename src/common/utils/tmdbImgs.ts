const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getPosterUrl = (path?: string | null): string | null => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/w500${path}`;
};

export const getBackdropUrl = (path?: string | null): string | null => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/w780${path}`;
};
