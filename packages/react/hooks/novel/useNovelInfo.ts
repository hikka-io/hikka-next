import { NovelInfoResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseNovelInfoParams {
    slug: string;
}

/**
 * Hook for retrieving novel details by slug
 */
export function useNovelInfo<TResult = NovelInfoResponse>({
    slug,
    ...rest
}: UseNovelInfoParams & QueryParams<NovelInfoResponse, TResult>) {
    return useQuery<NovelInfoResponse, Error, TResult>({
        queryKey: queryKeys.novel.details(slug),
        queryFn: (client) => client.novel.getBySlug(slug),
        ...rest,
    });
}

/**
 * Prefetches novel details for server-side rendering
 */
export async function prefetchNovelInfo({
    slug,
    ...rest
}: PrefetchQueryParams<NovelInfoResponse> & UseNovelInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.novel.details(slug),
        queryFn: (client) => client.novel.getBySlug(slug),
        ...rest,
    });
}
