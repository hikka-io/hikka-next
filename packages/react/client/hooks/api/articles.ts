'use client';

import {
    ArticleArgs,
    ArticleDocumentResponse,
    ArticlesListResponse,
    ArticlesTopResponse,
} from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { createMutation } from '@/client/useMutation';
import { QueryParams, useQuery } from '@/client/useQuery';
import { queryKeys } from '@/core';
import { UseArticleParams, UseArticlesListParams } from '@/types/articles';

/**
 * Hook for getting article details
 */
export function useArticleBySlug<TResult = ArticleDocumentResponse>({
    slug,
    ...rest
}: UseArticleParams & QueryParams<ArticleDocumentResponse, TResult>) {
    return useQuery<ArticleDocumentResponse, Error, TResult>({
        queryKey: queryKeys.articles.bySlug(slug),
        queryFn: (client) => client.articles.getArticleBySlug(slug),
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
    return useQuery({
        queryKey: queryKeys.articles.stats(),
        queryFn: (client) => client.articles.getArticleStats(),
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
    return useInfiniteQuery({
        queryKey: queryKeys.articles.list(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.articles.searchArticles(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
