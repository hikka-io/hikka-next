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
    args: CompaniesSearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for searching companies
 */
export function useCompanySearch(params: UseCompanySearchOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.companies.search(args),
        (client) => client.companies.search(args, page, size),
        queryOptions,
    );
}

export interface PrefetchCompanySearchParams extends UseCompanySearchOptions {
    queryClient: QueryClient;
}

export async function prefetchCompanySearch(
    params: PrefetchCompanySearchParams,
) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.companies.search(args),
        (client) => client.companies.search(args, page, size),
        queryOptions,
    );
}
