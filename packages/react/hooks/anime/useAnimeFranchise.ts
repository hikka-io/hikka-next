import { AnimePaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseAnimeFranchiseParams {
    slug: string;
}

/**
 * Hook for retrieving anime franchise entries with pagination
 */
export function useAnimeFranchise({
    slug,
    paginationArgs,
    ...rest
}: UseAnimeFranchiseParams & InfiniteQueryParams<AnimePaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.anime.franchise(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeFranchise(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches anime franchise entries for server-side rendering
 */
export async function prefetchAnimeFranchise({
    slug,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<AnimePaginationResponse> &
    UseAnimeFranchiseParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.anime.franchise(slug, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.anime.getAnimeFranchise(slug, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
