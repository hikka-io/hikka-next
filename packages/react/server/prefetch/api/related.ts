import type { UseFranchiseParams } from '@/types/related';
import { franchiseOptions } from '@/options/api/related';
import {
    type PrefetchQueryParams,
    prefetchQuery,
} from '@/server/prefetchQuery';

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
