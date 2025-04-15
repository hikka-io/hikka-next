import { AnimePaginationResponse } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '@/server/prefetchQuery';

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
    page?: number;
    size?: number;
}

/**
 * Hook for getting anime franchise entries by anime slug
 */
export function useAnimeFranchise(
    slug: string,
    options: UseAnimeFranchiseOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.anime.franchise(slug),
        (client) => client.anime.getFranchise(slug, page, size),
        {
            enabled: !!slug,
            ...queryOptions,
        },
    );
}

export async function prefetchAnimeFranchise(
    queryClient: QueryClient,
    slug: string,
    options: UseAnimeFranchiseOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.anime.franchise(slug),
        (client) => client.anime.getFranchise(slug, page, size),
        queryOptions,
    );
}
