import { PersonSearchPaginationResponse, QuerySearchArgs } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UsePeopleSearchParams {
    args?: QuerySearchArgs;
}

/**
 * Hook for searching people
 */
export function usePeopleSearch({
    args = {},
    paginationArgs,
    ...rest
}: UsePeopleSearchParams &
    InfiniteQueryParams<PersonSearchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Function for prefetching people search results
 */
export async function prefetchPeopleSearch({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<PersonSearchPaginationResponse> &
    UsePeopleSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.people.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.people.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
