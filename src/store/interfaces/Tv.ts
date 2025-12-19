export interface TmdbTvSearchResponse {
    page: number;
    results: TmdbTvResult[];
    totalPages: number;
    totalResults: number;
}

export interface TmdbTvResult {
    id: number;

    name: string;
    originalName: string;

    overview: string;

    posterPath?: string | null;
    backdropPath?: string | null;

    firstAirDate?: string | null;
    lastAirDate?: string | null;

    numberOfSeasons: number;
    numberOfEpisodes: number;

    episodeRunTime: number[];

    popularity: number;
    voteAverage: number;
    voteCount: number;

    inProduction: boolean;

    genres: {
        id: number;
        name: string;
    }[];

    createdBy: {
        id: number;
        name: string;
        profilePath?: string | null;
    }[];

    networks: {
        id: number;
        name: string;
        logoPath?: string | null;
        originCountry: string;
    }[];

    originCountry: string[];

    homepage?: string | null;

    lastEpisodeToAir?: {
        name: string;
        airDate: string;
        seasonNumber: number;
        episodeNumber: number;
        overview: string;
        runtime?: number | null;
        stillPath?: string | null;
    } | null;

    nextEpisodeToAir?: {
        airDate: string;
        seasonNumber: number;
        episodeNumber: number;
    } | null;

    seasons: TmdbSeason[];
}

export interface TmdbSeason {
    id: number;
    name: string;
    overview?: string | null;

    seasonNumber: number;
    episodeCount: number;

    airDate?: string | null;
    posterPath?: string | null;

    voteAverage?: number;
}

