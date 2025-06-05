'use client';

import { CompaniesPaginationResponse } from '@hikka/client';

import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '@/client/useInfiniteQuery';
import { queryKeys } from '@/core';
import { UseCompaniesSearchParams } from '@/types/companies';

/**
 * Hook for searching companies
 */
export function useSearchCompanies({
    args = {},
    paginationArgs,
    ...rest
}: UseCompaniesSearchParams &
    InfiniteQueryParams<CompaniesPaginationResponse>) {
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
