export interface TmdbDiscoverResponse<T> {
    page: number;
    results: T[];
    totalPages?: number;
    totalResults?: number;
}

export interface SearchResultDto {
    id: number;
    type: 'movie' | 'person';
    title: string;
    subtitle?: string;
    imagePath?: string | null;
    popularity: number;
}

export interface TmdbMovie {
    id: number;
    title: string;
    overview?: string;
    posterPath?: string | null;
    backdropPath?: string | null;
    releaseDate?: string;
    runtime?: number;
    voteAverage?: number;
    genres?: { id: number; name: string }[];
}