import { FranchiseResponse, RelatedContentTypeEnum } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseFranchiseOptions
    extends Omit<
        UseQueryOptions<
            FranchiseResponse,
            Error,
            FranchiseResponse,
            ReturnType<typeof queryKeys.related.franchise>
        >,
        'queryKey' | 'queryFn'
    > {}

/**
 * Hook for getting franchise information for content
 */
export function useFranchise(
    contentType: RelatedContentTypeEnum,
    slug: string,
    options: UseFranchiseOptions = {},
) {
    return useQuery(
        queryKeys.related.franchise(contentType, slug),
        (client) => client.related.getFranchise(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export async function prefetchFranchise(
    queryClient: QueryClient,
    contentType: RelatedContentTypeEnum,
    slug: string,
    options: UseFranchiseOptions = {},
) {
    return await prefetchQuery(
        queryClient,
        queryKeys.related.franchise(contentType, slug),
        (client) => client.related.getFranchise(contentType, slug),
        options,
    );
}
