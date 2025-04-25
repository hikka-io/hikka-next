import { EditsTopPaginationResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

/**
 * Hook for retrieving top editors
 */
export function useTopEditorsList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<EditsTopPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.stats.editsTop(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.stats.getTopEditorsList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches top editors for server-side rendering
 */
export async function prefetchTopEditorsList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<EditsTopPaginationResponse> = {}) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.stats.editsTop(paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.stats.getTopEditorsList({
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
