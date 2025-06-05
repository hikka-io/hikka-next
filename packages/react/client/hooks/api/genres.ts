'use client';

import { GenreListResponse } from '@hikka/client';

import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';

/**
 * Hook for retrieving all genres
 */
export function useGenres<TResult = GenreListResponse>({
    ...rest
}: QueryParams<GenreListResponse, TResult> = {}) {
    return useQuery<GenreListResponse, Error, TResult>({
        queryKey: queryKeys.genres.list(),
        queryFn: (client) => client.genres.getGenres(),
        ...rest,
    });
}
