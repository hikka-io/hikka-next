'use client';

import { GenreListResponse } from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { QueryParams, useQuery } from '@/client/useQuery';
import { genresOptions } from '@/options/api/genres';

/**
 * Hook for retrieving all genres
 */
export function useGenres<TResult = GenreListResponse>({
    ...rest
}: QueryParams<GenreListResponse, TResult> = {}) {
    const { client } = useHikkaClient();
    return useQuery<GenreListResponse, Error, TResult>({
        ...genresOptions(client),
        ...rest,
    });
}
