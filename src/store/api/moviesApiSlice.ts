import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TmdbDiscoverResponse, SearchResultDto, TmdbMovie } from '../interfaces/Movie';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/movies`;

export const moviesApiSlice = createApi({
    reducerPath: 'moviesApi',
    baseQuery: fetchBaseQuery({
        baseUrl
    }),
    tagTypes: ['Movies', 'Movie'],
    endpoints: (builder) => ({
        /* 🎬 Discover Movies */
        getMovies: builder.query<
            TmdbDiscoverResponse,
            { page?: number; genreIds?: string }
        >({
            query: ({ page = 1, genreIds }) => ({
                url: '',
                params: {
                    page,
                    genreIds
                }
            }),
            providesTags: ['Movies']
        }),

        /* 🔍 Search Movies */
        searchMovies: builder.query<
            SearchResultDto[],
            { query: string; page?: number }
        >({
            query: ({ query, page = 1 }) => ({
                url: 'search',
                params: {
                    query,
                    page
                }
            })
        }),

        /* 🎥 Movie Details */
        getMovieById: builder.query<TmdbMovie, number>({
            query: (movieId) => `${movieId}`,
            providesTags: (_result, _error, id) => [
                { type: 'Movie', id }
            ]
        })
    })
});

export const {
    useGetMoviesQuery,
    useSearchMoviesQuery,
    useGetMovieByIdQuery
} = moviesApiSlice;
