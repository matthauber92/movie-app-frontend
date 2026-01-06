export interface TmdbDiscoverResponse {
    page: number;
    results: TmdbMovie[];
    totalPages?: number;
    totalResults?: number;
}

export interface SearchResultDto {
    id: number;
    type: 'movie' | 'tv' | 'person';
    title: string;
    subtitle?: string;
    imagePath?: string | null;
    popularity?: number;
    releaseDate?: string | null;
}

export interface TmdbCastMember {
    id: number;
    name: string;
    character?: string;
    profilePath?: string | null;
    profileImageUrl?: string | null;
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
    credits?: {
        cast: TmdbCastMember[];
    };
}

