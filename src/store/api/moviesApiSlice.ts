import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TmdbDiscoverResponse, SearchResultDto, TmdbMovie } from '../interfaces/Movie';
import { mapResponse } from '../../common/utils/transformResponse.ts';

const baseUrl = '/api/movies';

export const moviesApiSlice = createApi({
    reducerPath: 'moviesApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ['Movies', 'Movie'],
    endpoints: (builder) => ({
        getMovies: builder.query<
            TmdbDiscoverResponse,
            { page?: number; genreIds?: string }
        >({
            query: ({ page = 1, genreIds }) => ({
                url: '',
                params: { page, genreIds }
            }),
            transformResponse: (response: unknown) =>
                mapResponse<TmdbDiscoverResponse>(response),
            providesTags: ['Movies']
        }),
        searchMovies: builder.query<
            SearchResultDto[],
            { query: string; page?: number }
        >({
            query: ({ query, page = 1 }) => ({
                url: 'search',
                params: { query, page }
            }),
            transformResponse: (response: unknown) =>
                mapResponse<SearchResultDto[]>(response)
        }),
        getMovieById: builder.query<TmdbMovie, number>({
            query: (movieId) => `${movieId}`,
            transformResponse: (response: unknown) =>
                mapResponse<TmdbMovie>(response),
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
