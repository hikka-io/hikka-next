import { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { queryKeys } from '../core/queryKeys';
import { createMutation } from '../core/useMutation';

export interface UseDeleteArticleOptions
    extends Omit<UseMutationOptions<void, Error, string>, 'mutationFn'> {}

/**
 * Hook for deleting an article
 */
export function useDeleteArticle(
    params: UseDeleteArticleOptions = {},
): UseMutationResult<void, Error, string> {
    return createMutation<void, Error, string>(
        (client, slug) => client.articles.deleteArticle(slug),
        (slug) => [
            // Invalidate the specific article
            queryKeys.articles.details(slug),
            // Invalidate articles list
            queryKeys.articles.all,
        ],
    )(params);
}
