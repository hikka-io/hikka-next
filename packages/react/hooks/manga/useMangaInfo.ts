import { MangaInfoResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseMangaInfoParams {
    slug: string;
}

/**
 * Hook for retrieving manga details by slug
 */
export function useMangaInfo<TResult = MangaInfoResponse>({
    slug,
    ...rest
}: UseMangaInfoParams & QueryParams<MangaInfoResponse, TResult>) {
    return useQuery<MangaInfoResponse, Error, TResult>({
        queryKey: queryKeys.manga.details(slug),
        queryFn: (client) => client.manga.getBySlug(slug),
        ...rest,
    });
}

/**
 * Prefetches manga details for server-side rendering
 */
export async function prefetchMangaInfo({
    slug,
    ...rest
}: PrefetchQueryParams<MangaInfoResponse> & UseMangaInfoParams) {
    return prefetchQuery({
        queryKey: queryKeys.manga.details(slug),
        queryFn: (client) => client.manga.getBySlug(slug),
        ...rest,
    });
}
