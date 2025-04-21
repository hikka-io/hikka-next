import { FranchiseResponse, RelatedContentTypeEnum } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving franchise information for content
 */
export function useFranchise(
    contentType: RelatedContentTypeEnum,
    slug: string,
    options?: Omit<
        UseQueryOptions<FranchiseResponse, Error, FranchiseResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: (client) => client.related.getFranchise(contentType, slug),
        options: options || {},
    });
}

/**
 * Prefetches franchise information for server-side rendering
 */
export async function prefetchFranchise(
    queryClient: QueryClient,
    contentType: RelatedContentTypeEnum,
    slug: string,
    options?: Omit<
        FetchQueryOptions<FranchiseResponse, Error, FranchiseResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: (client) => client.related.getFranchise(contentType, slug),
        options,
    });
}
