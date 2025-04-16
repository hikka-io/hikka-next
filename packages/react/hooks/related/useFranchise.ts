import { FranchiseResponse, RelatedContentTypeEnum } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
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
    > {
    contentType: RelatedContentTypeEnum;
    slug: string;
}

/**
 * Hook for getting franchise information for content
 */
export function useFranchise(params: UseFranchiseOptions) {
    const { contentType, slug, ...options } = params;

    return useQuery(
        queryKeys.related.franchise(contentType, slug),
        (client) => client.related.getFranchise(contentType, slug),
        {
            enabled: !!contentType && !!slug,
            ...options,
        },
    );
}

export interface PrefetchFranchiseParams extends UseFranchiseOptions {
    queryClient: QueryClient;
}

export async function prefetchFranchise(params: PrefetchFranchiseParams) {
    const { queryClient, contentType, slug, ...options } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.related.franchise(contentType, slug),
        (client) => client.related.getFranchise(contentType, slug),
        options,
    );
}
