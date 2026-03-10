import {
    articleBySlugOptions,
    articleStatsOptions,
    searchArticlesOptions,
} from '@/options/api/articles';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import { UseArticleParams, UseArticlesListParams } from '@/types/articles';

/**
 * Function for prefetching article details
 */

export async function prefetchArticleBySlug({
    slug,
    ...rest
}: PrefetchQueryParams & UseArticleParams) {
    return prefetchQuery({
        optionsFactory: (client) => articleBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Function for prefetching article stats
 */

export async function prefetchArticleStats({
    ...rest
}: PrefetchQueryParams = {}) {
    return prefetchQuery({
        optionsFactory: (client) => articleStatsOptions(client),
        ...rest,
    });
}

/**
 * Function for prefetching articles list
 */

export async function prefetchSearchArticles({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseArticlesListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchArticlesOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
