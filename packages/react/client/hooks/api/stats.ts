'use client';

import { EditsTopPaginationResponse } from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { queryKeys } from '@/core';
import { UseTopEditorsListParams } from '@/types/stats';

/**
 * Hook for retrieving top editors
 */
export function useTopEditorsList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<EditsTopPaginationResponse> &
    UseTopEditorsListParams = {}) {
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
