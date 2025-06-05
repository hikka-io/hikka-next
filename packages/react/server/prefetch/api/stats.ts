import { EditsTopPaginationResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { UseTopEditorsListParams } from '@/types/stats';

/**
 * Prefetches top editors for server-side rendering
 */
export async function prefetchTopEditorsList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<EditsTopPaginationResponse> &
    UseTopEditorsListParams = {}) {
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
