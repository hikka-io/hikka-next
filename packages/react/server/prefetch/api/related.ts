import { FranchiseResponse } from '@hikka/client';

import { queryKeys } from '@/core';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import { UseFranchiseParams } from '@/types/related';

/**
 * Prefetches franchise information for server-side rendering
 */
export async function prefetchFranchise({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<FranchiseResponse> & UseFranchiseParams) {
    return prefetchQuery({
        queryKey: queryKeys.related.franchise(contentType, slug),
        queryFn: (client) => client.related.getFranchise(contentType, slug),
        ...rest,
    });
}
