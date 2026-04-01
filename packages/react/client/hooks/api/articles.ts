'use client';

import {
    ArticleArgs,
    ArticleDocumentResponse,
    ArticlesListResponse,
    ArticlesTopResponse,
} from '@hikka/client';

import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import {
    articleBySlugOptions,
    articleStatsOptions,
    searchArticlesOptions,
} from '@/options/api/articles';
import { UseArticleParams, UseArticlesListParams } from '@/types/articles';

/**
 * Hook for getting article details
 */
export function useArticleBySlug<TResult = ArticleDocumentResponse>({
    slug,
    ...rest
}: UseArticleParams & QueryParams<ArticleDocumentResponse, TResult>) {
    const { client } = useHikkaClient();
    return useQuery<ArticleDocumentResponse, Error, TResult>({
        ...articleBySlugOptions(client, { slug }),
        ...rest,
    });
}

/**
 * Hook for creating a new article
 */
export const useCreateArticle = createMutation({
    mutationFn: (client, args: ArticleArgs) =>
        client.articles.createArticle(args),
    invalidateQueries: () => [queryKeys.articles.all],
});

/**
 * Hook for updating an existing article
 */
export const useUpdateArticle = createMutation({
    mutationFn: (client, args: { slug: string; article: ArticleArgs }) =>
        client.articles.updateArticle(args.slug, args.article),
    invalidateQueries: (args) => [queryKeys.articles.all],
});

/**
 * Hook for deleting an article
 */
export const useDeleteArticle = createMutation({
    mutationFn: (client, slug: string) => client.articles.deleteArticle(slug),
    invalidateQueries: (slug: string) => [queryKeys.articles.all],
});

/**
 * Hook for getting article stats (top authors and tags)
 */
export function useArticleStats({
    ...rest
}: QueryParams<ArticlesTopResponse> = {}) {
    const { client } = useHikkaClient();
    return useQuery({
        ...articleStatsOptions(client),
        ...rest,
    });
}

/**
 * Hook for getting a list of articles
 */
export function useSearchArticles({
    args = {},
    paginationArgs,
    ...rest
}: UseArticlesListParams & InfiniteQueryParams<ArticlesListResponse>) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        searchArticlesOptions(client, { args, paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
