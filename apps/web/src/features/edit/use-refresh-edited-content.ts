import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { type AnyRouter, useRouter } from '@tanstack/react-router';

import { invalidateContentBySlug } from '@/utils/api/invalidate-content-state';

export async function refreshEditedContent(
    queryClient: QueryClient,
    router: AnyRouter,
    slug: string,
) {
    const filter = (match: { params: Record<string, string> }) =>
        match.params.slug === slug;

    await invalidateContentBySlug(queryClient, slug);
    // Head meta is built from the loader's snapshot, and defaultStaleTime: Infinity never reloads a cached match.
    await router.invalidate({ filter });
}

export function useRefreshEditedContent() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return (slug: string) => refreshEditedContent(queryClient, router, slug);
}
