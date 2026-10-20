import type { Query, QueryClient } from '@tanstack/react-query';

const pathSlug = (query: Query) => {
    const [key] = query.queryKey;
    if (typeof key !== 'object' || key === null || !('path' in key)) {
        return undefined;
    }
    const { path } = key as { path?: { slug?: unknown } };
    return path?.slug;
};

/** Pull-to-refresh on a detail page: refetch every mounted query keyed by its slug. */
export function refetchContentDetail(queryClient: QueryClient, slug: string) {
    return queryClient.refetchQueries({
        type: 'active',
        predicate: (query) => pathSlug(query) === slug,
    });
}
