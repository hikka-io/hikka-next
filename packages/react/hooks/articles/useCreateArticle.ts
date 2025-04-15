import { ArticleArgs, ArticleResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

/**
 * Hook for creating a new article
 */
export function useCreateArticle(
    options?: Omit<
        UseMutationOptions<ArticleResponse, Error, ArticleArgs>,
        'mutationFn'
    >,
): UseMutationResult<ArticleResponse, Error, ArticleArgs> {
    return createMutation<ArticleResponse, Error, ArticleArgs>(
        (client, args) => client.articles.createArticle(args),
        () => [
            // Invalidate articles list
            queryKeys.articles.all,
        ],
    )(options);
}
