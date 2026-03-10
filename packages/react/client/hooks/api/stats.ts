'use client';

import { EditsTopPaginationResponse } from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import { topEditorsListOptions } from '@/options/api/stats';
import { UseTopEditorsListParams } from '@/types/stats';

/**
 * Hook for retrieving top editors
 */
export function useTopEditorsList({
    paginationArgs,
    ...rest
}: InfiniteQueryParams<EditsTopPaginationResponse> &
    UseTopEditorsListParams = {}) {
    const { client } = useHikkaClient();
    const { queryKey, queryFn, initialPageParam, getNextPageParam } =
        topEditorsListOptions(client, { paginationArgs });
    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam,
        getNextPageParam,
        ...rest,
    });
}
