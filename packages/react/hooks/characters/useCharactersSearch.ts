import {
    CharactersSearchPaginationResponse,
    QuerySearchArgs,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseCharactersSearchParams {
    args?: QuerySearchArgs;
}

/**
 * Hook for searching characters
 */
export function useCharactersSearch({
    args = {},
    paginationArgs,
    ...rest
}: UseCharactersSearchParams &
    InfiniteQueryParams<CharactersSearchPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Function for prefetching character search results
 */
export async function prefetchCharactersSearch({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CharactersSearchPaginationResponse> &
    UseCharactersSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.characters.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.characters.search(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
