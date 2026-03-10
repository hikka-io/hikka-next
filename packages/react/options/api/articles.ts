import { HikkaClient, PaginationArgs } from '@hikka/client';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseArticleParams, UseArticlesListParams } from '@/types/articles';

export function articleBySlugOptions(
    client: HikkaClient,
    { slug }: UseArticleParams,
) {
    return queryOptions({
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: () => client.articles.getArticleBySlug(slug),
    });
}

export function articleStatsOptions(client: HikkaClient) {
    return queryOptions({
        queryKey: queryKeys.articles.stats(),
        queryFn: () => client.articles.getArticleStats(),
    });
}

export function searchArticlesOptions(
    client: HikkaClient,
    {
        args = {},
        paginationArgs,
    }: UseArticlesListParams & { paginationArgs?: PaginationArgs },
) {
    return infiniteQueryOptions({
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: ({ pageParam }) =>
            client.articles.searchArticles(args, {
                page: pageParam,
                size: paginationArgs?.size,
            }),
        initialPageParam: paginationArgs?.page || 1,
        getNextPageParam: (lastPage) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? null : nextPage;
        },
    });
}
