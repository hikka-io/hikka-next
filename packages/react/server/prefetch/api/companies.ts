import type { UseCompaniesSearchParams } from '@/types/companies';
import { searchCompaniesOptions } from '@/options/api/companies';
import {
    type PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';

/**
 * Prefetches companies search for server-side rendering
 */
export async function prefetchSearchCompanies({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams & UseCompaniesSearchParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            searchCompaniesOptions(client, { args, paginationArgs }),
        ...rest,
    });
}
