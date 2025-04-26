import {
    ContentCharacterPaginationResponse,
    NovelInfoResponse,
    NovelPaginationResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseNovelCharactersParams,
    UseNovelInfoParams,
    UseSearchNovelsParams,
} from '@/types/novel';

/**
 * Prefetches novel details for server-side rendering
 */
export async function prefetchNovelBySlug({
    slug,
    ...rest
}: PrefetchQueryParams<NovelInfoResponse> & UseNovelInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.novel.details(slug),
        queryFn: (client) => client.novel.getNovelBySlug(slug),
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
            client.novel.getNovelCharacters(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches novel search results for server-side rendering
 */
export async function prefetchSearchNovels({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<NovelPaginationResponse> &
    UseSearchNovelsParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.novel.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.novel.searchNovels(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
