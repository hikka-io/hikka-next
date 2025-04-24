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

export interface UseNovelCharactersParams {
    slug: string;
}

/**
 * Hook for retrieving novel characters
 */
export function useNovelCharacters({
    slug,
    paginationArgs,
    ...rest
}: UseNovelCharactersParams &
    InfiniteQueryParams<ContentCharacterPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.novel.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches novel characters for server-side rendering
 */
export async function prefetchNovelCharacters({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ContentCharacterPaginationResponse> &
    UseNovelCharactersParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.novel.characters(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.getCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
