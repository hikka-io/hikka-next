import { AnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseAnimeFranchiseOptions
    extends Omit<
        UseQueryOptions<
            AnimePaginationResponse,
            Error,
            AnimePaginationResponse,
            ReturnType<typeof queryKeys.anime.franchise>
        >,
        'queryKey' | 'queryFn'
    > {
    slug: string;
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime franchise entries by anime slug
 */
export function useAnimeFranchise(params: UseAnimeFranchiseOptions) {
    const { slug, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.anime.franchise(slug),
        (client) => client.anime.getFranchise(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export interface PrefetchAnimeFranchiseParams extends UseAnimeFranchiseOptions {
    queryClient: QueryClient;
}

export async function prefetchAnimeFranchise(
    params: PrefetchAnimeFranchiseParams,
) {
    const { queryClient, slug, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.franchise(slug),
        (client) => client.anime.getFranchise(slug, page, size),
        queryOptions,
    );
}
