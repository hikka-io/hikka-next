import { CompaniesPaginationResponse } from '@hikka/client';

import { queryKeys } from '@/core';
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
}: PrefetchInfiniteQueryParams<CompaniesPaginationResponse> &
    UseCompaniesSearchParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.companies.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.companies.searchCompanies(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
