import type { EditsTopPaginationResponse } from '@hikka/client';

import type { UseTopEditorsListParams } from '@/types/stats';
import { useHikkaClient } from '@/client/provider/useHikkaClient';
import {
    type InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { topEditorsListOptions } from '@/options/api/stats';

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
