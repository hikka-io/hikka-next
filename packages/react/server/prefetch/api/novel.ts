import {
    novelBySlugOptions,
    novelCharactersOptions,
    searchNovelsOptions,
} from '@/options/api/novel';
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
}: PrefetchQueryParams & UseNovelInfoParams) {
    return prefetchQuery({
        optionsFactory: (client) => novelBySlugOptions(client, { slug }),
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
}: PrefetchInfiniteQueryParams & UseNovelCharactersParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            novelCharactersOptions(client, { slug, paginationArgs }),
        ...rest,
    });
}

/**
 * Prefetches novel search results for server-side rendering
 */
export async function prefetchSearchNovels({
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseSearchNovelsParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchNovelsOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
