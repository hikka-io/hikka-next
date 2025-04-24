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

export interface UseMangaCharactersParams {
    slug: string;
}

/**
 * Hook for retrieving manga characters with pagination
 */
export function useMangaCharacters({
    slug,
    paginationArgs,
    ...rest
}: UseMangaCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches manga characters for server-side rendering
 */
export async function prefetchMangaCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ContentCharacterPaginationResponse> &
    UseMangaCharactersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.manga.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.manga.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
