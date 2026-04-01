import { topEditorsListOptions } from '@/options/api/stats';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';

/**
 * Prefetches top editors for server-side rendering
 */
export async function prefetchTopEditorsList({
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams = {}) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            topEditorsListOptions(client, { paginationArgs }),
        ...rest,
    });
}
