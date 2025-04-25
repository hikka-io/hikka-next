import {
    ReadContentType,
    ReadPaginationResponse,
    ReadSearchArgs,
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

export interface UseReadListParams {
    contentType: ReadContentType;
    username: string;
    args: ReadSearchArgs;
}

/**
 * Hook for retrieving a user's read list
 */
export function useReadList({
    contentType,
    username,
    args,
    paginationArgs,
    ...rest
}: UseReadListParams & InfiniteQueryParams<ReadPaginationResponse>) {
    return useInfiniteQuery({
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.searchUserReads(contentType, username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches a user's read list for server-side rendering
 */
export async function prefetchReadList({
    contentType,
    username,
    args,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<ReadPaginationResponse> & UseReadListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.read.list(
            contentType,
            username,
            args,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.read.searchUserReads(contentType, username, args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
