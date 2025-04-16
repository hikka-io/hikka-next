import { NovelInfoResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseNovelDetailsOptions
    extends Omit<
        UseQueryOptions<
            NovelInfoResponse,
            Error,
            NovelInfoResponse,
            ReturnType<typeof queryKeys.novel.details>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
}

/**
 * Hook for getting novel details by slug
 */
export function useNovelDetails(params: UseNovelDetailsOptions) {
    const { slug, ...options } = params;

    return useQuery(
        queryKeys.novel.details(slug),
        (client) => client.novel.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export interface PrefetchNovelDetailsParams extends UseNovelDetailsOptions {
    queryClient: QueryClient;
}

export async function prefetchNovelDetails(params: PrefetchNovelDetailsParams) {
    const { queryClient, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.novel.details(slug),
        (client) => client.novel.getBySlug(slug),
        options,
    );
}
