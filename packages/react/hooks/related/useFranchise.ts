import { FranchiseResponse, RelatedContentType } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseFranchiseParams {
    contentType: RelatedContentType;
    slug: string;
}

/**
 * Hook for retrieving franchise information for content
 */
export function useFranchise({
    contentType,
    slug,
    options,
    ...rest
}: UseFranchiseParams & QueryParams<FranchiseResponse>) {
    return useQuery({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: (client) => client.related.getFranchise(contentType, slug),
        options: {
            ...options,
            select: (data: FranchiseResponse) => ({
                list: [
                    ...data.anime.flat(),
                    ...data.manga.flat(),
                    ...data.novel.flat(),
                ],
            }),
        },
        ...rest,
    });
}

/**
 * Prefetches franchise information for server-side rendering
 */
export async function prefetchFranchise({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<FranchiseResponse> & UseFranchiseParams) {
    return prefetchQuery({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: (client) => client.related.getFranchise(contentType, slug),
        ...rest,
    });
}
