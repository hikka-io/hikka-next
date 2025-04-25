import {
    CompaniesPaginationResponse,
    CompaniesSearchArgs,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseCompaniesSearchParams {
    args?: CompaniesSearchArgs;
}

/**
 * Hook for searching companies
 */
export function useCompaniesSearch({
    args = {},
    paginationArgs,
    ...rest
}: UseCompaniesSearchParams &
    InfiniteQueryParams<CompaniesPaginationResponse> = {}) {
    return useInfiniteQuery({
        queryKey: queryKeys.companies.search(args, paginationArgs),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.companies.searchCompanies(args, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}

/**
 * Prefetches companies search for server-side rendering
 */
export async function prefetchCompaniesSearch({
    args = {},
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<CompaniesPaginationResponse> &
    UseCompaniesSearchParams = {}) {
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
