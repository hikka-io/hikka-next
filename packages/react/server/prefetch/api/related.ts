import { franchiseOptions } from '@/options/api/related';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import { UseFranchiseParams } from '@/types/related';

/**
 * Prefetches franchise information for server-side rendering
 */
export async function prefetchFranchise({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams & UseFranchiseParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            franchiseOptions(client, { contentType, slug }),
        ...rest,
    });
}
