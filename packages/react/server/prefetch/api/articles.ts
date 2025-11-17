import {
    ArticleDocumentResponse,
    ArticlesListResponse,
    ArticlesTopResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
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
}: PrefetchQueryParams<ArticleDocumentResponse> & UseArticleParams) {
    return prefetchQuery({
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: (client) => client.articles.getArticleBySlug(slug),
        ...rest,
    });
}

/**
 * Function for prefetching article stats
 */

export async function prefetchArticleStats({
    ...rest
}: PrefetchQueryParams<ArticlesTopResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.articles.stats(),
        queryFn: (client) => client.articles.getArticleStats(),
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
}: PrefetchInfiniteQueryParams<ArticlesListResponse> & UseArticlesListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.articles.searchArticles(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
