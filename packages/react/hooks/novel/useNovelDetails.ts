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
    > {}

/**
 * Hook for getting novel details by slug
 */
export function useNovelDetails(
    slug: string,
    options: UseNovelDetailsOptions = {},
) {
    return useQuery(
        queryKeys.novel.details(slug),
        (client) => client.novel.getBySlug(slug),
        {
            enabled: !!slug,
            ...options,
        },
    );
}

export async function prefetchNovelDetails(
    queryClient: QueryClient,
    slug: string,
    options: UseNovelDetailsOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.novel.details(slug),
        (client) => client.novel.getBySlug(slug),
        options,
    );
}
