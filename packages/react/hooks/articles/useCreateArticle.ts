import { ArticleArgs, ArticleResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseCreateArticleOptions
    extends Omit<
        UseMutationOptions<ArticleResponse, Error, ArticleArgs>,
        'mutationFn'
    > {}

/**
 * Hook for creating a new article
 */
export function useCreateArticle(
    params: UseCreateArticleOptions = {},
): UseMutationResult<ArticleResponse, Error, ArticleArgs> {
    return createMutation<ArticleResponse, Error, ArticleArgs>(
        (client, args) => client.articles.createArticle(args),
        () => [
            // Invalidate articles list
            queryKeys.articles.all,
        ],
    )(params);
}
