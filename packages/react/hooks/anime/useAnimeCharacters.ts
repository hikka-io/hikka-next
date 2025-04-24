import { ContentCharacterPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeCharactersParams {
    slug: string;
}

/**
 * Hook for retrieving anime characters with pagination
 */
export function useAnimeCharacters({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime characters for server-side rendering
 */
export async function prefetchAnimeCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ContentCharacterPaginationResponse> &
    UseAnimeCharactersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
