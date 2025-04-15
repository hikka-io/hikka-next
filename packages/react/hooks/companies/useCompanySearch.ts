import {
    CompaniesPaginationResponse,
    CompaniesSearchArgs,
} from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseCompanySearchOptions
    extends Omit<
        UseQueryOptions<
            CompaniesPaginationResponse,
            Error,
            CompaniesPaginationResponse,
            ReturnType<typeof queryKeys.companies.search>
        >,
        'queryKey' | 'queryFn'
    > {
    page?: number;
    size?: number;
}

/**
 * Hook for searching companies
 */
export function useCompanySearch(
    args: CompaniesSearchArgs,
    options: UseCompanySearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.companies.search(args),
        (client) => client.companies.search(args, page, size),
        queryOptions,
    );
}

export async function prefetchCompanySearch(
    queryClient: QueryClient,
    args: CompaniesSearchArgs,
    options: UseCompanySearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.companies.search(args),
        (client) => client.companies.search(args, page, size),
        queryOptions,
    );
}
