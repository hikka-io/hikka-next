import { ArticleArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { createMutation } from '../../core/useMutation';

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
    invalidateQueries: (args) => [
        queryKeys.articles.all,
        queryKeys.articles.bySlug(args.slug),
    ],
});

/**
 * Hook for deleting an article
 */
export const useDeleteArticle = createMutation({
    mutationFn: (client, slug: string) => client.articles.deleteArticle(slug),
    invalidateQueries: (slug: string) => [
        queryKeys.articles.all,
        queryKeys.articles.bySlug(slug),
    ],
});
