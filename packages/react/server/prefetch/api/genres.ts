import { GenreListResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';

/**
 * Prefetches all genres for server-side rendering
 */
export async function prefetchGenres({
    ...rest
}: PrefetchQueryParams<GenreListResponse> = {}) {
    return prefetchQuery({
        queryKey: queryKeys.genres.list(),
        queryFn: (client) => client.genres.getGenres(),
        ...rest,
    });
}
