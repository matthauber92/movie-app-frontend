import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mapResponse } from '../../common/utils/transformResponse';
import { type TmdbTvResult, TmdbTvSearchResponse } from '../interfaces/Tv.ts';
import type { SearchResultDto } from '../interfaces/Movie.ts';

const baseUrl = `/api/tv`;

export const tvApiSlice = createApi({
    reducerPath: 'tvApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ['Tv', 'TvShow'],
    endpoints: (builder) => ({
        getTv: builder.query<
            TmdbTvSearchResponse,
            { page?: number; genreIds?: number }
        >({
            query: ({ page = 1, genreIds }) => ({
                url: '',
                params: { page, genreIds }
            }),
            transformResponse: (response: unknown) =>
                mapResponse<TmdbTvSearchResponse>(response),
            providesTags: ['Tv']
        }),

        searchTv: builder.query<
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
        getTvById: builder.query<TmdbTvResult, number>({
            query: (tvId) => `${tvId}`,
            transformResponse: (response: unknown) =>
                mapResponse<TmdbTvResult>(response),
            providesTags: (_result, _error, id) => [
                { type: 'TvShow', id }
            ]
        })
    })
});


export const {
    useGetTvQuery,
    useSearchTvQuery,
    useGetTvByIdQuery
} = tvApiSlice;
