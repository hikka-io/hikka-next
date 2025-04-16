import { ArticleArgs, ArticleResponse } from '@hikka/client';
import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

type UpdateArticleVariables = {
    slug: string;
    args: ArticleArgs;
};

export interface UseUpdateArticleOptions
    extends Omit<
        UseMutationOptions<ArticleResponse, Error, UpdateArticleVariables>,
        'mutationFn'
    > {}

/**
 * Hook for updating an existing article
 */
export function useUpdateArticle(
    params: UseUpdateArticleOptions = {},
): UseMutationResult<ArticleResponse, Error, UpdateArticleVariables> {
    return createMutation<ArticleResponse, Error, UpdateArticleVariables>(
        (client, { slug, args }) => client.articles.updateArticle(slug, args),
        (variables) => [
            // Invalidate the specific article
            queryKeys.articles.details(variables.slug),
            // Invalidate articles list
            queryKeys.articles.all,
        ],
    )(params);
}
