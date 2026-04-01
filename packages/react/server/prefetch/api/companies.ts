import { searchCompaniesOptions } from '@/options/api/companies';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { UseCompaniesSearchParams } from '@/types/companies';

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
