import { ContentCharacterPaginationResponse } from '@hikka/client';
import { QueryClient, UseInfiniteQueryOptions } from '@tanstack/react-query';

import { prefetchInfiniteQuery } from '@/server/prefetchInfiniteQuery';

import { useInfiniteQuery } from '../core';
import { queryKeys } from '../core/queryKeys';

export interface UseAnimeCharactersOptions
    extends Omit<
        UseInfiniteQueryOptions<
            ContentCharacterPaginationResponse,
            Error,
            ContentCharacterPaginationResponse,
            ContentCharacterPaginationResponse,
            ReturnType<typeof queryKeys.anime.characters>,
            number
        >,
        'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime characters by anime slug
 */
export function useAnimeCharacters(params: UseAnimeCharactersOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useInfiniteQuery(
        queryKeys.anime.characters(slug),
        (client, pageParam = page) =>
            client.anime.getCharacters(slug, pageParam, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchAnimeCharactersParams
    extends UseAnimeCharactersOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeCharacters(
    params: PrefetchAnimeCharactersParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchInfiniteQuery(
        queryClient,
        queryKeys.anime.characters(slug),
        (client) => client.anime.getCharacters(slug, page, size),
        queryOptions,
    );
}
